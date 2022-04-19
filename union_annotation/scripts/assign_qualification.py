import logging
import os

from union_annotation.scripts.utils import create_client, validate_experiment_id, prod_prompt_validation

ENV = os.getenv("ENV")
logging.basicConfig()

prod_prompt_validation(ENV)
QUALIFICATION_TYPE_ID = os.getenv("QUALIFICATION_TYPE_ID")
worker_ids = []

mtc = create_client()
for worker_id in worker_ids:
    try:
        response = mtc.associate_qualification_with_worker(
            QualificationTypeId=QUALIFICATION_TYPE_ID,
            WorkerId=worker_id,
            SendNotification=True
        )

        print(response)
    except:
        logging.exception(
            f"Failed associating qualification {QUALIFICATION_TYPE_ID} to worker_id {worker_id}, trying to fetch it")
        response = mtc.list_qualification_types(MustBeOwnedByCaller=True, MustBeRequestable=False)
