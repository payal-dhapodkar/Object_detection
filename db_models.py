from sqlalchemy import Column, Integer, String, Float, DateTime,create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
# from datetime import datetime
# from .database import Base 
# class Detection(Base):
#  tablename = "detections"
#  id = Column(Integer, primary_key=True, index=True)
# class_name = Column(String, nullable=False)
# confidence = Column(Float, nullable=False)
# bbox = Column(Text, nullable=False)
# filename = Column(String, nullable=False)
# username = Column(String, nullable=False)
# timestamp = Column(DateTime, default=datetime.utcnow)

# Base and Engine setup
Base = declarative_base()
engine = create_engine("sqlite:///inventory.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

# User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Detection model
class Detection(Base):
    __tablename__ = "detections"
    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String)
    confidence = Column(Float)
    bbox = Column(String)
    filename = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = Column(String) 

# Create tables
Base.metadata.create_all(bind=engine)
