from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class LangflowClient:
    def __init__(self, base_url, application_token):
        self.base_url = base_url
        self.application_token = application_token
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.application_token}"
        }

    def post(self, endpoint, body):
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.post(url, headers=self.headers, json=body)
            if not response.ok:
                raise Exception(f"{response.status_code} {response.reason} - {response.text}")
            return response.json()
        except Exception as error:
            print(f'Request Error: {error}')
            raise error

    def initiate_session(self, flow_id, langflow_id, input_value, input_type='chat', output_type='chat', stream=False, tweaks={}):
        endpoint = f"/lf/{langflow_id}/api/v1/run/{flow_id}?stream={stream}"
        return self.post(endpoint, {
            "input_value": input_value,
            "input_type": input_type,
            "output_type": output_type,
            "tweaks": tweaks
        })

    def run_flow(self, flow_id_or_name, langflow_id, input_value, input_type='chat', output_type='chat', tweaks={}, stream=False):
        try:
            init_response = self.initiate_session(flow_id_or_name, langflow_id, input_value, input_type, output_type, stream, tweaks)
            return init_response
        except Exception as error:
            print(f'Error running flow: {error}')
            raise error

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get message from request
        data = request.get_json()
        message = data.get('message', '')
        
        # Initialize Langflow client with environment variables
        langflow_client = LangflowClient(
            base_url=os.getenv('LANGFLOW_BASE_URL', 'https://api.langflow.astra.datastax.com'),
            application_token=os.getenv('LANGFLOW_TOKEN')
        )
        
        # Your Langflow configuration
        flow_id = os.getenv('LANGFLOW_FLOW_ID', '4ff49841-5a1a-4121-8f6c-22798741bc48')
        langflow_id = os.getenv('LANGFLOW_ID', '8e56e2ea-c2e9-4342-b5c1-c8783a5348d1')
        
        tweaks = {
            "ChatInput-x4Fjo": {},
            "Prompt-V9Pbp": {},
            "OpenAIModel-Erifd": {},
            "ChatOutput-LU6cI": {}
        }
        
        # Run the flow
        response = langflow_client.run_flow(
            flow_id,
            langflow_id,
            message,
            'chat',
            'chat',
            tweaks,
            False
        )
        
        # Extract the response text
        if response and response.get('outputs'):
            flow_outputs = response['outputs'][0]
            first_component_outputs = flow_outputs['outputs'][0]
            output = first_component_outputs['outputs']['message']
            response_text = output['message']['text']
            
            return jsonify({
                'success': True,
                'message': response_text
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No response from AI service'
            }), 500
            
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check if required environment variables are set
    required_vars = ['LANGFLOW_TOKEN']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
        exit(1)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)