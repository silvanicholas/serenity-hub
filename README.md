# Serenity Hub

Serenity Hub is a meditation and zen application designed specifically for stressed students. Built with React for the frontend and Flask for the backend, it helps users track and improve their wellness activities, such as focus time, meditation, and session completion.

## Features

- Displays total focus and meditation time in hours and minutes.
- Shows the current streak of consecutive days of activity.
- Displays the number of completed sessions.
- Shows weekly progress as a percentage increase from the previous week.
- Updates progress data every minute.

## Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)
- Python 3.x
- Flask

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/silvanicholas/serenity-hub.git
   cd serenity-hub
   ```

2. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**

   Navigate to the backend directory and set up a virtual environment:

   ```bash
   cd ../backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

## Running the Application

### Starting the Backend

1. **Initialize the database:**

   ```bash
   python3 setup_db.py
   ```

   This will create the necessary tables in the database.

2. **Start the Flask server:**

   ```bash
   python3 run.py
   ```

   The server will start on `http://localhost:5000`.

### Starting the Frontend

1. **Start the React development server:**

   ```bash
   cd ../frontend
   npm start
   ```

   This will start the application on `http://localhost:3000`.

## Configuration

- The application expects an authentication token stored in the browser's local storage under the key `token`. Ensure this token is set for the application to fetch data successfully.

## Project Structure

- `frontend/src/components/`: This contains all our components/pages on the frontend, which includes each page's jsx file and css styling.
- `frontend/src/components/Navbar/Navbar.jsx`: The navigation bar component.
- `backend`: Contains the Flask application code.
- `backend/routes`: This includes our necessary routes, which consists of authentication, journals, and user progress.

## Troubleshooting

- If you encounter a "Failed to fetch progress data" error, ensure that the backend server is running and accessible at `http://localhost:5000`.
- Check the browser's console for any additional error messages.
