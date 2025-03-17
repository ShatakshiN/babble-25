const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

router.get('/messages/:receiverId', auth, chatController.getChatMessages);
router.post('/send', auth, chatController.sendMessage);

module.exports = router;
