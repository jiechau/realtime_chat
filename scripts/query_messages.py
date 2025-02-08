from pymongo import MongoClient
from bson import json_util
import json
import sys

def print_messages(messages):
    # Convert to JSON-friendly format and print with indentation
    json_str = json.dumps(json.loads(json_util.dumps(messages)), indent=2)
    print(json_str)

def main():
    # Connect to MongoDB
    client = MongoClient('mongodb://0.0.0.0:27017')
    db = client['chat_app']
    messages = db.messages  # Collection name based on your schema

    # Check if ID argument is provided
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        # Query messages where user_id matches either senderId or receiverId
        query = {
            '$or': [
                {'senderId': user_id},
                {'receiverId': user_id}
            ]
        }
        result = messages.find(query)
    else:
        # Get all messages
        result = messages.find()

    # Print results
    print_messages(list(result))

if __name__ == "__main__":
    main()