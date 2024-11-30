from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func
from models import db, FocusSession, MeditationSession, UserProgress
from datetime import date, timedelta

wellness_bp = Blueprint('wellness', __name__)

# Session Management Routes
@wellness_bp.route('/focus/start', methods=['POST'])
@jwt_required()
def start_focus_session():
    user_id = get_jwt_identity()
    session = FocusSession(
        user_id=user_id,
        start_time=datetime.utcnow(),
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({'session_id': session.id}), 201

@wellness_bp.route('/focus/end/<int:session_id>', methods=['POST'])
@jwt_required()
def end_focus_session(session_id):
    user_id = get_jwt_identity()
    session = FocusSession.query.get_or_404(session_id)
    
    if session.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    session.end_time = datetime.utcnow()
    session.duration = (session.end_time - session.start_time).seconds
    session.completed = True
    db.session.commit()
    
    update_streak(user_id)
    return jsonify({'success': True}), 200

@wellness_bp.route('/meditation/start', methods=['POST'])
@jwt_required()
def start_meditation_session():
    user_id = get_jwt_identity()
    session = MeditationSession(
        user_id=user_id,
        start_time=datetime.utcnow(),
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({'session_id': session.id}), 201

@wellness_bp.route('/meditation/end/<int:session_id>', methods=['POST'])
@jwt_required()
def end_meditation_session(session_id):
    user_id = get_jwt_identity()
    session = MeditationSession.query.get_or_404(session_id)
    
    if session.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    session.end_time = datetime.utcnow()
    session.duration = (session.end_time - session.start_time).seconds
    session.completed = True
    db.session.commit()
    
    update_streak(user_id)
    return jsonify({'success': True}), 200

# Progress Tracking Routes
@wellness_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    user_id = get_jwt_identity()
    
    # Get total focus and meditation time
    focus_time = db.session.query(func.sum(FocusSession.duration))\
        .filter(FocusSession.user_id == user_id, FocusSession.completed == True)\
        .scalar() or 0
        
    meditation_time = db.session.query(func.sum(MeditationSession.duration))\
        .filter(MeditationSession.user_id == user_id, MeditationSession.completed == True)\
        .scalar() or 0
    
    # Get completed sessions count
    completed_sessions = FocusSession.query\
        .filter_by(user_id=user_id, completed=True)\
        .count() + MeditationSession.query\
        .filter_by(user_id=user_id, completed=True)\
        .count()
    
    # Get progress data
    progress = UserProgress.query.filter_by(user_id=user_id).first()
    if not progress:
        progress = UserProgress(user_id=user_id)
        db.session.add(progress)
        db.session.commit()
    
    # Calculate weekly progress
    week_ago = datetime.utcnow() - timedelta(days=7)
    current_week_time = db.session.query(func.sum(FocusSession.duration))\
        .filter(FocusSession.user_id == user_id,
                FocusSession.completed == True,
                FocusSession.end_time >= week_ago)\
        .scalar() or 0
    
    prev_week_time = db.session.query(func.sum(FocusSession.duration))\
        .filter(FocusSession.user_id == user_id,
                FocusSession.completed == True,
                FocusSession.end_time >= week_ago - timedelta(days=7),
                FocusSession.end_time < week_ago)\
        .scalar() or 1  # Avoid division by zero
    
    weekly_increase = ((current_week_time - prev_week_time) / prev_week_time) * 100
    
    # Calculate monthly goal progress
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    monthly_time = db.session.query(func.sum(FocusSession.duration))\
        .filter(FocusSession.user_id == user_id,
                FocusSession.completed == True,
                FocusSession.end_time >= month_start)\
        .scalar() or 0
    
    monthly_progress = (monthly_time / (progress.monthly_goal * 60)) * 100 if progress.monthly_goal else 0
    
    return jsonify({
        'totalFocusTime': focus_time,
        'totalMeditationTime': meditation_time,
        'currentStreak': progress.current_streak,
        'completedSessions': completed_sessions,
        'weeklyProgress': round(weekly_increase),
        'monthlyGoal': round(monthly_progress)
    }), 200

# Helper function to update streak
def update_streak(user_id):
    progress = UserProgress.query.filter_by(user_id=user_id).first()
    if not progress:
        progress = UserProgress(user_id=user_id)
        db.session.add(progress)
    
    today = date.today()
    
    if progress.last_activity_date == today:
        return
    
    if progress.last_activity_date == today - timedelta(days=1):
        progress.current_streak += 1
    elif progress.last_activity_date != today:
        progress.current_streak = 1
    
    progress.last_activity_date = today
    db.session.commit()