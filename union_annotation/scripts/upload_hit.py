import json
import os
import re
import pandas as pd

import boto3
import requests
from boto.mturk.question import HTMLQuestion
import subprocess

MAX_ASSIGNMENTS = int(os.getenv("MAX_ASSIGNMENTS", 2))
LIFETIME_IN_SECONDS = int(os.getenv("LIFETIME_IN_SECONDS", 60))
ASSIGNMENT_DURATION_IN_SECONDS = int(os.getenv("ASSIGNMENT_DURATION_IN_SECONDS", 60 * 10))
SERVER_URL = os.getenv("SERVER_URL")


def create_client():
    return boto3.client(
        'mturk',
        endpoint_url='https://mturk-requester-sandbox.us-east-1.amazonaws.com',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    )


def build_on_remote_server():
    # run build remotely
    subprocess.Popen(
        f"ssh {os.getenv('SERVER_HOST')} 'cd {os.getenv('SERVER_PATH')} && git pull origin main && npm install && npm run build'",
        shell=True).communicate()

    # find build file name
    build_files = requests.get(f"{SERVER_URL}/static/js/").json()
    js_build_file_name = [build_file['name'] for build_file in build_files if
                          build_file['name'].startswith('main') and build_file['name'].endswith('.js')][0]

    return js_build_file_name


def build_locally(force_build=False):
    # build index if doesn't exist
    if not os.path.exists("../build/index.html") or force_build:
        subprocess.run(['npm', 'run', 'build'])

    # read build index
    with open("../build/index.html") as f:
        index_html = f.read()

    return index_html


def inject_remote(index_html, js_build_file_name):
    # replace js name in HTML
    index_html = re.sub(re.compile("/static/js/main\..*?\.js"), f"{SERVER_URL}/static/js/{js_build_file_name}",
                        index_html)

    return index_html


def inject_data(index_html, datapoint):
    # inject data into HTML
    index_html = index_html.replace("<data_placeholder>", json.dumps(datapoint))

    return index_html


def publish_hit(index_html):
    # The first parameter is the HTML content
    # The second is the height of the frame it will be shown in
    # Check out the documentation on HTMLQuestion for more details
    html_question = HTMLQuestion(index_html, 500)

    # These parameters define the HIT that will be created
    # question is what we defined above
    # max_assignments is the # of unique Workers you're requesting
    # title, description, and keywords help Workers find your HIT
    # duration is the # of seconds Workers have to complete your HIT
    # reward is what Workers will be paid when you approve their work
    # Check out the documentation on CreateHIT for more details
    response = mtc.create_hit(Question=html_question.get_as_xml(),
                              MaxAssignments=MAX_ASSIGNMENTS,
                              Title="Merge two sentences into one complete sentence",
                              Description="In this task, you will highlight the differences between two sentences and merge them into one sentence. More specifically, all of the information conveyed in each sentence should appear in the merged sentence.",
                              Keywords="nlp,language,fusion",
                              Reward="0.5",
                              LifetimeInSeconds=LIFETIME_IN_SECONDS,
                              AssignmentDurationInSeconds=ASSIGNMENT_DURATION_IN_SECONDS
                              )

    # The response included several fields that will be helpful later
    hit_type_id = response['HIT']['HITTypeId']
    hit_id = response['HIT']['HITId']
    print("Your HIT has been created. You can see it at this link:")
    print("https://workersandbox.mturk.com/mturk/preview?groupId={}".format(hit_type_id))
    print("Your HIT ID is: {}".format(hit_id))


def read_data():
    df = pd.read_csv("../../data/task_data_sample.csv")

    for datapoint in df.to_dict("records"):
        yield datapoint


mtc = create_client()
index_html = build_locally(force_build=False)
js_build_file_name = build_on_remote_server()
index_html = inject_remote(index_html, js_build_file_name)
for datapoint in read_data():
    injected_index_html = inject_data(index_html, datapoint)
    publish_hit(injected_index_html)
