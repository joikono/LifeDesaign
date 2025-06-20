LifeDes[ai]gn: AI-Powered Career Discovery
LifeDes[ai]gn redefines career discovery by providing personalized, future-proof career plans and actionable guidance. This web application leverages an AI chatbot for progress-based exploration, helping users navigate their career paths with intelligent assistance. Built as a master's project focused on futuristic human interactions, LifeDes[ai]gn integrates OpenAI's API via Langflow, ensuring continuity in career-focused discussions through detailed contextual instructions and chat history storage.

Prerequisites
Node.js installed on your system
Getting Started
Choose one of the following methods to set up the project:

Method 1: Clone Repository
Clone the repository:
Bash

git clone [repository-url] # Replace with actual URL
cd [project-folder]
Install dependencies:
Bash

npm install
Start the development server:
Bash

npm run dev
Method 2: Create New Vite Project
Generate a new Vite project:
Bash

npm create vite@latest
Select your project name and framework, then navigate into the new directory.
Install dependencies:
Bash

npm install
Start the development server:
Bash

npm run dev
Tech Stack
Frontend: Vite
Runtime: Node.js
AI Integration: Langflow (for OpenAI API integration)
Development
Kick off the development server with:

Bash

npm run dev
The application will typically be accessible on localhost at the port indicated in your console output (commonly 5173).

Security Considerations
Important Note on API Keys:

This project, as configured for frontend development, currently exposes sensitive API keys (e.g., OpenAI API keys via Langflow) directly in the client-side code.

For production deployments or any public-facing use, it is critical to implement a secure backend proxy. This backend server should handle all API calls, securely storing your API keys as environment variables and preventing their direct exposure to the client. Failure to do so will result in significant security risks, including unauthorized usage and potential financial costs.
