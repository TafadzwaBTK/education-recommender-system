from flask import Flask, request, jsonify
from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb+srv://tmadzikanda9:TafadMad2002@cluster0.s8h4r.mongodb.net/educationApp?retryWrites=true&w=majority&appName=Cluster0")
db = client['educationApp']
ratings_collection = db['ratings']
content_collection = db['content']

# Fetch Data from MongoDB
def fetch_content_data():
    content_cursor = content_collection.find({}, {"_id": 1, "title": 1, "subject": 1, "difficulty": 1})
    content_list = [
        {
            "content_id": str(doc["_id"]),
            "title": doc.get("title", "Unknown"),
            "subject": doc.get("subject", "Unknown"),
            "difficulty": doc.get("difficulty", "Unknown"),
        }
        for doc in content_cursor
    ]
    print("Fetched Content Data:", content_list)  # Debug output
    return pd.DataFrame(content_list)

def fetch_ratings_data():
    # Fetch ratings from the MongoDB collection
    ratings_cursor = ratings_collection.find({}, {"_id": 0, "userId": 1, "contentId": 1, "rating": 1})
    ratings_list = [{"user_id": str(doc["userId"]), "content_id": str(doc["contentId"]), "rating": doc["rating"]} for doc in ratings_cursor]
    
    # Convert to a DataFrame
    ratings_df = pd.DataFrame(ratings_list)
    
    # Remove duplicate user-content ratings
    ratings_df = ratings_df.drop_duplicates(subset=['user_id', 'content_id'])
    
    return ratings_df

# Collaborative Filtering
@app.route('/recommend/collaborative', methods=['POST'])
def recommend_collaborative():
    user_id = request.json.get("user_id")
    try:
        # Fetch ratings and content data
        ratings_df = fetch_ratings_data()
        content_df = fetch_content_data()

        # Ensure user_id is valid
        if user_id not in ratings_df['user_id'].unique():
            return jsonify({"error": "Invalid user_id or no data for the user"}), 400

        # Create user-item matrix
        user_item_matrix = ratings_df.pivot_table(index='user_id', columns='content_id', values='rating', aggfunc='mean').fillna(0)

        # Calculate user similarity
        user_similarity = cosine_similarity(user_item_matrix)
        user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

        # Generate recommendations
        recommendations = recommend_content(user_id, user_similarity_df, user_item_matrix)

        # Fetch detailed content information for recommendations
        recommended_content = content_df[content_df['content_id'].isin(recommendations)].to_dict(orient='records')

        return jsonify(recommended_content)

    except Exception as e:
        print(f"Error in collaborative filtering: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def recommend_content(user_id, user_similarity_df, user_item_matrix, top_n=3):
    if user_id not in user_similarity_df.index:
        return []

    # Identify similar users
    similar_users = user_similarity_df.loc[user_id].sort_values(ascending=False).index[1:]
    recommended_content = {}

    # Aggregate recommendations from similar users
    for similar_user in similar_users:
        rated_content = user_item_matrix.loc[similar_user][user_item_matrix.loc[similar_user] > 0]
        for content_id, rating in rated_content.items():
            if content_id not in user_item_matrix.loc[user_id] or user_item_matrix.loc[user_id][content_id] == 0:
                if content_id not in recommended_content:
                    recommended_content[content_id] = 0
                recommended_content[content_id] += rating

    # Sort and return top recommendations
    sorted_recommendations = sorted(recommended_content.items(), key=lambda x: x[1], reverse=True)
    return [content_id for content_id, _ in sorted_recommendations[:top_n]]


# Content-Based Filtering
@app.route('/recommend/content', methods=['POST'])
def recommend_content_based():
    content_id = request.json.get("content_id")
    
    # Fetch content data
    content_df = fetch_content_data()
    content_df['features'] = content_df['subject'] + " " + content_df['difficulty']

    # Check if content_id exists in content_df
    if content_id not in content_df['content_id'].values:
        return jsonify({"error": "Invalid content_id provided"}), 400

    # Create TF-IDF matrix and calculate similarity
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(content_df['features'])
    content_similarity = cosine_similarity(tfidf_matrix)

    # Get recommendations
    recommendations = recommend_similar_content(content_id, content_similarity, content_df)

    # Fetch detailed content information
    recommended_content = content_df[content_df['content_id'].isin(recommendations)].to_dict(orient='records')
    return jsonify(recommended_content)


def recommend_similar_content(content_id, content_similarity, content_df, top_n=3):
    # Ensure content_id exists
    if content_id not in content_df['content_id'].values:
        return []

    # Find the index of the content_id in content_df
    try:
        content_idx = content_df.index[content_df['content_id'] == content_id][0]
    except IndexError:
        return []  # Handle case where content_id is not found

    # Calculate similarity scores
    similarity_scores = list(enumerate(content_similarity[content_idx]))
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    # Get top N similar content IDs
    return [content_df.iloc[i[0]]['content_id'] for i in sorted_scores[1:top_n+1]]


@app.route('/')
def home():
    return "Flask Recommender Service is running!"

if __name__ == '__main__':
    app.run(port=5001)






