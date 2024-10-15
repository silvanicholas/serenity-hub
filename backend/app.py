from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Initialize extensions (db, bcrypt, jwt) without app
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///serenity_hub.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Enable CORS for all routes
    CORS(app)

    # Register blueprints (for organizing routes)
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
