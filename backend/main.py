from fastapi import (
    Depends,
    FastAPI,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.responses import FileResponse

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from uuid import uuid4
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from sqlalchemy.orm import Session

import requests
import cv2


# =========================================================
# DETECTION SERVICES
# =========================================================

from backend.services.detection.number_plate_detector import (
    detect_number_plate,
)

from backend.services.detection.led_detector import (
    detect_led_bar,
)


# =========================================================
# DATABASE
# =========================================================

from backend.database.database import (
    Base,
    engine,
    get_db,
)

from backend.database.models import (
    VehicleInspection,
)


# =========================================================
# ENVIRONMENT
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

load_dotenv(
    PROJECT_ROOT / ".env",
    override=True,
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AI Vehicle Compliance Assistant API",
    version="1.0.0",
)


# =========================================================
# INITIALIZE DATABASE
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# DIRECTORIES
# =========================================================

UPLOAD_DIR = (
    PROJECT_ROOT
    / "uploads"
    / "inspection"
)

RESULTS_DIR = (
    UPLOAD_DIR
    / "results"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

RESULTS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# SERVE ORIGINAL INSPECTION IMAGES
# =========================================================
#
# Returns the exact original image uploaded for an inspection.
# The History page uses this endpoint for the BEFORE image.
# =========================================================

@app.get("/api/inspection/original/{filename}")
def get_original_inspection_image(filename: str):
    # Only use the filename itself, preventing path traversal.
    safe_filename = Path(filename).name
    image_path = UPLOAD_DIR / safe_filename

    if not image_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Original inspection image not found.",
        )

    return FileResponse(
        path=str(image_path),
    )


# =========================================================
# SERVE ANNOTATED IMAGES
# =========================================================

app.mount(
    "/inspection-results",
    StaticFiles(
        directory=str(RESULTS_DIR)
    ),
    name="inspection-results",
)


# =========================================================
# CORS
# =========================================================

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


# =========================================================
# CHAT REQUEST
# =========================================================

class ChatRequest(BaseModel):

    message: str


# =========================================================
# GENERIC OBJECT CONVERSION
# =========================================================

def convert_to_dict(obj):
    """
    Convert SDK/model objects into dictionaries.
    """

    if isinstance(
        obj,
        dict
    ):

        return obj


    if hasattr(
        obj,
        "model_dump"
    ):

        try:

            return obj.model_dump()

        except Exception:

            pass


    if hasattr(
        obj,
        "dict"
    ):

        try:

            return obj.dict()

        except Exception:

            pass


    if hasattr(
        obj,
        "__dict__"
    ):

        try:

            return vars(obj)

        except Exception:

            pass


    return None


# =========================================================
# GENERIC DETECTION EXTRACTION
# =========================================================

def extract_detections(data):
    """
    Recursively extract detections from number-plate and
    Roboflow/YOLO responses.

    Supported bounding-box formats:

    1. Center format:
       x, y, width, height

    2. Corner format:
       bounding_box = {
           x1, y1, x2, y2
       }
    """

    detections = []

    if data is None:
        return detections

    converted = convert_to_dict(data)

    if converted is not None:
        data = converted

    if isinstance(data, dict):

        # -------------------------------------------------
        # Format 1: x/y/width/height
        # -------------------------------------------------
        has_center_box = (
            data.get("x") is not None
            and data.get("y") is not None
            and data.get("width") is not None
            and data.get("height") is not None
        )

        # -------------------------------------------------
        # Format 2: bounding_box x1/y1/x2/y2
        # -------------------------------------------------
        bbox = data.get("bounding_box")

        has_corner_box = (
            isinstance(bbox, dict)
            and bbox.get("x1") is not None
            and bbox.get("y1") is not None
            and bbox.get("x2") is not None
            and bbox.get("y2") is not None
        )

        if has_center_box or has_corner_box:
            detections.append(data)

        # Search nested values
        for value in data.values():
            if isinstance(value, (dict, list, tuple)):
                detections.extend(
                    extract_detections(value)
                )

        return detections

    if isinstance(data, (list, tuple)):
        for item in data:
            detections.extend(
                extract_detections(item)
            )

        return detections

    return detections


# =========================================================
# NORMALIZE DETECTIONS
# =========================================================

def normalize_detections(
    detections,
    default_class="Object",
):
    """
    Convert all detector outputs to one common format:

        x
        y
        width
        height
        confidence
        class

    Number-plate detections may arrive as:
        bounding_box = x1/y1/x2/y2

    Roboflow LED detections normally arrive as:
        x/y/width/height
    """

    normalized = []
    seen = set()

    for detection in detections:

        if not isinstance(detection, dict):

            converted = convert_to_dict(detection)

            if converted is None:
                continue

            detection = converted

        try:

            confidence = detection.get(
                "confidence"
            )

            if confidence is None:
                confidence = detection.get(
                    "score",
                    0,
                )

            confidence = float(
                confidence
            )

            # -------------------------------------------------
            # FIRST: x/y/width/height format
            # -------------------------------------------------

            x = detection.get("x")
            y = detection.get("y")
            width = detection.get("width")
            height = detection.get("height")

            if (
                x is not None
                and y is not None
                and width is not None
                and height is not None
            ):

                x = float(x)
                y = float(y)
                width = float(width)
                height = float(height)

            else:

                # -------------------------------------------------
                # SECOND: x1/y1/x2/y2 format
                # -------------------------------------------------

                bbox = detection.get(
                    "bounding_box"
                )

                if not isinstance(
                    bbox,
                    dict,
                ):
                    continue

                x1 = bbox.get("x1")
                y1 = bbox.get("y1")
                x2 = bbox.get("x2")
                y2 = bbox.get("y2")

                if (
                    x1 is None
                    or y1 is None
                    or x2 is None
                    or y2 is None
                ):
                    continue

                x1 = float(x1)
                y1 = float(y1)
                x2 = float(x2)
                y2 = float(y2)

                width = x2 - x1
                height = y2 - y1

                if width <= 0 or height <= 0:
                    continue

                x = x1 + (
                    width / 2
                )

                y = y1 + (
                    height / 2
                )

            class_name = (
                detection.get("class")
                or detection.get("name")
                or detection.get("label")
                or default_class
            )

            # -------------------------------------------------
            # Remove exact duplicates
            # -------------------------------------------------

            key = (
                round(x, 2),
                round(y, 2),
                round(width, 2),
                round(height, 2),
                round(confidence, 4),
                str(class_name),
            )

            if key in seen:
                continue

            seen.add(key)

            normalized.append(
                {
                    "x": x,
                    "y": y,
                    "width": width,
                    "height": height,
                    "confidence": confidence,
                    "class": class_name,
                }
            )

        except (
            ValueError,
            TypeError,
            KeyError,
        ):
            continue

    return normalized


# =========================================================
# GET BEST DETECTION
# =========================================================

def get_best_detection(detections):
    """
    Return the highest-confidence detection.
    """

    if not detections:
        return None

    return max(
        detections,
        key=lambda detection:
        float(
            detection.get(
                "confidence",
                0,
            )
        ),
    )


# =========================================================
# CONVERT DETECTION TO PIXEL CORNERS
# =========================================================

def get_box_coordinates(
    detection,
    image_width,
    image_height,
):
    """
    Supports:

        x/y/width/height

    and:

        bounding_box{x1,y1,x2,y2}

    Returns:

        x1, y1, x2, y2
    """

    # ---------------------------------------------------------
    # Corner format
    # ---------------------------------------------------------

    bbox = detection.get(
        "bounding_box"
    )

    if (
        isinstance(bbox, dict)
        and bbox.get("x1") is not None
        and bbox.get("y1") is not None
        and bbox.get("x2") is not None
        and bbox.get("y2") is not None
    ):

        x1 = int(
            float(bbox["x1"])
        )

        y1 = int(
            float(bbox["y1"])
        )

        x2 = int(
            float(bbox["x2"])
        )

        y2 = int(
            float(bbox["y2"])
        )

    else:

        # -----------------------------------------------------
        # Center format
        # -----------------------------------------------------

        x = float(
            detection["x"]
        )

        y = float(
            detection["y"]
        )

        width = float(
            detection["width"]
        )

        height = float(
            detection["height"]
        )

        x1 = int(
            x - width / 2
        )

        y1 = int(
            y - height / 2
        )

        x2 = int(
            x + width / 2
        )

        y2 = int(
            y + height / 2
        )

    # ---------------------------------------------------------
    # Keep inside image
    # ---------------------------------------------------------

    x1 = max(
        0,
        min(
            x1,
            image_width - 1,
        ),
    )

    y1 = max(
        0,
        min(
            y1,
            image_height - 1,
        ),
    )

    x2 = max(
        0,
        min(
            x2,
            image_width - 1,
        ),
    )

    y2 = max(
        0,
        min(
            y2,
            image_height - 1,
        ),
    )

    return (
        x1,
        y1,
        x2,
        y2,
    )


# =========================================================
# IOU / OVERLAP
# =========================================================

def calculate_iou(
    box_a,
    box_b,
):
    """
    Calculate Intersection over Union.

    box:
        (x1, y1, x2, y2)
    """

    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b

    ix1 = max(
        ax1,
        bx1,
    )

    iy1 = max(
        ay1,
        by1,
    )

    ix2 = min(
        ax2,
        bx2,
    )

    iy2 = min(
        ay2,
        by2,
    )

    iw = max(
        0,
        ix2 - ix1,
    )

    ih = max(
        0,
        iy2 - iy1,
    )

    intersection = (
        iw * ih
    )

    area_a = (
        max(0, ax2 - ax1)
        * max(0, ay2 - ay1)
    )

    area_b = (
        max(0, bx2 - bx1)
        * max(0, by2 - by1)
    )

    union = (
        area_a
        + area_b
        - intersection
    )

    if union <= 0:
        return 0.0

    return (
        intersection
        / union
    )


def box_overlap_ratio(
    box_a,
    box_b,
):
    """
    Intersection divided by area of box_b.

    Used to detect when an LED prediction is actually
    covering most of a number plate.
    """

    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b

    ix1 = max(
        ax1,
        bx1,
    )

    iy1 = max(
        ay1,
        by1,
    )

    ix2 = min(
        ax2,
        bx2,
    )

    iy2 = min(
        ay2,
        by2,
    )

    iw = max(
        0,
        ix2 - ix1,
    )

    ih = max(
        0,
        iy2 - iy1,
    )

    intersection = (
        iw * ih
    )

    area_b = (
        max(0, bx2 - bx1)
        * max(0, by2 - by1)
    )

    if area_b <= 0:
        return 0.0

    return (
        intersection
        / area_b
    )


def center_inside_box(
    box_a,
    box_b,
):
    """
    Return True when the center of box_a lies inside box_b.
    """

    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b

    center_x = (
        ax1 + ax2
    ) / 2

    center_y = (
        ay1 + ay2
    ) / 2

    return (
        bx1 <= center_x <= bx2
        and
        by1 <= center_y <= by2
    )


# =========================================================
# REMOVE LED FALSE POSITIVES OVER NUMBER PLATE
# =========================================================

def filter_led_false_positives(
    image,
    plate_detections,
    led_detections,
):
    """
    The LED model can occasionally classify the bright
    number plate itself as LED_Light.

    If an LED box strongly overlaps the number-plate box,
    remove that LED prediction.

    This does NOT change the actual LED model.
    It only prevents an obvious plate false-positive from
    being displayed as an LED annotation.
    """

    if (
        image is None
        or not plate_detections
        or not led_detections
    ):
        return led_detections

    image_height, image_width = (
        image.shape[:2]
    )

    plate_boxes = []

    for plate in plate_detections:

        try:

            plate_boxes.append(
                get_box_coordinates(
                    plate,
                    image_width,
                    image_height,
                )
            )

        except (
            ValueError,
            TypeError,
            KeyError,
        ):
            continue

    if not plate_boxes:
        return led_detections

    filtered = []

    for led in led_detections:

        try:

            led_box = get_box_coordinates(
                led,
                image_width,
                image_height,
            )

        except (
            ValueError,
            TypeError,
            KeyError,
        ):

            filtered.append(led)
            continue

        remove_led = False

        for plate_box in plate_boxes:

            iou = calculate_iou(
                led_box,
                plate_box,
            )

            plate_overlap = box_overlap_ratio(
                led_box,
                plate_box,
            )

            led_center_on_plate = center_inside_box(
                led_box,
                plate_box,
            )

            # Strong evidence that this is the plate
            # being incorrectly detected as an LED.
            if (
                iou >= 0.35
                or plate_overlap >= 0.60
                or led_center_on_plate
            ):

                print(
                    "[LED FILTER] Removing likely "
                    "number-plate false positive: "
                    f"IoU={iou:.3f}, "
                    f"plate_overlap={plate_overlap:.3f}, "
                    f"center_inside={led_center_on_plate}"
                )

                remove_led = True
                break

        if not remove_led:
            filtered.append(led)

    return filtered


# =========================================================
# DRAW DETECTION BOX
# =========================================================

def draw_detection_box(
    image,
    detection,
    box_color,
    label,
):
    """
    Draw a bounding box and confidence label.

    OpenCV BGR:

        GREEN = (0,255,0)
        RED   = (0,0,255)
    """

    if image is None:
        return

    image_height, image_width = (
        image.shape[:2]
    )

    try:

        (
            x1,
            y1,
            x2,
            y2,
        ) = get_box_coordinates(
            detection,
            image_width,
            image_height,
        )

    except (
        ValueError,
        TypeError,
        KeyError,
    ):

        return

    if (
        x2 <= x1
        or y2 <= y1
    ):
        return

    confidence = float(
        detection.get(
            "confidence",
            0,
        )
    )

    # ---------------------------------------------------------
    # BOX
    # ---------------------------------------------------------

    cv2.rectangle(
        image,
        (x1, y1),
        (x2, y2),
        box_color,
        3,
    )

    # ---------------------------------------------------------
    # LABEL
    # ---------------------------------------------------------

    text = (
        f"{label} "
        f"{confidence * 100:.1f}%"
    )

    (
        text_width,
        text_height,
    ), baseline = cv2.getTextSize(
        text,
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        2,
    )

    label_top = (
        y1
        - text_height
        - baseline
        - 8
    )

    if label_top < 0:

        label_top = y1

        text_y = (
            y1
            + text_height
            + 4
        )

        label_bottom = (
            y1
            + text_height
            + baseline
            + 8
        )

    else:

        text_y = (
            y1
            - 7
        )

        label_bottom = y1

    label_right = min(
        image_width - 1,
        x1
        + text_width
        + 10,
    )

    label_bottom = min(
        image_height - 1,
        label_bottom,
    )

    # ---------------------------------------------------------
    # LABEL BACKGROUND
    # ---------------------------------------------------------

    cv2.rectangle(
        image,
        (
            x1,
            label_top,
        ),
        (
            label_right,
            label_bottom,
        ),
        box_color,
        -1,
    )

    # ---------------------------------------------------------
    # LABEL TEXT
    # ---------------------------------------------------------

    cv2.putText(
        image,
        text,
        (
            x1 + 5,
            text_y,
        ),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2,
        cv2.LINE_AA,
    )

    print(
        f"[BOX] {label}: "
        f"x1={x1}, "
        f"y1={y1}, "
        f"x2={x2}, "
        f"y2={y2}, "
        f"confidence={confidence:.3f}"
    )


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "AI Vehicle Compliance Assistant",
    }


# =========================================================
# AI CHAT - OLLAMA
# =========================================================

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
# NUMBER PLATE + LED LIGHT BAR
#
# FINAL ANNOTATED IMAGE:
#
# 🟢 GREEN = NUMBER PLATE
# 🔴 RED   = LED LIGHT BAR
#
# NO OCR
# =========================================================

@app.post("/api/inspection/analyze")
async def analyze_vehicle(
    file: UploadFile = File(...),

    db: Session = Depends(
        get_db
    ),
):

    # =====================================================
    # VALIDATE IMAGE
    # =====================================================

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


    # =====================================================
    # CREATE FILENAME
    # =====================================================

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
        UPLOAD_DIR
        / filename
    )


    try:

        # =================================================
        # SAVE UPLOADED IMAGE
        # =================================================

        contents = await file.read()


        image_path.write_bytes(
            contents
        )


        print(
            "\n================================================="
        )

        print(
            "[INSPECTION] Starting vehicle analysis"
        )

        print(
            f"[INSPECTION] Image: {filename}"
        )


        # =================================================
        # NUMBER PLATE DETECTION
        #
        # Detection ONLY.
        #
        # No OCR.
        # =================================================

        print(
            "[NUMBER PLATE] Running detector..."
        )


        number_plate_result = (
            detect_number_plate(
                str(image_path),
                confidence_threshold=0.40,
            )
        )


        print(
            "[NUMBER PLATE] Detection completed."
        )


        # =================================================
        # LED DETECTION
        # =================================================

        print(
            "[LED] Running Roboflow detector..."
        )


        led_result = detect_led_bar(
            str(image_path)
        )


        print(
            "[LED] Roboflow response received."
        )


        # =================================================
        # NUMBER PLATE PREDICTIONS
        # =================================================

        plate_raw_detections = (
            extract_detections(
                number_plate_result
            )
        )


        plate_detections = (
            normalize_detections(
                plate_raw_detections,
                default_class="number_plate",
            )
        )


        # -------------------------------------------------
        # If recursive extraction didn't find a detection,
        # explicitly check best_detection.
        # -------------------------------------------------

        if not plate_detections:

            best_plate_raw = None


            if isinstance(
                number_plate_result,
                dict
            ):

                best_plate_raw = (
                    number_plate_result.get(
                        "best_detection"
                    )
                )


            if best_plate_raw:

                plate_detections = (
                    normalize_detections(
                        [best_plate_raw],
                        default_class="number_plate",
                    )
                )


        # -------------------------------------------------
        # Best plate
        # -------------------------------------------------

        best_plate = get_best_detection(
            plate_detections
        )


        # -------------------------------------------------
        # Plate status
        # -------------------------------------------------

        number_plate_detected = (
            best_plate is not None
        )


        number_plate_confidence = None


        if best_plate:

            number_plate_confidence = float(
                best_plate.get(
                    "confidence",
                    0,
                )
            )


        print(
            "[NUMBER PLATE] "
            f"Detected={number_plate_detected}, "
            f"Confidence={number_plate_confidence}"
        )


        print(
            "[NUMBER PLATE] "
            f"Total boxes={len(plate_detections)}"
        )


        # =================================================
        # LED PREDICTIONS
        # =================================================

        led_raw_detections = (
            extract_detections(
                led_result
            )
        )


        led_detections = (
            normalize_detections(
                led_raw_detections,
                default_class="LED_Light",
            )
        )


        # -------------------------------------------------
        # Best LED
        # -------------------------------------------------

        best_led = get_best_detection(
            led_detections
        )


        # -------------------------------------------------
        # LED status
        # -------------------------------------------------

        led_detected = (
            best_led is not None
        )


        led_confidence = None


        if best_led:

            led_confidence = float(
                best_led.get(
                    "confidence",
                    0,
                )
            )


        print(
            "[LED] "
            f"Detected={led_detected}, "
            f"Confidence={led_confidence}"
        )


        print(
            "[LED] "
            f"Total boxes={len(led_detections)}"
        )


        # =================================================
        # LOAD ORIGINAL IMAGE
        #
        # IMPORTANT:
        #
        # We intentionally use the ORIGINAL uploaded image.
        #
        # We do NOT use the number plate detector's
        # pre-annotated image.
        #
        # This allows us to draw:
        #
        # 🟢 Number Plate
        # 🔴 LED Light Bar
        #
        # together in one image.
        # =================================================

        image = cv2.imread(
            str(image_path)
        )


        if image is None:

            raise RuntimeError(
                "Unable to load uploaded image "
                "for annotation."
            )


        # =================================================
        # GET IMAGE SIZE
        # =================================================

        image_height, image_width = (
            image.shape[:2]
        )


        print(
            "[ANNOTATION] "
            f"Image size={image_width}x{image_height}"
        )


        # =================================================
        # REMOVE LED FALSE POSITIVES
        #
        # Important:
        # The LED model can sometimes see a bright number
        # plate as an LED. Remove only strong plate-overlap
        # false positives before drawing.
        # =================================================

        original_led_count = len(
            led_detections
        )

        led_detections = (
            filter_led_false_positives(
                image=image,
                plate_detections=plate_detections,
                led_detections=led_detections,
            )
        )

        if (
            original_led_count
            != len(led_detections)
        ):

            print(
                "[LED FILTER] "
                f"Removed "
                f"{original_led_count - len(led_detections)} "
                "likely false-positive LED box(es)."
            )


        # Update best LED AFTER filtering
        best_led = get_best_detection(
            led_detections
        )

        led_detected = (
            best_led is not None
        )

        led_confidence = None

        if best_led:

            led_confidence = float(
                best_led.get(
                    "confidence",
                    0,
                )
            )


        # =================================================
        # DRAW NUMBER PLATE BOXES
        #
        # GREEN
        # =================================================

        if plate_detections:

            print(
                "[ANNOTATION] Drawing "
                "GREEN number plate boxes..."
            )


            for detection in plate_detections:

                draw_detection_box(
                    image=image,
                    detection=detection,
                    box_color=(0, 255, 0),
                    label="NUMBER PLATE",
                )


        else:

            print(
                "[ANNOTATION] "
                "No number plate bounding box available."
            )


        # =================================================
        # DRAW LED BOXES
        #
        # RED
        # =================================================

        if led_detections:

            print(
                "[ANNOTATION] Drawing "
                "RED LED boxes..."
            )


            for detection in led_detections:

                draw_detection_box(
                    image=image,
                    detection=detection,
                    box_color=(0, 0, 255),
                    label="LED LIGHT",
                )


        else:

            print(
                "[ANNOTATION] "
                "No LED bounding box available."
            )


        # =================================================
        # SAVE SINGLE COMBINED IMAGE
        # =================================================

        annotated_filename = (
            f"annotated_{uuid4().hex}.jpg"
        )


        annotated_path = (
            RESULTS_DIR
            / annotated_filename
        )


        success = cv2.imwrite(
            str(annotated_path),
            image,
        )


        if not success:

            raise RuntimeError(
                "Unable to save annotated "
                "inspection image."
            )


        annotated_image = (
            annotated_filename
        )


        print(
            "[ANNOTATION] Final combined image saved:"
        )

        print(
            f"[ANNOTATION] {annotated_filename}"
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

                # IMPORTANT:
                # The frontend checks number_plate.annotated_image
                # before result.annotated_image.
                #
                # Therefore we MUST point the number-plate
                # response to the FINAL COMBINED image.
                "number_plate": {
                    **(
                        number_plate_result
                        if isinstance(
                            number_plate_result,
                            dict,
                        )
                        else {}
                    ),
                    "annotated_image": annotated_image,
                    "message": (
                        "Number plate detected successfully. "
                        "Plate characters are not read."
                        if number_plate_detected
                        else
                        "Number plate not detected."
                    ),
                },

                "led_light": (
                    led_result
                ),

                "annotated_image": (
                    annotated_image
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

        # =================================================
        # DATABASE ROLLBACK
        # =================================================

        db.rollback()


        print(
            "\n[ERROR] Vehicle analysis failed:"
        )

        print(
            str(e)
        )


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