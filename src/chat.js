// Updated chat.js - simplified to use Flask backend
class LangflowClient {
    constructor(backendURL = 'http://localhost:5000') {
        this.backendURL = backendURL;
    }

    async sendMessage(inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false) {
        const url = `${this.backendURL}/api/chat`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    input_value: inputValue,
                    input_type: inputType,
                    output_type: outputType,
                    tweaks: tweaks,
                    stream: stream
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }
}

async function sendMessage(message) {
    const langflowClient = new LangflowClient();

    try {
        // Convert empty message to greeting
        const actualMessage = message.trim() === '' ? 'Hi' : message;

        const tweaks = {
            "ChatInput-x4Fjo": {},
            "Prompt-V9Pbp": {},
            "OpenAIModel-Erifd": {},
            "ChatOutput-LU6cI": {}
        };

        const response = await langflowClient.sendMessage(actualMessage, 'chat', 'chat', tweaks, false);

        if (response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            return output.message.text;
        } else {
            console.error('Unexpected response format:', response);
            return 'Sorry, I received an unexpected response format.';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return 'Error: ' + error.message;
    }
}

// Rest of your chat.js code remains exactly the same
document.addEventListener('DOMContentLoaded', async () => {
    const submitButton = document.getElementById('submit-btn');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');

    const addMessageToChat = (message, isUser) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.innerHTML = formatMessage(message);
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    let weeklyTasks = [];

    const formatMessage = (message) => {
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        message = message.replace(/\n/g, '<br>');

        const weeklyTasksMatch = message.match(/WEEKLY_TASKS\s*=\s*\[([\s\S]*?)\];/);
        if (weeklyTasksMatch) {
            try {
                let tasksString = weeklyTasksMatch[1].trim();
                tasksString = tasksString.replace(/<br>/g, '');
                tasksString = tasksString.replace(/([{\s,])(\w+):/g, '$1"$2":');

                if (!tasksString.startsWith('[')) {
                    tasksString = '[' + tasksString + ']';
                }

                weeklyTasks = JSON.parse(tasksString);
                console.log("Captured weekly tasks:", weeklyTasks);

                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('weeklyTasks', JSON.stringify(weeklyTasks));
                }
            } catch (e) {
                console.error("Error parsing WEEKLY_TASKS:", e);
            }
        }

        message = message.replace(/WEEKLY_TASKS[\s\S]*?```/g, "");
        message = message.replace(/###\s*javascript/g, "");
        message = message.replace(/WEEKLY_TASKS\s*=\s*\[[^\]]*\];?/g, "");

        return message;
    };

    const handleMessageSubmit = async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat(message, true);
            userInput.value = '';

            const response = await sendMessage(message);
            console.log("Bot Response:", response);
            addMessageToChat(response || 'No response received.', false);
        }
    };

    submitButton.addEventListener('click', handleMessageSubmit);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleMessageSubmit();
        }
    });

    //User Dropdown
    const userButton = document.getElementById('userButton');
    const dropdown = document.getElementById('userDropdown');

    userButton.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.user-container')) {
            dropdown.classList.remove('show');
        }
    });

    // Send initial message
    const initiateConversation = async () => {
        console.log("Sending initial Hi message...");
        const response = await sendMessage("Hi");  // Send "Hi" instead of empty string
        console.log("Bot Response to Hi message:", response);

        // MORE DEBUGGING - let's see what we actually get
        if (response === undefined) {
            console.log("Response is undefined - checking sendMessage function...");
        }

        if (response) {
            addMessageToChat(response, false);
        } else {
            console.log("No response to display");
        }
    };

    await initiateConversation();
});

// Overlay functions remain the same
let scrollPosition = 0;

function openOverlay(contentId) {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.getElementById(contentId).style.display = "block";
}

function closeOverlay(contentId) {
    document.getElementById(contentId).style.display = "none";
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
}

document.addEventListener('click', function (event) {
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
        if (event.target === overlay) {
            closeOverlay(overlay.id);
        }
    });
});

function loadPrivacyOverlay() {
    fetch('privacy-overlay.html')
        .then(response => response.text())
        .then(data => {
            const body = document.body;
            const overlayContainer = document.createElement('div');
            overlayContainer.innerHTML = data;
            body.appendChild(overlayContainer);
        })
        .catch(error => {
            console.error('Error loading overlay:', error);
        });
}

function loadContactOverlay() {
    fetch('contact-overlay.html')
        .then(response => response.text())
        .then(data => {
            const body = document.body;
            const overlayContainer = document.createElement('div');
            overlayContainer.innerHTML = data;
            body.appendChild(overlayContainer);
        })
        .catch(error => {
            console.error('Error loading overlay:', error);
        });
}

window.onload = function () {
    loadPrivacyOverlay();
    loadContactOverlay();
};