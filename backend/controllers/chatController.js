const Chat = require('../models/chat');
const User = require('../models/user');
const {Op} = require('sequelize')
const jwt = require('jsonwebtoken')


exports.getChatMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.id;

        const messages = await Chat.findAll({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        return res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !text.trim()) {
            return res.status(400).json({ success: false, msg: "Invalid request" });
        }

        const message = await Chat.create({ senderId, receiverId, text });
        
        // Emit message event using Socket.IO
        const io = req.app.get('io'); // Retrieve Socket.IO instance
        io.emit('newMessage', message);

        return res.json({ success: true, message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

exports.previousChat = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID

        const previousChats = await Chat.findAll({
            attributes: ['senderId', 'receiverId', 'text', 'createdAt'],
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }]
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['id', 'name', 'dp']
                },
                {
                    model: User,
                    as: 'Receiver',
                    attributes: ['id', 'name', 'dp']
                }
            ]
        });

        // Extract unique users with whom the logged-in user has chatted
        const chatUsersMap = new Map();
        previousChats.forEach((chat) => {
            const otherUser = chat.senderId === userId ? chat.Receiver : chat.Sender;
            if (!chatUsersMap.has(otherUser.id)) {
                chatUsersMap.set(otherUser.id, {
                    id: otherUser.id,
                    name: otherUser.name,
                    //profilePic: otherUser.dp,
                    lastMessage: chat.text
                });
            }
        });

        return res.json({ success: true, users: Array.from(chatUsersMap.values()) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
