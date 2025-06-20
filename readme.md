# LifeDes[ai]gn: AI-Powered Career Discovery

LifeDes[ai]gn redefines career discovery by providing **personalized, future-proof career plans and actionable guidance**. This web application leverages an **AI chatbot for progress-based exploration**, helping users navigate their career paths with intelligent assistance. 

LifeDes[ai]gn integrates **OpenAI's API via Langflow**, ensuring continuity in career-focused discussions through detailed contextual instructions and chat history storage.

## Prerequisites

- **Node.js** installed on your system

## Getting Started

Choose one of the following methods to set up the project:

### Method 1: Clone Repository

1. Clone the repository:
```bash
git clone [repository-url] # Replace with actual URL
cd [project-folder]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Method 2: Create New Vite Project

1. Generate a new Vite project:
```bash
npm create vite@latest
```

2. Select your project name and framework, then navigate into the new directory.

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Tech Stack

- **Frontend:** Vite
- **Runtime:** Node.js
- **AI Integration:** Langflow (for OpenAI API integration)

## Development

Kick off the development server with:

```bash
npm run dev
```

The application will typically be accessible on `localhost` at the port indicated in your console output (commonly `5173`).

## Security Considerations

### ⚠️ Important Note on API Keys

This project, as configured for frontend development, currently **exposes sensitive API keys (e.g., OpenAI API keys via Langflow) directly in the client-side code.**

For production deployments or any public-facing use, it is **critical to implement a secure backend proxy**. This backend server should handle all API calls, securely storing your API keys as environment variables and preventing their direct exposure to the client. 

**Failure to do so will result in significant security risks, including unauthorized usage and potential financial costs.**
