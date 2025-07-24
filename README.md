# 🧠 AI-Based Inventory Object Detection System

A full-stack object detection system using YOLOv8, FastAPI, and a custom dataset. This tool helps detect, classify, and manage inventory items via image upload or live webcam.

---

## 🚀 Features

- 📸 Image and Webcam Object Detection
- 🧠 YOLOv8 Custom Model Integration
- 🔐 User Login & Registration (JWT Auth)
- 🗃️ SQLite Database Integration
- 🎨 Clean and Responsive TailwindCSS Frontend
- 📦 Stores metadata of detected objects (name, confidence, time, location, etc.)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, JavaScript, TailwindCSS
- **Backend:** Python, FastAPI
- **ML Model:** YOLOv8 (Ultralytics)
- **Database:** SQLite with SQLAlchemy

---

## 📁 Project Structure

```bash
object/
│
├── __pycache__/          # Python cache files
├── .vscode/              # VS Code settings
├── dataset/              # Custom dataset for training
├── static/               # Static files (JS/CSS/images)
├── yolov5/               # YOLOv5 cloned repo or modified code
│
├── app.py                # FastAPI backend entry point
├── best.pt               # Trained YOLOv5 model weights
├── data.yaml             # YOLOv5 dataset config file
├── db_models.py          # SQLAlchemy DB models
├── inventory.db          # Inventory database (SQLite)
├── requirements.txt      # Python package dependencies
├── train.py              # YOLOv5 training script
└── users.db              # User authentication database (SQLite)

Features
🧠 Object Detection using YOLOv5

📦 Inventory management via detections

🔐 User login & registration system

📊 SQLite database for storing detections and users

📁 Upload support for custom datasets and models

⚙️ Modular FastAPI backend


