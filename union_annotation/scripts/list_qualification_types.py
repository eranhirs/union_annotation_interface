import logging
import os

from union_annotation.scripts.utils import create_client, validate_experiment_id, prod_prompt_validation

ENV = os.getenv("ENV")
logging.basicConfig()

mtc = create_client()
response = mtc.list_qualification_types(MustBeOwnedByCaller=True, MustBeRequestable=False)

print(f"Num results: {response['NumResults']}")
for qualification_type in response['QualificationTypes']:
    print(qualification_type)
