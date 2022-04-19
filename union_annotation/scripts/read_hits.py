import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

from dataclasses_json import dataclass_json

from union_annotation.scripts.utils import create_client, validate_experiment_id, read_hits_file, \
    get_last_output_file_path
import pandas as pd
import os
import xmltodict

EXPERIMENT_ID = os.getenv("EXPERIMENT_ID")
validate_experiment_id(EXPERIMENT_ID)
output_directory = f"output/{EXPERIMENT_ID}"


def parse_mturk_assignment_to_dict(mturk_assignment: Dict) -> Dict[str, any]:
    """
    mturk_assignment['Answer'] is a QuestionFormAnswers XML
    """

    answers = {}
    for item in xmltodict.parse(mturk_assignment['Answer'])['QuestionFormAnswers']['Answer']:
        question = item['QuestionIdentifier']
        answer = item['FreeText']
        try:
            value = json.loads(answer)
        except:
            try:
                value = int(answer)
            except:
                value = answer

        answers[question] = value

    return answers


@dataclass_json
@dataclass
class Assignment:
    AssignmentId: str
    WorkerId: str
    HITId: str
    AssignmentStatus: str
    AutoApprovalTime: str
    AcceptTime: str
    SubmitTime: str
    answers: Dict[str, Any]


def save_assignments(assignments: List[Assignment], hits_file_name, output_directory=f"output/{EXPERIMENT_ID}"):
    hits_file_name_no_extension = Path(hits_file_name).stem
    assignments_file_name_no_extension = f"{hits_file_name_no_extension}_assignments"
    file_name = f"{output_directory}/{assignments_file_name_no_extension}.csv"
    counter = 1
    while os.path.exists(file_name):
        file_name = f"{output_directory}/{assignments_file_name_no_extension}_{counter}.csv"
        counter += 1

    pd.DataFrame(assignments).to_csv(file_name, index=False)


hits_file_name = os.getenv("FILE_NAME")
if not hits_file_name:
    hits_file_name = get_last_output_file_path(output_directory)

output_directory = f"output/{EXPERIMENT_ID}"
df_hits = read_hits_file(hits_file_name, output_directory)
mtc = create_client()
assignments = []
for _, hit in df_hits.iterrows():
    response = mtc.list_assignments_for_hit(HITId=hit['HITId'])
    mturk_assignments = response['Assignments']
    for mturk_assignment in mturk_assignments:
        assignment = Assignment(
            mturk_assignment['AssignmentId'], mturk_assignment['WorkerId'], mturk_assignment['HITId'],
            mturk_assignment['AssignmentStatus'], mturk_assignment['AutoApprovalTime'],
            mturk_assignment['AcceptTime'],
            mturk_assignment['SubmitTime'], parse_mturk_assignment_to_dict(mturk_assignment)
        )
        assignments.append(assignment)

save_assignments(assignments, hits_file_name)
