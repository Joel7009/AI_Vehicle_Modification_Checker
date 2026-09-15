# AI Vehicle Modification Legality Checker

An MSc Artificial Intelligence project for AI-assisted vehicle inspection and modification analysis.

The system uses computer vision models to detect vehicle components such as **number plates** and **LED light bars** from uploaded vehicle images. It also provides an **Ollama-powered AI assistant**, an interactive dashboard, and inspection history for reviewing previous vehicle analyses.

---

## 1. Project Overview

The AI Vehicle Modification Legality Checker combines computer vision and conversational AI to assist with vehicle inspection.

The system allows a user to:

- Upload a vehicle image
- Detect number plates using YOLO
- Detect LED light bars using YOLO
- View detection confidence and bounding boxes
- Review inspection results through an interactive dashboard
- Interact with an AI assistant powered by Ollama
- View previous inspections through inspection history

---

## 2. Key Features

### 🚗 Vehicle Image Analysis

Users can upload a vehicle image for AI-based inspection.

### 🔢 Number Plate Detection

A YOLO-based object detection model is used to identify and locate number plates in vehicle images.

### 💡 LED Light Bar Detection

A YOLO-based object detection model is used to detect aftermarket LED light bars installed on vehicles.

### 🤖 AI Assistant

The system includes a conversational AI assistant powered by **Ollama**.

The assistant allows users to ask questions about the vehicle inspection and receive natural-language assistance.

### 📊 Interactive Dashboard

The dashboard presents vehicle inspection information, including:

- Detected objects
- Detection confidence
- Inspection information
- Analysis results
- Previous inspections

### 🕒 Inspection History

Previous vehicle inspections can be stored and reviewed through the inspection history section.

---

## 3. System Architecture

The system follows the following general pipeline:

    Vehicle Image
          ↓
    Frontend Application
          ↓
    Backend API
          ↓
    YOLO Object Detection
          ↓
    ┌─────────────────────┐
    │ Number Plate        │
    │ LED Light Bar       │
    └─────────────────────┘
          ↓
    Detection Results
          ↓
    Dashboard / Inspection History
          ↓
    Ollama AI Assistant

---

## 4. Technologies Used

### Frontend

- React
- JavaScript
- HTML/CSS

### Backend

- Python
- FastAPI / Python backend services

### Computer Vision

- YOLO
- Ultralytics
- OpenCV

### Conversational AI

- Ollama
- Large Language Model (LLM)

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 5. AI Models

The project currently includes two main computer vision detection tasks.

### Number Plate Detection

The number plate detector identifies the location of vehicle number plates in an image.

Example output:

    Class: number_plate
    Confidence: 77.5%

The model produces a bounding box around the detected number plate.

### LED Light Bar Detection

The LED light bar detector identifies aftermarket LED light bars installed on vehicles.

Example output:

    Class: LED_Light
    Confidence: 89%

The model produces a bounding box around the detected LED light bar.

---

## 6. Conversational AI Assistant

The project includes an AI assistant powered by Ollama.

The chatbot provides a natural-language interface for interacting with the vehicle inspection system.

Users can ask questions about:

- Detection results
- Vehicle inspection
- Detected modifications
- AI analysis

The conversational AI component is separate from the YOLO detection models.

YOLO performs visual detection, while Ollama provides natural-language interaction and assistance.

---

## 7. Project Structure

    AI_Vehicle_Modification_Checker/
    │
    ├── backend/
    │   ├── main.py
    │   └── services/
    │       └── detection/
    │           └── number_plate_detector.py
    │
    ├── frontend/
    │   └── src/
    │       ├── App.jsx
    │       └── LandingPage.jsx
    │
    ├── models/
    │   ├── number_plate/
    │   └── led_light_bar/
    │
    ├── data/
    │
    ├── README.md
    └── requirements.txt

---

## 8. Installation

Clone the repository:

    git clone https://github.com/Joel7009/AI_Vehicle_Modification_Checker.git

Enter the project directory:

    cd AI_Vehicle_Modification_Checker

Create a Python virtual environment:

    python -m venv .venv

Activate the environment.

### macOS / Linux

    source .venv/bin/activate

### Windows

    .venv\Scripts\activate

Install the backend dependencies:

    pip install -r requirements.txt

---

## 9. Running the Project

The project consists of a frontend and backend application.

### Backend

Start the Python backend using the project's backend entry point.

### Frontend

Start the frontend development server from the `frontend` directory.

The frontend provides the user interface for:

- Vehicle image upload
- Vehicle analysis
- Detection results
- Dashboard
- Inspection history
- AI assistant

---

## 10. Ollama AI Assistant

Install and run Ollama on the development machine.

The application communicates with the locally running Ollama model to provide conversational AI functionality.

The AI assistant is used for natural-language interaction rather than object detection.

---

## 11. Model Detection Workflow

The computer vision workflow is:

    Upload Vehicle Image
             ↓
       Image Processing
             ↓
       YOLO Detection
             ↓
    ┌────────┴─────────┐
    ↓                  ↓
Number Plate       LED Light Bar
Detection           Detection
    ↓                  ↓
    └────────┬─────────┘
             ↓
      Detection Results
             ↓
        Dashboard
             ↓
       Store Inspection
             ↓
      Inspection History

---

## 12. Model Evaluation

The detection models are evaluated using object detection metrics such as:

- Precision
- Recall
- mAP@50
- mAP@50-95

### Number Plate Detection

The trained number plate model achieved:

- Precision: 94.8%
- Recall: 91.3%
- mAP@50: 93.5%
- mAP@50-95: 71.6%

### LED Light Bar Detection

The LED Light Bar model currently has:

- mAP@50: 79.0% on the validation set

Individual detection confidence varies depending on the input image.

---

## 13. Dashboard

The dashboard provides a centralized interface for viewing vehicle inspection results.

It can display:

- Vehicle image
- Detected modifications
- Detection confidence
- Inspection information
- Analysis results
- Inspection history
- AI assistant

---

## 14. Inspection History

Inspection results can be recorded and displayed through the inspection history feature.

This allows users to review previously analyzed vehicle images and their corresponding detection results.

---

## 15. Future Improvements

Possible future improvements include:

- Additional vehicle modification detection models
- More comprehensive legal rule integration
- Improved detection accuracy with larger datasets
- Advanced vehicle modification classification
- Automated inspection reports
- Improved database integration
- Additional AI-assisted inspection features

---

## 16. Project Purpose

The primary objective of this project is to demonstrate how Artificial Intelligence, computer vision, and conversational AI can be combined to assist with vehicle inspection and modification analysis.

---

## 17. Disclaimer

This project is an academic MSc Artificial Intelligence project.

AI detection results should be treated as an assistance mechanism and not as a definitive legal determination. Actual vehicle legality should be verified against applicable laws, regulations, and authorities.