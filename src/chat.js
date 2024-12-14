class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
        // headers["Authorization"] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

async function sendMessage(message) {
    // const applicationToken = process.env.APP_TOKEN;
    //console.log(applicationToken);
    const langflowClient = new LangflowClient('/proxyapi');
    const flowIdOrName = '4ff49841-5a1a-4121-8f6c-22798741bc48';
    const langflowId = '8e56e2ea-c2e9-4342-b5c1-c8783a5348d1';

    try {
        const tweaks = {
            "ChatInput-x4Fjo": {},
            "Prompt-V9Pbp": {},
            "OpenAIModel-Erifd": {},
            "ChatOutput-LU6cI": {}
        };
        const response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            message,
            'chat',
            'chat',
            tweaks,
            false,
            (data) => console.log("Received:", data.chunk), // onUpdate
            (message) => console.log("Stream Closed:", message), // onClose
            (error) => console.log("Stream Error:", error) // onError
        );

        if (response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            return output.message.text;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return 'Error: ' + error.message;
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
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
    };

    // Function to handle the message submission logic
    const handleMessageSubmit = async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat(message, true); // Add user's message
            userInput.value = ''; // Clear input field

            const response = await sendMessage(message);
            console.log("Bot Response:", response);  // Debugging response
            addMessageToChat(response || 'No response received.', false); // Add bot's response
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

    // Send a blank message to initiate the conversation (but don't display it)
    const initiateConversation = async () => {
        console.log("Sending blank message...");  // Debugging blank message
        const response = await sendMessage("");  // Sends the blank message to Langflow
        console.log("Bot Response to blank message:", response);  // Debugging response to blank message

        // Optionally, you can display the response if the bot gives one.
        if (response) {
            addMessageToChat(response, false);  // Display bot's first response
        }
    };

    // Call initiateConversation when the page loads
    await initiateConversation(); // Ensure the conversation is initiated when the page loads
});

