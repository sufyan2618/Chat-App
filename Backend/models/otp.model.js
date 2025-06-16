const mongoose = require('mongoose');  

const otpSchema = new mongoose.Schema({  
    otp: { type: String, required: true },  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000 }, // Set to 10 minutes from now  
}, {  
    timestamps: true,  
});  


const OTP = mongoose.model("OTP", otpSchema);  
module.exports = OTP;