from fastapi import (
    Depends,
    FastAPI,
    UploadFile,
    File,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from uuid import uuid4
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from sqlalchemy.orm import Session

import requests


# ---------------------------------------------------------
# Detection services
# ---------------------------------------------------------

from backend.services.detection.number_plate_detector import (
    detect_number_plate,
)

from backend.services.detection.led_detector import (
    detect_led_bar,
)


# ---------------------------------------------------------
# Database
# ---------------------------------------------------------

from backend.database.database import (
    Base,
    engine,
    get_db,
)

from backend.database.models import (
    VehicleInspection,
)


# ---------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

load_dotenv(
    PROJECT_ROOT / ".env",
    override=True,
)


# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="AI Vehicle Compliance Assistant API",
    version="1.0.0",
)


# ---------------------------------------------------------
# Initialize SQLite database
# ---------------------------------------------------------

Base.metadata.create_all(
    bind=engine
)


# ---------------------------------------------------------
# Annotated inspection results
# ---------------------------------------------------------

RESULTS_DIR = (
    PROJECT_ROOT
    / "uploads"
    / "inspection"
    / "results"
)

RESULTS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


app.mount(
    "/inspection-results",
    StaticFiles(
        directory=str(RESULTS_DIR)
    ),
    name="inspection-results",
)


# ---------------------------------------------------------
# Inspection uploads
# ---------------------------------------------------------

UPLOAD_DIR = (
    PROJECT_ROOT
    / "uploads"
    / "inspection"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ---------------------------------------------------------
# React frontend access
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Request model
# ---------------------------------------------------------

class ChatRequest(BaseModel):

    message: str


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "AI Vehicle Compliance Assistant",
    }


# ---------------------------------------------------------
# AI CHAT - Ollama
# ---------------------------------------------------------

@app.post("/api/chat")
def chat(
    request: ChatRequest
):

    system_prompt = """
You are an AI Vehicle Compliance Assistant.

Your role is to help users understand:

- Vehicle details
- Vehicle modifications
- Number plates
- LED modifications
- Oversized wheels
- Vehicle compliance
- Vehicle safety
- Inspection results

Give clear and practical answers.

Do not claim that a modification is legally compliant or
illegal unless the available official rules or data support
that conclusion.

When discussing Indian vehicle regulations, explain that the
final legal determination should be based on the applicable
official rules and regulations.
"""

    prompt = f"""
{system_prompt}

User question:
{request.message}

Answer:
"""

    try:

        response = requests.post(
            "http://127.0.0.1:11434/api/generate",

            json={
                "model": "qwen2.5:3b",
                "prompt": prompt,
                "stream": False,
            },

            timeout=120,
        )

        response.raise_for_status()

        data = response.json()

        return {
            "success": True,

            "response": data.get(
                "response",
                "",
            ),
        }

    except requests.exceptions.RequestException as e:

        return {
            "success": False,

            "response": (
                "Unable to connect to Ollama."
            ),

            "error": str(e),
        }


# =========================================================
# AI VEHICLE INSPECTION
#
# Number Plate Detection + LED Detection
#
# IMPORTANT:
# Number plate characters are NOT read.
# =========================================================

@app.post("/api/inspection/analyze")
async def analyze_vehicle(
    file: UploadFile = File(...),

    db: Session = Depends(
        get_db
    ),
):

    # -----------------------------------------------------
    # Validate image
    # -----------------------------------------------------

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,

            detail=(
                "Please upload a JPG, PNG, "
                "or WEBP image."
            ),
        )


    # -----------------------------------------------------
    # Generate filename
    # -----------------------------------------------------

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if not extension:

        extension = ".jpg"


    filename = (
        f"{uuid4().hex}"
        f"{extension}"
    )


    image_path = (
        UPLOAD_DIR / filename
    )


    try:

        # =================================================
        # SAVE IMAGE
        # =================================================

        contents = await file.read()

        image_path.write_bytes(
            contents
        )


        # =================================================
        # NUMBER PLATE DETECTION
        #
        # Detection only.
        # No OCR.
        # =================================================

        number_plate_result = (
            detect_number_plate(
                str(image_path),

                confidence_threshold=0.40,
            )
        )


        # =================================================
        # LED DETECTION
        # =================================================

        led_result = detect_led_bar(
            str(image_path)
        )


        # =================================================
        # EXTRACT NUMBER PLATE DATA
        # =================================================

        best_plate = (
            number_plate_result.get(
                "best_detection"
            )
            if number_plate_result
            else None
        )


        number_plate_detected = (
            number_plate_result.get(
                "status"
            ) == "Detected"
        )


        number_plate_confidence = None


        if best_plate:

            if best_plate.get(
                "confidence"
            ) is not None:

                number_plate_confidence = float(
                    best_plate.get(
                        "confidence"
                    )
                )


        # =================================================
        # EXTRACT LED DATA
        # =================================================

        led_predictions = []


        if led_result:

            try:

                led_predictions = (
                    led_result[0]
                    .get(
                        "predictions",
                        {}
                    )
                    .get(
                        "predictions",
                        []
                    )
                )

            except (
                IndexError,
                AttributeError,
                TypeError,
            ):

                led_predictions = []


        # -------------------------------------------------
        # Find best LED detection
        # -------------------------------------------------

        best_led = None


        if led_predictions:

            best_led = max(
                led_predictions,

                key=lambda detection:
                float(
                    detection.get(
                        "confidence",
                        0,
                    )
                ),
            )


        led_detected = (
            best_led is not None
        )


        led_confidence = None


        if best_led:

            if best_led.get(
                "confidence"
            ) is not None:

                led_confidence = float(
                    best_led.get(
                        "confidence"
                    )
                )


        # =================================================
        # ANNOTATED IMAGE
        # =================================================

        annotated_image = (
            number_plate_result.get(
                "annotated_image"
            )
            if number_plate_result
            else None
        )


        # =================================================
        # SAVE INSPECTION TO SQLITE
        # =================================================

        inspection = VehicleInspection(

            filename=filename,

            number_plate_detected=(
                number_plate_detected
            ),

            number_plate_confidence=(
                number_plate_confidence
            ),

            led_detected=(
                led_detected
            ),

            led_confidence=(
                led_confidence
            ),

            annotated_image=(
                annotated_image
            ),
        )


        db.add(
            inspection
        )

        db.commit()

        db.refresh(
            inspection
        )


        print(
            "[DATABASE] Inspection saved: "
            f"ID={inspection.id}"
        )


        # =================================================
        # RETURN RESULT
        # =================================================

        return {

            "success": True,

            "inspection_id": (
                inspection.id
            ),

            "filename": filename,

            "result": {

                "number_plate": (
                    number_plate_result
                ),

                "led_light": (
                    led_result
                ),
            },

            "annotated_image_url": (

                f"http://127.0.0.1:8000/"
                f"inspection-results/"
                f"{annotated_image}"

                if annotated_image

                else None
            ),
        }


    except Exception as e:

        # -------------------------------------------------
        # Rollback database if something failed
        # -------------------------------------------------

        db.rollback()


        raise HTTPException(

            status_code=500,

            detail=(
                "Vehicle analysis failed: "
                f"{str(e)}"
            ),
        )


# =========================================================
# GET INSPECTION HISTORY
# =========================================================

@app.get("/api/inspections")
def get_inspections(
    db: Session = Depends(
        get_db
    ),
):

    inspections = (
        db.query(
            VehicleInspection
        )
        .order_by(
            VehicleInspection.created_at.desc()
        )
        .all()
    )


    return {

        "success": True,

        "count": len(
            inspections
        ),

        "inspections": [

            {

                "id": inspection.id,

                "filename": (
                    inspection.filename
                ),

                "number_plate_detected": (
                    inspection.number_plate_detected
                ),

                "number_plate_confidence": (
                    inspection.number_plate_confidence
                ),

                "led_detected": (
                    inspection.led_detected
                ),

                "led_confidence": (
                    inspection.led_confidence
                ),

                "annotated_image": (
                    inspection.annotated_image
                ),

                "created_at": (
                    inspection.created_at.isoformat()
                    if inspection.created_at
                    else None
                ),
            }

            for inspection in inspections
        ],
    }