from app import db




class JournalEntry(db.Model):
    __tablename__ = "journal_entries"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    user = db.relationship('User', backref=db.backref('journal_entries', lazy=True))

class FocusSession(db.Model):
    __tablename__ = "focus_sessions"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # in seconds
    completed = db.Column(db.Boolean, default=False)
    
    user = db.relationship('User', backref=db.backref('focus_sessions', lazy=True))

class MeditationSession(db.Model):
    __tablename__ = "meditation_sessions"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # in seconds
    completed = db.Column(db.Boolean, default=False)
    
    user = db.relationship('User', backref=db.backref('meditation_sessions', lazy=True))

class UserProgress(db.Model):
    __tablename__ = "user_progress"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    current_streak = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.Date)
    weekly_goal = db.Column(db.Integer)  # in minutes
    monthly_goal = db.Column(db.Integer)  # in minutes
    
    user = db.relationship('User', backref=db.backref('progress', uselist=False))



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    google_id = db.Column(db.String(128), unique=True, nullable=True)
    profile_picture = db.Column(db.String(256), nullable=True)
    auth_provider = db.Column(db.String(20), default='local')

    def __repr__(self):
        return f"<User {self.username}, Email: {self.email}>"

