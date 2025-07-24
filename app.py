from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from ultralytics import YOLO
from PIL import Image
import numpy as np
import io
import os
from sqlalchemy import Text, Float, DateTime
from datetime import datetime
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from fastapi import Security
from datetime import datetime, timedelta
from fastapi import UploadFile, File 
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io
from PIL import Image
# from db_models import SessionLocal, User, Detection
from fastapi import Depends
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from db_models import User # or wherever your User model is defined
from db_models import SessionLocal # your DB session creator

# Updated
object_info = {
"1-2 Rosca Fina": {
"description": "Fine-threaded screw for precision assemblies.",
"use": "Used in electronics or fine mechanics.",
"price": "$0.10",
"location": "Shelf A1"
},
"1-4 Rosca Fina": {
"description": "Quarter-inch fine thread screw.",
"use": "Used in light metal construction.",
"price": "$0.12",
"location": "Shelf A2"
},
"M16x2": {
"description": "Heavy-duty metric screw.",
"use": "Structural or industrial uses.",
"price": "$0.50",
"location": "Shelf B1"
},
"M4x08": {
"description": "Metric 4mm screw with 8mm length.",
"use": "Used in panels and brackets.",
"price": "$0.08",
"location": "Shelf C3"
},
"M5x08": {
"description": "5mm screw, commonly used in mounts.",
"use": "Used in robotics and enclosures.",
"price": "$0.10",
"location": "Shelf C4"
}
}

# close update


# JWT Configuration
SECRET_KEY = "your_super_secret_key"  # You can change this to a random string
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token will expire after 60 minutes

# update
# close update

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
 to_encode = data.copy()
 expire = datetime.utcnow() + expires_delta
 to_encode.update({"exp": expire})
 encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
 return encoded_jwt 

class UserCreate(BaseModel):
 username: str
 password: str

# --- JWT CONFIG ---
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

# --- Auth + DB Setup ---
Base = declarative_base()
DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# class Detection(Base):
#  tablename = "detections"
# id = Column(Integer, primary_key=True, index=True)
# class_name = Column(String)
# confidence = Column(Float)
# bbox = Column(Text)
# filename = Column(String)
# timestamp = Column(DateTime, default=datetime.utcnow)

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    bbox = Column(Text, nullable=False)
    filename = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# updated
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
 credentials_exception = HTTPException(
status_code=status.HTTP_401_UNAUTHORIZED,
detail="Could not validate credentials",
headers={"WWW-Authenticate": "Bearer"},
)
 try:
  payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
  username: str = payload.get("sub")
  if username is None:
   raise credentials_exception
 except JWTError:
  raise credentials_exception
 user = db.query(User).filter(User.username == username).first()
 if user is None:
    raise credentials_exception
 return user
# close update

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# --- FastAPI Init ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)



app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Load YOLO Model ---
# model = YOLO("runs/detect/train/weights/best.pt")
model = YOLO("best.pt")
print("Loaded YOLOv8 model classes:", model.names)

# --- Auth Schemas ---
class UserIn(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Routes ---
@app.get("/", response_class=HTMLResponse)
async def serve_home():
    return FileResponse(os.path.join("static", "index.html"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# @app.post("/register")
# def register(user: UserIn, db: Session = Depends(get_db)):
#     if db.query(User).filter(User.username == user.username).first():
#         raise HTTPException(status_code=400, detail="Username already exists")
#     db_user = User(username=user.username, hashed_password=get_password_hash(user.password))
#     db.add(db_user)
#     db.commit()
#     return {"message": "User registered successfully"}

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
 existing = db.query(User).filter(User.username == user.username).first()
 if existing:
  raise HTTPException(status_code=400, detail="User already exists")
 hashed = pwd_context.hash(user.password)
 db_user = User(username=user.username, hashed_password=hashed)
 db.add(db_user)
 db.commit()
 db.refresh(db_user)
 return {"message": "User registered successfully"}


# @app.post("/token", response_model=Token)
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.username == form_data.username).first()
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     token = create_access_token({"sub": user.username})
#     return {"access_token": token, "token_type": "bearer"}

# @app.post("/token")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#  user = db.query(User).filter(User.username == form_data.username).first()
#  if not user or not pwd_context.verify(form_data.password, user.hashed_password):
#   raise HTTPException(status_code=401, detail="Invalid credentials")
#  return {"access_token": user.username, "token_type": "bearer"}

# @app.post("/token")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#  user = db.query(User).filter(User.username == form_data.username).first()
#  if not user or not pwd_context.verify(form_data.password, user.hashed_password):
#   raise HTTPException(status_code=401, detail="Invalid credentials") 

#   token_data = {"sub": user.username}
#   token = create_access_token(token_data)

#  return {"access_token": token, "token_type": "bearer"}
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {"sub": user.username}
    token = create_access_token(token_data)  # ✅ Now token is defined

    return {"access_token": token, "token_type": "bearer"}

@app.get("/protected")
def protected(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return {"message": f"Hello, {username}. You are authorized."}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     contents = await file.read()
#     image = Image.open(io.BytesIO(contents)).convert("RGB")
#     results = model(image)
#     predictions = []
#     for r in results:
#         for box in r.boxes:
#             cls_id = int(box.cls[0])
#             score = float(box.conf[0])
#             bbox = box.xyxy[0].tolist()
#             predictions.append({
#                 "class": model.names[cls_id],
#                 "score": score,
#                 "bbox": bbox
#             })
#     if not predictions:
#         return JSONResponse({"message": "No objects detected."})
#     return {"results": predictions}


# @app.post("/predict")
# async def predict(file: UploadFile = File(...),
# db: Session = Depends(get_db),
# token: str = Depends(oauth2_scheme)
# ):
#   contents = await file.read()
#   file: UploadFile = File(...),
#   db: Session = Depends(get_db),
#   token: str = Depends(oauth2_scheme)
#   contents = await file.read()
#   image = Image.open(io.BytesIO(contents)).convert("RGB")
#   filename = file.filename
#   results = model(image)
#   predictions = []

#   for r in results:
#     for box in r.boxes:
#         cls_id = int(box.cls[0])
#         score = float(box.conf[0])
#         bbox = box.xyxy[0].tolist()

#         predictions.append({
#             "class": model.names[cls_id],
#             "score": score,
#             "bbox": bbox
#         })

#         # Store each detection in the database
#         db_detection = Detection(
#             class_name=model.names[cls_id],
#             confidence=score,
#             bbox=str(bbox),
#             filename=filename
#         )
#         db.add(db_detection)

#     db.commit()

#     if not predictions:
#      return JSONResponse({"message": "No objects detected."})
#   return {"results": predictions}

# @app.post("/predict")
# async def predict(
# file: UploadFile = File(...),
# # db: Session = Depends(get_db),
# # token: str = Depends(oauth2_scheme)
# ):
#  contents = await file.read()
#  image = Image.open(io.BytesIO(contents)).convert("RGB")
#  filename = file.filename
#  results = model(image)
#  predictions = []
#  for r in results:
#   boxes = r.boxes
#   for box in boxes:
#    cls_id = int(box.cls[0])
#    confidence = float(box.conf[0])
#    x1, y1, x2, y2 = box.xyxy[0].tolist()
#    predictions.append({
#    "class": model.names[cls_id],
#    "score": confidence,
#    "bbox": [x1, y1, x2, y2]
#   })

#   return {"results": predictions}


# /updated

@app.post("/predict")
async def predict(
   file: UploadFile = File(...)):
 contents = await file.read()
 image = Image.open(io.BytesIO(contents)).convert("RGB")
 filename = file.filename
 results = model(image)
 predictions = []
 for r in results:
    boxes = r.boxes
    for box in boxes:
        cls_id = int(box.cls[0])
        confidence = float(box.conf[0])
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        class_name = model.names[cls_id]

#         # Get object metadata if available
        meta = object_info.get(class_name, {})

        predictions.append({
            "class": class_name,
            "score": confidence,
            "bbox": [x1, y1, x2, y2],
            "description": meta.get("description", "N/A"),
            "use": meta.get("use", "N/A"),
            "price": meta.get("price", "N/A"),
            "location": meta.get("location", "N/A")
        })

 return {"results": predictions}
        # close 

        # updated
@app.post("/predict")
async def predict(
  file: UploadFile = File(...),
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
 try:
  contents = await file.read()
  image = Image.open(io.BytesIO(contents)).convert("RGB")
  filename = file.filename
  results = model(image)

  predictions = []
  for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            class_name = model.names[cls_id]
            bbox_str = f"{x1:.2f},{y1:.2f},{x2:.2f},{y2:.2f}"

            # Save to database
            db_detection = Detection(
                class_name=class_name,
                confidence=confidence,
                bbox=bbox_str,
                filename=filename,
                timestamp=datetime.utcnow(),
                user_id=current_user.id  # if your Detection model supports it
            )
            db.add(db_detection)

            predictions.append({
                "class": class_name,
                "score": confidence,
                "bbox": [x1, y1, x2, y2]
            })

        db.commit()
        return {"results": predictions}
  
 except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


        # close update

#         predictions.append({
#             "class": class_name,
#             "score": confidence,
#             "bbox": [x1, y1, x2, y2],
#             "description": meta.get("description", "N/A"),
#             "use": meta.get("use", "N/A"),
#             "price": meta.get("price", "N/A"),
#             "location": meta.get("location", "N/A")
#         })

#  return {"results": predictions}

# close update

# python
# Copy
# Edit
#  for r in results:
#     for box in r.boxes:
#         cls_id = int(box.cls[0])
#         score = float(box.conf[0])
#         bbox = box.xyxy[0].tolist()

#         predictions.append({
#             "class": model.names[cls_id],
#             "score": score,
#             "bbox": bbox
#         })

#         # Save detection to DB
#         db_detection = Detection(
#             class_name=model.names[cls_id],
#             confidence=score,
#             bbox=str(bbox),
#             filename=filename
#         )
#       db.add(db_detection)

#    db.commit()

#  if not predictions:
#     return JSONResponse({"message": "No objects detected."})

#  return {"results": predictions}