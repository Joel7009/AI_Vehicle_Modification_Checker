import os
from inference_sdk import InferenceHTTPClient


# ---------------------------------------------------------
# Roboflow configuration
# ---------------------------------------------------------

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")

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

        if not ROBOFLOW_API_KEY:
            raise RuntimeError(
                "ROBOFLOW_API_KEY environment variable is not set."
            )

        _client = InferenceHTTPClient(
            api_url=ROBOFLOW_API_URL,
            api_key=ROBOFLOW_API_KEY,
        )

    return _client


# ---------------------------------------------------------
# LED BAR detection
# ---------------------------------------------------------

def detect_led_bar(image_path: str):

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