// Updated secure chat.js - now calls local backend instead of exposing API keys

async function sendMessage(message) {
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            return data.message;
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return 'Error: Unable to connect to the chat service. Please try again.';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const submitButton = document.getElementById('submit-btn');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');

    const addMessageToChat = (message, isUser) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;

        messageElement.innerHTML = formatMessage(message);

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
    };

    let weeklyTasks = [];

    const formatMessage = (message) => {
        // Convert double asterisks to <strong> tags for bold
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Replace newlines with <br> for line breaks (if needed)
        message = message.replace(/\n/g, '<br>');

        const weeklyTasksMatch = message.match(/WEEKLY_TASKS\s*=\s*\[([\s\S]*?)\];/);
        if (weeklyTasksMatch) {
            try {
                // Clean up the extracted content by removing surrounding JavaScript code and <br> tags
                let tasksString = weeklyTasksMatch[1].trim();
                tasksString = tasksString.replace(/<br>/g, ''); // Remove <br> tags

                // Convert object keys to double-quoted strings for JSON compliance
                tasksString = tasksString.replace(/([{\s,])(\w+):/g, '$1"$2":');

                // Now wrap the string in an array format if it's not already
                if (!tasksString.startsWith('[')) {
                    tasksString = '[' + tasksString + ']'; // Wrap in array brackets
                }

                // Now parse the string as JSON (it should be a valid JavaScript array now)
                weeklyTasks = JSON.parse(tasksString);
                console.log("Captured weekly tasks:", weeklyTasks); // For debugging

                // Save the weeklyTasks array to localStorage so that it can be accessed in goals.js
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

    // Function to handle the message submission logic
    const handleMessageSubmit = async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat(message, true); // Add user's message
            userInput.value = ''; // Clear input field

            // Show loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.classList.add('chat-bubble', 'bot-message');
            loadingElement.textContent = 'Thinking...';
            loadingElement.id = 'loading-message';
            chatContainer.appendChild(loadingElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                const response = await sendMessage(message);
                console.log("Bot Response:", response);  // Debugging response

                // Remove loading indicator
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();

                addMessageToChat(response || 'No response received.', false); // Add bot's response
            } catch (error) {
                // Remove loading indicator
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();

                addMessageToChat('Sorry, I encountered an error. Please try again.', false);
            }
        }
    };

    // Submit on button click
    submitButton.addEventListener('click', handleMessageSubmit);

    // Submit on Enter key press (without Shift)
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent form submission
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

    //Send a blank message to initiate the conversation (but don't display it)
    const initiateConversation = async () => {
        console.log("Initiating conversation...");
        try {
            const response = await sendMessage("");  // Sends the blank message to backend
            console.log("Bot Response to blank message:", response);

            // Display the response if the bot gives one
            if (response && response.trim()) {
                addMessageToChat(response, false);
            }
        } catch (error) {
            console.error("Error initiating conversation:", error);
        }
    };

    // Call initiateConversation when the page loads
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