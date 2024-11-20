from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    google_id = db.Column(db.String(128), unique=True, nullable=True)
    profile_picture = db.Column(db.String(256), nullable=True)
    auth_provider = db.Column(db.String(20), default='local')

    def __repr__(self):
        return f"<User {self.username}, Email: {self.email}>"

