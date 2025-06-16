const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5174"],
        credentials: true
    },
});

const userSocketMap = {};

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Updated call signaling events to use userId instead of socket.id
    socket.on("call-user", ({ to, offer }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("incoming-call", { 
                from: userId,  // Send userId instead of socket.id
                offer 
            });
        }
    });
    
    socket.on("answer-call", ({ to, answer }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call-answered", { 
                from: userId, 
                answer 
            });
        }
    });
    
    socket.on("ice-candidate", ({ to, candidate }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("ice-candidate", { 
                from: userId, 
                candidate 
            });
        }
    });

    socket.on("end-call", ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("end-call", { from: userId });
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { server, app, io, getReceiverSocketId };