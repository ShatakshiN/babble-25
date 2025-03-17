const Chat = require('../models/Chat');
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

        return res.json({ success: true, message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
