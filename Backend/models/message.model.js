const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: false },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Ensure `sender`
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Ensure `receiver`
  image: { type: String, required: false },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;

