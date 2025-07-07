# LifeDes[ai]gn

An AI-powered career coaching platform that helps users identify career goals, create actionable short-term plans, and navigate their professional journey with personalized guidance.

## Features

- **AI Career Coach**: Personalized career guidance through conversational AI
- **Goal Setting**: Weekly task generation aligned with career objectives
- **Progress Tracking**: Monitor completed tasks and track ongoing goals
- **Future-Proof Planning**: Career advice focused on automation-resistant opportunities
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Project Structure

```
lifedesaign/
├── src/                          # Frontend source files
│   ├── public/
│   │   ├── css/                  # Stylesheets
│   │   │   ├── landingpage.css
│   │   │   ├── goals.css
│   │   │   ├── chat.css
│   │   │   └── login.css
│   │   └── img/                  # Static images
│   ├── index.html               # Landing page
│   ├── login.html               # User authentication
│   ├── signup.html              # User registration
│   ├── loggedin.html           # Dashboard page
│   ├── chat.html               # AI chat interface
│   ├── goals.html              # Weekly goals display
│   ├── faqs.html               # FAQ page
│   ├── chat.js                 # Chat functionality (current Langflow integration)
│   ├── goals.js                # Goals management
│   └── *.js                    # Other JavaScript modules
├── app.py                       # Flask backend (in development)
├── poetry_bot.py               # OpenAI integration example
├── package.json                # Node.js dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Technology Stack

### Frontend
- **Build Tool**: Vite 6.0.3
- **Styling**: Vanilla CSS with custom design system
- **JavaScript**: ES6+ vanilla JavaScript
- **Fonts**: SF Compact Text (fallback to system fonts)

### Backend (Current)
- **Integration**: Langflow API proxy
- **Proxy Server**: Vite dev server with proxy configuration

### Backend (Planned Migration)
- **Framework**: Flask (Python)
- **AI Integration**: Direct OpenAI API integration
- **Environment**: Python with dotenv for configuration

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Python 3.8+ (for planned backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifedesaign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   APP_TOKEN=your_langflow_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser to `http://localhost:5173`

## Development

### Current Architecture

The application currently uses Langflow for AI chat functionality through a proxy configuration in Vite. The frontend communicates with Langflow's API to generate career advice and weekly tasks.

### Planned Migration

Due to Langflow's inconsistency issues, we are migrating to a direct OpenAI API integration:

1. **Flask Backend**: Replace Langflow proxy with Flask server
2. **Direct OpenAI Integration**: Use OpenAI's official Python SDK
3. **Improved Reliability**: Better error handling and response consistency
4. **Enhanced Features**: More control over AI prompts and responses

### Key Files

- **`src/chat.js`**: Main chat functionality with Langflow integration
- **`src/goals.js`**: Weekly task management and localStorage handling
- **`vite.config.js`**: Proxy configuration for Langflow API
- **`app.py`**: Flask backend template (in development)
- **`poetry_bot.py`**: OpenAI integration example

## Features Implementation

### Chat Interface
- Real-time messaging with AI career coach "Lify"
- Message formatting with bold text support
- Automatic parsing of weekly tasks from AI responses
- Local storage integration for task persistence

### Goals Management
- Weekly task display from AI-generated content
- Task tracking and progress monitoring
- Integration between chat and goals pages

### User Interface
- Responsive design for mobile and desktop
- Modern purple-themed design system
- Dropdown navigation menus
- Modal overlays for policies and contact forms

## API Integration

### Current (Langflow)
```javascript
const langflowClient = new LangflowClient('/proxyapi');
const response = await langflowClient.runFlow(flowId, langflowId, message);
```

### Planned (Direct OpenAI)
```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
response = client.chat.completions.create(model="gpt-4", messages=[...])
```

## Environment Configuration

### Vite Proxy (Current)
```javascript
proxy: {
    '/proxyapi': {
        target: 'https://api.langflow.astra.datastax.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxyapi/, ''),
        headers: {
            'Authorization': `Bearer ${process.env.APP_TOKEN}`
        }
    }
}
```

### Flask Backend (Planned)
```python
app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Known Issues

- **Langflow Inconsistency**: Current Langflow integration has reliability issues
- **Browser Storage**: Application uses localStorage for task persistence
- **Authentication**: Current authentication is frontend-only (no backend validation)

## Roadmap

### Phase 1: Backend Migration
- [ ] Complete Flask backend implementation
- [ ] Direct OpenAI API integration
- [ ] Replace Langflow proxy

### Phase 2: Enhanced Features
- [ ] User authentication and sessions
- [ ] Database integration for user data
- [ ] Enhanced task management system
- [ ] Progress analytics and reporting

### Phase 3: Production Deployment
- [ ] Production-ready database setup
- [ ] User management system
- [ ] Performance optimization
- [ ] Security enhancements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions about this project, please refer to the contact information in the application or create an issue in this repository.
│
