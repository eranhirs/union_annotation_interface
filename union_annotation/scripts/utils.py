import boto3
import os
import pandas as pd

def create_client():
    print("Creating client")

    return boto3.client(
        'mturk',
        endpoint_url='https://mturk-requester-sandbox.us-east-1.amazonaws.com',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    )


def validate_experiment_id(experiment_id: str):
    if experiment_id is None:
        raise ValueError("Must provide experiment_id")
    elif any(char for char in experiment_id if not char.isalpha() and not char in ['_', '-']):
        raise ValueError("Invalid experiment_id")


def read_hits_file(hits_file_name, output_directory) -> pd.DataFrame:
    return pd.read_csv(f"{output_directory}/{hits_file_name}")
