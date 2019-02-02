const express = require('express');
const mongoose = require('mongoose');

mongoose.connect()



const app = express();

app.listen(3030, (err) => {
    console.log('Connected connected')
})