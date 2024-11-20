from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from app import db  # Import db from app.py


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Import User model inside the function to avoid circular import
    from models import User
    
    if User.query.filter_by(email=data['email']).first() is not None:
        return jsonify({"error": "Email already exists"}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Import User model inside the function to avoid circular import
    from models import User

    user = User.query.filter_by(email=data['email']).first()

    if user is None or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, username=user.username), 200

@auth_bp.route('/google', methods=['POST'])
@cross_origin()
def google_login():
    try:
        token = request.json.get('credential')
        client_id = os.environ.get('GOOGLE_CLIENT_ID')
        
        if not token:
            return jsonify({"error": "Missing token"}), 400
        
        if not client_id:
            print("Missing GOOGLE_CLIENT_ID in environment variables")
            return jsonify({"error": "Server configuration error"}), 500
        
        google_request = requests.Request()
        
        idinfo = id_token.verify_oauth2_token(token, google_request, client_id)
        
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])
        google_id = idinfo['sub']

        from models import User

        user = User.query.filter_by(email=email).first()

        if user:
            user.google_id = google_id
            user.profile_picture = idinfo.get('picture')
            user.auth_provider = 'google'
            if not user.username:
                user.username = name

        else:
            user = User(username=name, email=email, profile_picture=idinfo.get('picture'), google_id=google_id, auth_provider='google')
            db.session.add(user)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error committing to database: {e}")
            return jsonify({"error": "Database error"}), 500

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "success": True,
            "access_token": access_token,
            "username": user.username,
            "email": user.email,
        }), 200
    
    except ValueError as e:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"Error in google_login: {e}")
        return jsonify({"error": "Internal server error"}), 500
