const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const {app, server} = require('./lib/socket');

dotenv.config();


app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb",  extended: true }));
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));


const authRouter = require('./routes/auth.router');
app.use('/api/auth', authRouter);

const messageRouter = require('./routes/message.router');
app.use('/api/messages', messageRouter);


app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});


let connectionString = "mongodb://localhost:27017/New-Chat-App";
mongoose.connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });
  
const port = process.env.PORT
server.listen(port, () => {
    console.log('Server is running on port 5001');
});