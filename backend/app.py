from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize extensions (db, bcrypt, jwt) without app
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
            "expose_headers": ["Access-Control-Allow-Origin"],
            "supports_credentials": True,
            "allow_credentials": True
        }
    })

    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
    app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes
    #CORS(app) #aparently redundant

    # Register blueprints (for organizing routes)
    from routes.auth import auth_bp
    from routes.wellness import wellness_bp  
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(wellness_bp, url_prefix='/wellness')  

    return app