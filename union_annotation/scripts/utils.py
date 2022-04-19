import re

import boto3
import os
import pandas as pd


def create_client():
    print("Creating client")

    return boto3.client(
        'mturk',
        endpoint_url='https://mturk-requester.us-east-1.amazonaws.com' if os.getenv("ENV") == "prod" else 'https://mturk-requester-sandbox.us-east-1.amazonaws.com',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    )


def validate_experiment_id(experiment_id: str):
    if experiment_id is None:
        raise ValueError("Must provide EXPERIMENT_ID")
    elif any(char for char in experiment_id if not char.isalpha() and not char in ['_', '-']):
        raise ValueError("Invalid EXPERIMENT_ID")


def read_hits_file(hits_file_name, output_directory) -> pd.DataFrame:
    return pd.read_csv(f"{output_directory}/{hits_file_name}")


def read_assignments_file(assignments_file_name, output_directory) -> pd.DataFrame:
    return pd.read_csv(f"{output_directory}/{assignments_file_name}")


def get_last_output_file_path(output_directory, regex_pattern="^.*_hits\.csv$") -> str:
    """
    Find the latest output
    """

    outputs = os.listdir(output_directory)
    outputs = [output for output in outputs if re.match(regex_pattern, output)]
    return sorted(outputs)[-1]


def prod_prompt_validation(env):
    if env == "prod":
        print("About to run on prod, are you sure? (y/N)")
        validation_input = input()
        if validation_input != "y":
            exit()

