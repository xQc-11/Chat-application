const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store user names
const users = {};

// Serve static files
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Assign name to the user
    socket.on('set name', (name) => {
        users[socket.id] = name;
        console.log(`${name} connected with ID: ${socket.id}`);
        io.emit('user joined', { name });
    });

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const name = users[socket.id] || 'Anonymous';
        console.log(`${name}: ${msg}`);

        // Broadcast message
        io.emit('chat message', { name, text: msg });
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            console.log(`${name} disconnected`);
            io.emit('user left', { name });
            delete users[socket.id];
        }
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
