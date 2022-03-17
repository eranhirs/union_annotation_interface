import json
import os
import re

import boto3
import requests
from boto.mturk.question import HTMLQuestion
import subprocess

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
    # subprocess.run(['ssh', 'hirsche5@nlp.lnx.biu.ac.il', '"ls ~/union_annotation_interface/union_annotation"'])
    subprocess.Popen(
        f"ssh {os.getenv('SERVER_HOST')} 'cd {os.getenv('SERVER_PATH')} && git pull origin main && npm run build'",
        shell=True).communicate()

    # find build file name
    build_files = requests.get(f"{SERVER_URL}/static/js/").json()
    js_build_file_name = [build_file['name'] for build_file in build_files if
                          build_file['name'].startswith('main') and build_file['name'].endswith('.js')][0]

    return js_build_file_name


def build_locally():
    # build index if doesn't exist
    if not os.path.exists("../build/index.html"):
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


def inject_data(index_html):
    # inject data into HTML
    data = {"name": "blah"}
    index_html = index_html.replace("<data_placeholder>", json.dumps(data))

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
                              MaxAssignments=1,
                              Title="Answer a simple question",
                              Description="Help research a topic",
                              Keywords="question, answer, research",
                              Reward="0.5",
                              LifetimeInSeconds=60,
                              AssignmentDurationInSeconds=60
                              )

    # The response included several fields that will be helpful later
    hit_type_id = response['HIT']['HITTypeId']
    hit_id = response['HIT']['HITId']
    print("Your HIT has been created. You can see it at this link:")
    print("https://workersandbox.mturk.com/mturk/preview?groupId={}".format(hit_type_id))
    print("Your HIT ID is: {}".format(hit_id))


mtc = create_client()
index_html = build_locally()
js_build_file_name = build_on_remote_server()
index_html = inject_remote(index_html, js_build_file_name)
index_html = inject_data(index_html)
publish_hit(index_html)
