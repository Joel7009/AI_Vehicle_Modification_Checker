import os
from pathlib import Path

from dotenv import load_dotenv
from inference_sdk import (
    InferenceHTTPClient,
    InferenceConfiguration,
)


# ---------------------------------------------------------
# Project paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[3]

ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)


# ---------------------------------------------------------
# Roboflow configuration
# ---------------------------------------------------------

WORKSPACE_NAME = "joel-john-joseph"

WORKFLOW_ID = (
    "vehicle-led-light-detection-vvehicle-led-light-detection-1-yolov8n-t1-logic"
)

ROBOFLOW_API_URL = "https://serverless.roboflow.com"


# ---------------------------------------------------------
# Roboflow client
# ---------------------------------------------------------

_client = None


def get_client():

    global _client

    if _client is None:

        # Load the API key when the client is created
        load_dotenv(
            ENV_FILE,
            override=True,
        )

        api_key = os.getenv(
            "ROBOFLOW_API_KEY"
        )

        if not api_key:
            raise RuntimeError(
                "ROBOFLOW_API_KEY was not found "
                "in the project .env file."
            )

        _client = InferenceHTTPClient(
            api_url=ROBOFLOW_API_URL,
            api_key=api_key,
        ).configure(
            InferenceConfiguration(
                api_key_transport="header"
            )
        )

    return _client


# ---------------------------------------------------------
# LED Light Detection
# ---------------------------------------------------------

def detect_led_bar(image_path: str):

    image_path = str(image_path)

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    client = get_client()

    result = client.run_workflow(
        workspace_name=WORKSPACE_NAME,
        workflow_id=WORKFLOW_ID,
        images={
            "image": image_path,
        },
        use_cache=True,
    )

    return result