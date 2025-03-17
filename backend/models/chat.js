const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Chat = sequelize.define('chat', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Chat;
