# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API token from environment
API_TOKEN = os.getenv('APP_TOKEN')
LANGFLOW_BASE_URL = "https://api.langflow.astra.datastax.com"

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        # Handle CORS preflight
        return '', 200
    
    try:
        # Get the request data from frontend
        data = request.get_json()
        
        # Extract required parameters
        input_value = data.get('input_value', '')
        input_type = data.get('input_type', 'chat')
        output_type = data.get('output_type', 'chat')
        tweaks = data.get('tweaks', {})
        stream = data.get('stream', False)
        
        # Your Langflow IDs
        langflow_id = "8e56e2ea-c2e9-4342-b5c1-c8783a5348d1"
        flow_id = "4ff49841-5a1a-4121-8f6c-22798741bc48"
        
        # Construct the Langflow API URL
        url = f"{LANGFLOW_BASE_URL}/lf/{langflow_id}/api/v1/run/{flow_id}"
        
        # Prepare headers with the API token
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_TOKEN}"
        }
        
        # Prepare the payload for Langflow
        payload = {
            "input_value": input_value,
            "input_type": input_type,
            "output_type": output_type,
            "tweaks": tweaks
        }
        
        if stream:
            url += f"?stream={stream}"
        
        print(f"DEBUG: Sending request to Langflow...")
        print(f"DEBUG: URL: {url}")
        print(f"DEBUG: Payload: {payload}")
        
        # Make the request to Langflow
        response = requests.post(
            url, 
            json=payload, 
            headers=headers, 
            timeout=120  # Even longer timeout
        )
        
        print(f"DEBUG: Response status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"DEBUG: Response received successfully")
            return jsonify(response_data)
        else:
            print(f"DEBUG: Error from Langflow: {response.status_code} - {response.text}")
            return jsonify({
                "error": f"Langflow API error: {response.status_code}",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.Timeout:
        print("DEBUG: Request timed out")
        return jsonify({"error": "Request timed out"}), 408
        
    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Request exception: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
        
    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    if not API_TOKEN:
        print("ERROR: APP_TOKEN environment variable not set!")
        exit(1)
    
    print(f"Starting Flask server...")
    print(f"API Token loaded: {'Yes' if API_TOKEN else 'No'}")
    app.run(debug=True, port=5000)