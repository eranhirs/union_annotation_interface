import logging
import os

from union_annotation.scripts.utils import create_client, validate_experiment_id, prod_prompt_validation

ENV = os.getenv("ENV")
logging.basicConfig()

QUALIFICATION_TYPE_ID = os.getenv("QUALIFICATION_TYPE_ID")

mtc = create_client()
try:
    response = mtc.list_workers_with_qualification_type(
        QualificationTypeId=QUALIFICATION_TYPE_ID
    )
    print(f"Num results: {response['NumResults']}")
    for qualification in response['Qualifications']:
        print(qualification)
except:
    logging.exception(
        f"Failed listing qualification {QUALIFICATION_TYPE_ID}, trying to fetch it")
    response = mtc.list_qualification_types(MustBeOwnedByCaller=True, MustBeRequestable=False)

    print(f"Num results: {response['NumResults']}")
    for qualification_type in response['QualificationTypes']:
        print(qualification_type)
