import os

from tqdm import tqdm

from union_annotation.scripts.utils import validate_experiment_id, read_hits_file, create_client

EXPERIMENT_ID = os.getenv("EXPERIMENT_ID")
validate_experiment_id(EXPERIMENT_ID)

hits_file_name = os.getenv("FILE_NAME")

output_directory = f"output/{EXPERIMENT_ID}"
df_hits = read_hits_file(hits_file_name, output_directory)
mtc = create_client()

for _, hit in tqdm(df_hits.iterrows()):
    hit_id = hit['HITId']
    try:
        mtc.delete_hit(HITId=hit_id)
    except:
        print(f"Failed deleting hit_id {hit_id}")