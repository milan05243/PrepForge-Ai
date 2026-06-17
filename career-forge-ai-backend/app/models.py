from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    google_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    profile_picture = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user")
    quiz_scores = relationship("QuizScore", back_populates="user")
    interview_sessions = relationship("InterviewSession", back_populates="user")
    resume_analyses = relationship("ResumeAnalysis", back_populates="user")
    dsa_progress = relationship("UserDsaProgress", back_populates="user")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    salary = Column(String, nullable=False)
    experience = Column(String, nullable=False)
    type = Column(String, nullable=False) # Full-Time / Intern
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False) # JSON/Delimiter string
    benefits = Column(Text, nullable=False) # JSON/Delimiter string
    
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    candidate_name = Column(String, nullable=False)
    candidate_email = Column(String, nullable=False)
    status = Column(String, default="Applied") # Applied, Shortlisted, Interviewing, Offer
    resume_name = Column(String, nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("Job", back_populates="applications")
    user = relationship("User", back_populates="applications")

class DsaProblem(Base):
    __tablename__ = "dsa_problems"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    difficulty = Column(String, nullable=False) # Easy, Medium, Hard
    leetcode_link = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    notes = Column(Text, default="")

class UserDsaProgress(Base):
    __tablename__ = "user_dsa_progress"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(String, ForeignKey("dsa_problems.id"), nullable=False)
    completed = Column(Boolean, default=False)
    notes = Column(Text, default="")
    
    user = relationship("User", back_populates="dsa_progress")

class QuizScore(Base):
    __tablename__ = "quiz_scores"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String, nullable=False)
    correct = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="quiz_scores")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    topic = Column(String, nullable=False) # DBMS, OS, CN, OOPS, HR
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="interview_sessions")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    target_role = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    skills_found = Column(Text, nullable=False) # JSON encoded list
    skills_missing = Column(Text, nullable=False) # JSON encoded list
    suggestions = Column(Text, nullable=False) # JSON encoded list
    analyzed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resume_analyses")
