const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('./util/db');
const Sequelize = require('sequelize');
const socketIo = require('socket.io');
require('dotenv').config();

app.use(cors({ origin : 'http://127.0.0.1:5500',
    methods : [' GET' ,'POST']}));
app.use(bodyparser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/css')));

//models
const User = require('./backend/models/user');
const Chat = require('./backend/models/chat');

// Routes
const userRoutes = require('./backend/routes/userRoutes');
const chatRoutes = require('./backend/routes/chatRoutes');


app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:4000", "http://127.0.0.1:5500"], 
        methods: ["GET", "POST"]
    },
    transports: ['websocket'], // Force WebSocket transport
    allowEIO3: true // Support older clients if needed
});

// Store the io instance in app
app.set('io', io);
// Store connected users
const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for user joining
    socket.on('join', (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} is online`);
    });

    // Listen for sending messages
    socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
        try {
            // Save message in the database
            const Chat = require('./models/Chat');
            const message = await Chat.create({ senderId, receiverId, text });

            // Emit the message to the receiver if they are online
            if (users[receiverId]) {
                io.to(users[receiverId]).emit('newMessage', message);
            }
            if (users[senderId]) {
                io.to(users[senderId]).emit('newMessage', message);
            }

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        const userId = Object.keys(users).find(key => users[key] === socket.id);
        if (userId) {
            delete users[userId];
            console.log(`User ${userId} disconnected`);
        }
    });
});
   

// Define relationships
User.hasMany(Chat, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Chat, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Chat.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Chat.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

// Sync database and start server
sequelize.sync()
    .then(() => {
        console.log('Database connected successfully.');
        server.listen(process.env.PORT || 4000, () => {
            console.log('Server is running on port 4000');
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Stop server if DB connection fails
    });

