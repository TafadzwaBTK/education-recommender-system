# Education Recommender System

## Overview
The **Education Recommender System** is an AI-driven web application designed to provide personalized learning experiences. It leverages **Collaborative Filtering** and **Content-Based Filtering** algorithms to recommend educational content tailored to the preferences and ratings of individual students. The system aims to enhance student engagement and performance, especially in resource-constrained settings.

---

## Features
- **Personalized Content Recommendations**:
  - Collaborative Filtering based on user interactions and ratings.
  - Content-Based Filtering leveraging content attributes (e.g., subject, difficulty).
- **User-Friendly Interface**:
  - Intuitive design built with React.js for seamless user experience.
- **Data Visualization**:
  - View trends in user engagement and content preferences.
- **Admin Features**:
  - Add and manage users and content directly from the interface.
- **AI-Powered Insights**:
  - Scalable recommendation algorithms implemented in Python Flask.

---

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Recommender System**: Python Flask
- **Machine Learning Libraries**: Scikit-learn, Pandas, NumPy
- **Development Tools**: Visual Studio Code, Postman, MongoDB Compass

---

## System Architecture
The system consists of:
1. **Frontend**: Provides an interactive user interface for students to interact with content and view recommendations.
2. **Backend**: Handles data processing, user authentication, and API endpoints.
3. **Recommender System**: Implements collaborative and content-based filtering algorithms to generate personalized recommendations.
4. **Database**: Stores user data, educational content, and user ratings.

---

## Getting Started
Follow these steps to set up the project on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Python 3.7+](https://www.python.org/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TafadzwaBTK/education-recommender-system.git
   cd education-recommender-system

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start


3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start


4. **Flask Recommender Setup**:
   ```bash
   cd flask-recommender
   python -m venv venv
   source venv/bin/activate  # For Linux/MacOS
   venv\Scripts\activate     # For Windows
   pip install -r requirements.txt
   python app.py

**MongoDB Setup**:
Ensure MongoDB is running locally or connect to a MongoDB Atlas cluster.
Populate the database using provided sample data or add your own.

**Future Enhancements**
Integration of Real-Time Feedback:
Incorporate time-based interactions to refine recommendations dynamically.

Support for Multi-Modal Content:
Extend the system to recommend content based on audio, video, or text preferences.

Advanced Analytics:
Leverage deep learning for hybrid recommendation models.

**Contributing**
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: git checkout -b feature-name.
3. Commit your changes: git commit -m "Add feature name".
4. Push to the branch: git push origin feature-name.
5. Open a pull request.

**License**
This project is licensed under the MIT License.
