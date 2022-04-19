import logging
import os

from union_annotation.scripts.utils import read_assignments_file, validate_experiment_id, create_client, \
    get_last_output_file_path, prod_prompt_validation

logging.basicConfig()
EXPERIMENT_ID = os.getenv("EXPERIMENT_ID")
validate_experiment_id(EXPERIMENT_ID)
output_directory = f"output/{EXPERIMENT_ID}"
ENV = os.getenv("ENV")
prod_prompt_validation(ENV)

assignments_file_name = os.getenv("FILE_NAME")
if not assignments_file_name:
    assignments_file_name = get_last_output_file_path(output_directory, regex_pattern=".*_hits_assignments_.*\.csv")


df_assignments = read_assignments_file(assignments_file_name, output_directory)
mtc = create_client()

for idx, assignment_row in df_assignments.iterrows():
    assignment_id = assignment_row['AssignmentId']
    try:
        print(mtc.approve_assignment(AssignmentId=assignment_id))
    except:
        logging.exception(f"failed assignment_id {assignment_id}")
