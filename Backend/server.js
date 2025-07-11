const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const {app, server} = require('./lib/socket');
const connectDb = require('./lib/connectDb');
const path = require('path');

dotenv.config();


app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb",  extended: true }));
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


const authRouter = require('./routes/auth.router');
app.use('/api/auth', authRouter);

const messageRouter = require('./routes/message.router');
app.use('/api/messages', messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend/dist/index.html'));

  })
}
  
const port = process.env.PORT
server.listen(port, () =>  {
    console.log('Server is running on port 5001');
    connectDb();
});