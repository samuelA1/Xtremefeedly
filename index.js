const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

mongoose.connect(config.db, {useNewUrlParser: true}, err => {
    err ? console.log('Can not connect to database') : console.log('Connected to database');
})



const app = express();

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

app.listen(config.port, (err) => {
    console.log('Connected connected')
})