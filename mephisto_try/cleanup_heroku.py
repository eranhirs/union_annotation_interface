import os

from omegaconf import DictConfig

from mephisto.abstractions.architects.heroku_architect import HerokuArchitect
from mephisto.abstractions.databases.local_database import LocalMephistoDB
from mephisto.data_model.task_run import TaskRun

"""
Utility script that cleans heroku that may not
have taken down during a run that exited improperly.
"""

db = LocalMephistoDB()

tasks = db.find_tasks()

task = tasks[-1]
task_run = TaskRun(db, task.db_id)
architect = HerokuArchitect(None, DictConfig({"architect": {"heroku_app_name": os.getenv("HEROKU_APP_NAME"), "server_type": None, "heroku_config_args": {}}}), None, task_run, None)
if architect.server_is_running():
    architect.created = True
    architect.shutdown()
else:
    print("server is not running")

