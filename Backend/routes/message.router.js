const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");
const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary");
const auth = require("../middlewares/auth.middleware");
const { getReceiverSocketId, io } = require("../lib/socket");

router.get("/all-users", auth, async (req, res) => {
    const { query } = req.query; // Get the search query from the request
    try {
        const currentUserId = req.user._id;
        const filter = { _id: { $ne: currentUserId } }; // Exclude current user

        if (query) {
            filter.username = { $regex: query, $options: 'i' }; // Case-insensitive search
        }

        const users = await User.find(filter).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});




router.get("/all-messages/:id", auth, async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.id; // 

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
});

// ✅ Send a message
router.post("/send-message/:id", auth, async (req, res) => {
    try {
        const { text, image } = req.body;
        const sender = req.user._id;
        const receiver = req.params.id;

        let imageUrl = null;

        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const message = new Message({
            text,
            sender,
            receiver,
            image: imageUrl
        });

        await message.save();
        const recieverSocketId = getReceiverSocketId(receiver)
        if (recieverSocketId) {
            io.to(recieverSocketId).emit('new-message', message);
        }


        res.status(200).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
});

module.exports = router;
