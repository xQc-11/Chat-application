const socket = io();

// Prompt user for their name
let userName = prompt("Enter your name:") || "Anonymous";

// Send name to server
socket.emit('set name', userName);

// Select elements
const messageInput = document.getElementById('message');
const chatForm = document.getElementById('chat-form');
const messagesDiv = document.getElementById('messages');

// Submit chat message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();

    if (msg) {
        // Emit message to the server
        socket.emit('chat message', msg);

        // Clear input field
        messageInput.value = '';
    }
});

// Listen for incoming messages
socket.on('chat message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${msg.name}: ${msg.text}`;
    messagesDiv.appendChild(messageElement);

    // Auto-scroll
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Notify when a user joins
socket.on('user joined', (user) => {
    const joinElement = document.createElement('div');
    joinElement.classList.add('message');
    joinElement.textContent = `${user.name} joined the chat`;
    messagesDiv.appendChild(joinElement);
});

// Notify when a user leaves
socket.on('user left', (user) => {
    const leaveElement = document.createElement('div');
    leaveElement.classList.add('message');
    leaveElement.textContent = `${user.name} left the chat`;
    messagesDiv.appendChild(leaveElement);
});
