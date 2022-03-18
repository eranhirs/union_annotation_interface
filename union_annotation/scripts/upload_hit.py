import json
import os
import re
import time
from typing import Dict, Any

import pandas as pd

import requests
from boto.mturk.question import HTMLQuestion
import subprocess

from union_annotation.scripts.utils import create_client, validate_experiment_id

EXPERIMENT_ID = os.getenv("EXPERIMENT_ID")
validate_experiment_id(EXPERIMENT_ID)
EXPERIMENT_DESCRIPTION = os.getenv("EXPERIMENT_DESCRIPTION", "")
MAX_ASSIGNMENTS = int(os.getenv("MAX_ASSIGNMENTS", 2))
LIFETIME_IN_SECONDS = int(os.getenv("LIFETIME_IN_SECONDS", 120))
ASSIGNMENT_DURATION_IN_SECONDS = int(os.getenv("ASSIGNMENT_DURATION_IN_SECONDS", 60 * 10))
SERVER_URL = os.getenv("SERVER_URL")


def build_on_remote_server() -> None:
    """
    Build remotely because mturk only hosts the html file
    """

    print("Building on remote server")

    # run build remotely
    subprocess.Popen(
        f"ssh {os.getenv('SERVER_HOST')} 'cd {os.getenv('SERVER_PATH')} && git pull origin main && npm install && npm run build'",
        shell=True).communicate()


def get_remote_file_names() -> Dict[str, str]:
    # find build file name
    remote_file_names = {}
    js_build_files = requests.get(f"{SERVER_URL}/static/js/").json()
    remote_file_names['js'] = [build_file['name'] for build_file in js_build_files if
                          build_file['name'].startswith('main') and build_file['name'].endswith('.js')][0]

    css_build_files = requests.get(f"{SERVER_URL}/static/css/").json()
    remote_file_names['css'] = [build_file['name'] for build_file in css_build_files if
                          build_file['name'].startswith('main') and build_file['name'].endswith('.css')][0]

    return remote_file_names


def build_locally(force_build=False):
    """
    Build locally only for the compiled HTML file (which is uploaded to mturk), so it is not necessary every time
    """

    print("Building locally")

    # build index if doesn't exist
    if not os.path.exists("../build/index.html") or force_build:
        subprocess.run(['npm', 'run', 'build'])

    # read build index
    with open("../build/index.html") as f:
        index_html = f.read()

    return index_html


def inject_remote(index_html, remote_file_names):
    print("Injecting remote")

    # replace js name in HTML (not putting inline because mturk has a size limit)
    js_url = f"{SERVER_URL}/static/js/{remote_file_names['js']}"
    index_html = re.sub(re.compile("/static/js/main\..*?\.js"), js_url,
                        index_html)

    # put css inline in HTML (didn't work when fetching from server)
    css_url = f"{SERVER_URL}/static/css/{remote_file_names['css']}"
    response = requests.get(css_url)
    css = response.text
    index_html = index_html.replace("</head>", f"<style>{css}</style></head>")
    # index_html = re.sub(re.compile("/static/css/main\..*?\.css"), css_url,
    #                     index_html)

    return index_html


def inject_data(index_html, datapoint):
    print("Injecting data")

    # inject data into HTML
    index_html = index_html.replace("<data_placeholder>", json.dumps(datapoint))

    return index_html


def publish_hit(index_html) -> Dict[str, Any]:
    print("Publishing hit")

    # The first parameter is the HTML content
    # The second is the height of the frame it will be shown in
    # Check out the documentation on HTMLQuestion for more details
    html_question = HTMLQuestion(index_html, 800)

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

    return {
        "HITId": hit_id,
        "HITTypeId": hit_type_id
    }


def read_data():
    df = pd.read_csv("../../data/task_data_sample.csv")

    for datapoint in df.to_dict("records"):
        yield datapoint


def save_hits(hits, hit_type_id, output_directory=f"output/{EXPERIMENT_ID}"):
    curr_time = time.strftime("%Y%m%d-%H%M%S")

    file_name = f'{curr_time}_hits.csv'
    print(f"Saving hits to '{file_name}' ; ")

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    pd.DataFrame(hits).to_csv(f'{output_directory}/{file_name}', index=False)

    experiment_details_file_name = f"{curr_time}_experiment.json"
    print(f"Saving experiment details to '{experiment_details_file_name}' ; ")

    with open(f"{output_directory}/{experiment_details_file_name}", "w") as f:
        experiment_details = {
            "id": EXPERIMENT_ID,
            "description": EXPERIMENT_DESCRIPTION,
            "max_assignments": MAX_ASSIGNMENTS,
            "lifetime_in_seconds": LIFETIME_IN_SECONDS,
            "assignment_duration_in_seconds": ASSIGNMENT_DURATION_IN_SECONDS,
            "hit_type_id": hit_type_id
        }

        f.write(json.dumps(experiment_details))


mtc = create_client()
index_html = build_locally(force_build=False)
build_on_remote_server()
remote_file_names = get_remote_file_names()
index_html = inject_remote(index_html, remote_file_names)
hits = []
for datapoint in read_data():
    injected_index_html = inject_data(index_html, datapoint)
    hits.append(publish_hit(injected_index_html))
save_hits(hits, hits[0]['HITTypeId'])
