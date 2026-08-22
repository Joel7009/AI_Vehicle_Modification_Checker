
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from uuid import uuid4
from fastapi.staticfiles import StaticFiles
import requests

from services.detection.number_plate_detector import detect_number_plate
app = FastAPI(
    title="AI Vehicle Compliance Assistant API",
    version="1.0.0",
)
# ---------------------------------------------------------
# Annotated inspection results
# ---------------------------------------------------------

RESULTS_DIR = (
    Path(__file__).resolve().parents[1]
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
    StaticFiles(directory=str(RESULTS_DIR)),
    name="inspection-results",
)
# ---------------------------------------------------------
# Inspection uploads
# ---------------------------------------------------------

UPLOAD_DIR = (
    Path(__file__).resolve().parents[1]
    / "uploads"
    / "inspection"
)

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------
# React frontend access
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
# AI CHAT
# ---------------------------------------------------------

@app.post("/api/chat")
def chat(request: ChatRequest):

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
            "response": data.get("response", ""),
        }

    except requests.exceptions.RequestException as e:

        return {
            "success": False,
            "response": "Unable to connect to Ollama.",
            "error": str(e),
        }

# ---------------------------------------------------------
# NUMBER PLATE AI INSPECTION
# ---------------------------------------------------------

@app.post("/api/inspection/analyze")
async def analyze_vehicle(
    file: UploadFile = File(...)
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WEBP image.",
        )

    extension = Path(file.filename or "").suffix.lower()

    if not extension:
        extension = ".jpg"

    filename = f"{uuid4().hex}{extension}"

    image_path = UPLOAD_DIR / filename

    try:
        contents = await file.read()

        image_path.write_bytes(contents)

        result = detect_number_plate(
            str(image_path),
            confidence_threshold=0.40,
        )

        return {
            "success": True,
            "filename": filename,
            "result": result,
            "annotated_image_url": (
                f"http://127.0.0.1:8000/"
                f"inspection-results/"
                f"{result['annotated_image']}"
                if result.get("annotated_image")
                else None
            ),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Vehicle analysis failed: {str(e)}",
        )