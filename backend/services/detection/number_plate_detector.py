from pathlib import Path

import cv2
import easyocr
from ultralytics import YOLO


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    PROJECT_ROOT
    / "ai_models"
    / "number_plate"
    / "best.pt"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "uploads"
    / "inspection"
    / "results"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# Cached models
# ---------------------------------------------------------

_model = None
_ocr_reader = None


def get_model():
    global _model

    if _model is None:

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Number plate model not found: {MODEL_PATH}"
            )

        _model = YOLO(str(MODEL_PATH))

    return _model


def get_ocr_reader():
    global _ocr_reader

    if _ocr_reader is None:
        _ocr_reader = easyocr.Reader(
            ["en"],
            gpu=False,
        )

    return _ocr_reader


# ---------------------------------------------------------
# Clean OCR result
# ---------------------------------------------------------

def clean_plate_text(text: str):

    text = text.upper()

    allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    return "".join(
        character
        for character in text
        if character in allowed
    )


# ---------------------------------------------------------
# Number plate detection + OCR
# ---------------------------------------------------------

def detect_number_plate(
    image_path: str,
    confidence_threshold: float = 0.40,
):

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            "Unable to read the uploaded image."
        )

    model = get_model()

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        verbose=False,
    )

    detections = []
    annotated_image = image.copy()

    for result in results:

        if result.boxes is None:
            continue

        boxes = result.boxes

        for i in range(len(boxes)):

            xyxy = (
                boxes.xyxy[i]
                .cpu()
                .numpy()
                .tolist()
            )

            confidence = float(
                boxes.conf[i]
                .cpu()
                .item()
            )

            class_id = int(
                boxes.cls[i]
                .cpu()
                .item()
            )

            class_name = model.names.get(
                class_id,
                str(class_id),
            )

            x1, y1, x2, y2 = map(
                int,
                xyxy,
            )

            # -------------------------------------------------
            # Crop plate
            # -------------------------------------------------

            plate_crop = image[
                max(0, y1):min(image.shape[0], y2),
                max(0, x1):min(image.shape[1], x2),
            ]

            plate_number = ""
            ocr_confidence = 0.0

            # -------------------------------------------------
            # OCR
            # -------------------------------------------------

            if plate_crop.size > 0:

                try:

                    reader = get_ocr_reader()

                    ocr_results = reader.readtext(
                        plate_crop,
                        detail=1,
                        paragraph=False,
                    )

                    if ocr_results:

                        best_ocr = max(
                            ocr_results,
                            key=lambda item: item[2],
                        )

                        plate_number = clean_plate_text(
                            best_ocr[1]
                        )

                        ocr_confidence = float(
                            best_ocr[2]
                        )

                except Exception as ocr_error:

                    print(
                        f"OCR error: {ocr_error}"
                    )

            # -------------------------------------------------
            # RED bounding box
            # -------------------------------------------------

            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (0, 0, 255),
                4,
            )

            # -------------------------------------------------
            # Label
            # -------------------------------------------------

            label = (
                f"NUMBER PLATE "
                f"{confidence * 100:.1f}%"
            )

            if plate_number:
                label += f" | {plate_number}"

            label_y = max(
                y1 - 12,
                30,
            )

            cv2.putText(
                annotated_image,
                label,
                (x1, label_y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.70,
                (0, 0, 255),
                2,
                cv2.LINE_AA,
            )

            detections.append(
                {
                    "class": class_name,
                    "confidence": round(
                        confidence,
                        4,
                    ),
                    "bounding_box": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2,
                    },
                    "plate_number": plate_number,
                    "ocr_confidence": round(
                        ocr_confidence,
                        4,
                    ),
                }
            )

    # ---------------------------------------------------------
    # No plate detected
    # ---------------------------------------------------------

    if not detections:

        return {
            "status": "Not Detected",
            "detections": [],
            "message": (
                "Number plate not detected. "
                "Manual verification recommended."
            ),
        }

    # ---------------------------------------------------------
    # Best detection
    # ---------------------------------------------------------

    best_detection = max(
        detections,
        key=lambda detection:
        detection["confidence"],
    )

    # ---------------------------------------------------------
    # Save annotated image
    # ---------------------------------------------------------

    output_filename = (
        f"{Path(image_path).stem}_annotated.jpg"
    )

    output_path = (
        OUTPUT_DIR / output_filename
    )

    cv2.imwrite(
        str(output_path),
        annotated_image,
    )

    # ---------------------------------------------------------
    # Return result
    # ---------------------------------------------------------

    return {
        "status": "Detected",
        "detections": detections,
        "best_detection": best_detection,
        "annotated_image": output_filename,
    }