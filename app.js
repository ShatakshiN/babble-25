const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('./util/db');
const Sequelize = require('sequelize');
require('dotenv').config();

app.use(cors());
app.use(bodyparser.json());


//routes

const userRoutes = require('./backend/routes/userRoutes')
app.use('/user' , userRoutes)


sequelize.sync()
    .then(()=>{
        app.listen(process.env.PORT || 4000)
        console.log('server is running on 4000')

    })
    .catch((error)=>{
        console.log(error);
    });