const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user')
const addedRoute = require('./routes/added');

mongoose.connect(config.db, {useNewUrlParser: true}, err => {
    err ? console.log('Can not connect to database') : console.log('Connected to database');
})


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('./streams')(io);

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/profile', userRoute);
app.use('/api', addedRoute);




server.listen(config.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected connected');   
    }
})