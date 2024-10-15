from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from models import User
from app import db, bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="User registered successfully!"), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message="Invalid credentials"), 401
