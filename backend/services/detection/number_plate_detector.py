from pathlib import Path

import cv2
from ultralytics import YOLO


# =========================================================
# PATHS
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "number_plate"
    / "best.pt"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "uploads"
    / "inspection"
    / "results"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# CACHED MODEL
# =========================================================

_model = None


def get_model():

    global _model

    if _model is None:

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Number plate model not found: {MODEL_PATH}"
            )

        print(
            f"[NUMBER PLATE] Loading YOLO model: "
            f"{MODEL_PATH}"
        )

        _model = YOLO(str(MODEL_PATH))

    return _model


# =========================================================
# NUMBER PLATE DETECTION ONLY
# =========================================================

def detect_number_plate(
    image_path: str,
    confidence_threshold: float = 0.40,
):

    # -----------------------------------------------------
    # Load image
    # -----------------------------------------------------

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"Unable to read image: {image_path}"
        )

    image_height, image_width = image.shape[:2]

    print(
        f"[NUMBER PLATE] Image size: "
        f"{image_width}x{image_height}"
    )

    # -----------------------------------------------------
    # Load YOLO model
    # -----------------------------------------------------

    model = get_model()

    # -----------------------------------------------------
    # Run detection
    # -----------------------------------------------------

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        verbose=False,
    )

    detections = []

    # Copy original image for annotation
    annotated_image = image.copy()

    # -----------------------------------------------------
    # Process detections
    # -----------------------------------------------------

    for result in results:

        if result.boxes is None:
            continue

        boxes = result.boxes

        for i in range(len(boxes)):

            # ---------------------------------------------
            # Coordinates
            # ---------------------------------------------

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

            # ---------------------------------------------
            # Keep box inside image
            # ---------------------------------------------

            x1 = max(0, x1)
            y1 = max(0, y1)

            x2 = min(
                image_width,
                x2,
            )

            y2 = min(
                image_height,
                y2,
            )

            # ---------------------------------------------
            # Ignore invalid boxes
            # ---------------------------------------------

            if x2 <= x1 or y2 <= y1:
                continue

            # ---------------------------------------------
            # RED BOUNDING BOX
            # ---------------------------------------------

            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (0, 0, 255),
                5,
            )

            # ---------------------------------------------
            # LABEL
            # ---------------------------------------------

            label = (
                f"NUMBER PLATE "
                f"{confidence * 100:.1f}%"
            )

            font = cv2.FONT_HERSHEY_SIMPLEX

            font_scale = 0.75

            thickness = 2

            (
                text_width,
                text_height,
            ), baseline = cv2.getTextSize(
                label,
                font,
                font_scale,
                thickness,
            )

            label_x = x1

            label_y = max(
                y1 - 12,
                text_height + 15,
            )

            # ---------------------------------------------
            # RED LABEL BACKGROUND
            # ---------------------------------------------

            cv2.rectangle(
                annotated_image,
                (
                    label_x,
                    label_y - text_height - 12,
                ),
                (
                    label_x + text_width + 12,
                    label_y + baseline,
                ),
                (0, 0, 255),
                -1,
            )

            # ---------------------------------------------
            # WHITE LABEL TEXT
            # ---------------------------------------------

            cv2.putText(
                annotated_image,
                label,
                (
                    label_x + 6,
                    label_y - 3,
                ),
                font,
                font_scale,
                (255, 255, 255),
                thickness,
                cv2.LINE_AA,
            )

            # ---------------------------------------------
            # SAVE DETECTION
            #
            # IMPORTANT:
            # No plate_number.
            # No OCR.
            # ---------------------------------------------

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
                }
            )

    # =====================================================
    # NO NUMBER PLATE
    # =====================================================

    if not detections:

        return {
            "status": "Not Detected",
            "detections": [],
            "best_detection": None,
            "annotated_image": None,
            "message": (
                "Number plate was not detected."
            ),
        }

    # =====================================================
    # BEST DETECTION
    # =====================================================

    best_detection = max(
        detections,
        key=lambda detection:
        detection["confidence"],
    )

    # =====================================================
    # SAVE ANNOTATED IMAGE
    # =====================================================

    output_filename = (
        f"{Path(image_path).stem}"
        f"_annotated.jpg"
    )

    output_path = (
        OUTPUT_DIR / output_filename
    )

    success = cv2.imwrite(
        str(output_path),
        annotated_image,
    )

    if not success:

        raise RuntimeError(
            f"Unable to save annotated image: "
            f"{output_path}"
        )

    print(
        f"[NUMBER PLATE] Annotated image saved: "
        f"{output_path}"
    )

    # =====================================================
    # FINAL RESULT
    # =====================================================

    return {
        "status": "Detected",

        "detections": detections,

        "best_detection": best_detection,

        "annotated_image": output_filename,

        "message": (
            "Number plate detected successfully. "
            "Plate characters are not read."
        ),
    }