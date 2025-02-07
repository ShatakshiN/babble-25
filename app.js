const http = require('http');
const express = require('express');
const mongoConnect = require('./util/database');
const app = express();


mongoConnect(client =>{
    console.log(client);
    app.listen(3000);
});