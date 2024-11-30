# In routes/journal.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, JournalEntry

journal_bp = Blueprint('journal', __name__)

@journal_bp.route('/entries', methods=['GET'])
@jwt_required()
def get_entries():
    user_id = get_jwt_identity()
    entries = JournalEntry.query.filter_by(user_id=user_id).order_by(JournalEntry.created_at.desc()).all()
    return jsonify([{
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'created_at': entry.created_at,
        'updated_at': entry.updated_at
    } for entry in entries]), 200

@journal_bp.route('/entry', methods=['POST'])
@jwt_required()
def create_entry():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    entry = JournalEntry(
        user_id=user_id,
        title=data['title'],
        content=data['content']
    )
    
    db.session.add(entry)
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'created_at': entry.created_at,
        'updated_at': entry.updated_at
    }), 201

@journal_bp.route('/entry/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(entry_id):
    user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first_or_404()
    
    data = request.get_json()
    entry.title = data['title']
    entry.content = data['content']
    
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'created_at': entry.created_at,
        'updated_at': entry.updated_at
    }), 200

@journal_bp.route('/entry/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(entry_id):
    user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first_or_404()
    
    db.session.delete(entry)
    db.session.commit()
    
    return jsonify({'message': 'Entry deleted successfully'}), 200