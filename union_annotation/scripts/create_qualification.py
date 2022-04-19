import os

from union_annotation.scripts.utils import create_client, validate_experiment_id

ENV = os.getenv("ENV")

if ENV == "prod":
    print("About to run on prod, are you sure? (y/N)")
    validation_input = input()
    if validation_input != "y":
        exit()


mtc = create_client()
qualification_name = 'Sentence Union Task - Candidate Screening'
try:
    response = mtc.create_qualification_type(
        Name=qualification_name,
        Keywords='nlp,language,fusion',
        Description='Merge two sentences task - candidate screening qualification',
        QualificationTypeStatus='Active',
        AutoGranted=False
    )
except:
    print("Failed creating qualification, trying to fetch it")
    response = mtc.list_qualification_types(Query=qualification_name, MustBeRequestable=False)

print(response)