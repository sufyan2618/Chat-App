const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.model");
const OTP = require("../models/otp.model")
const generateAuthToken = require("../lib/util"); // 
const auth = require("../middlewares/auth.middleware"); // ✅ Corrected import path
const cloudinary = require("../lib/cloudinary");
const {generateOTP, sendEmail} = require("../lib/email");

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }).single("profilePic"); // 'profilePic' is the name of the input field

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists. Please Sign In" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const otp = generateOTP();
    const otpEntry = new OTP({
      userId: newUser._id,
      otp: otp
      });
      await otpEntry.save();
      await sendEmail(newUser.email, otp);

    
      res.status(201).json({ 
        userId : newUser._id,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// routes/auth.router.js (continued)
router.post("/verify-otp/:userId", async (req, res) => {
  const { otp } = req.body;
  const userId = req.params.userId;

  console.log("UserID:", userId);
  console.log("OTP Received:", otp);

  try {
      const otpEntry = await OTP.findOne({ userId, otp });
      console.log("OTP Entry in DB:", otpEntry);

      if (!otpEntry) {
          return res.status(400).json({ error: "Invalid or expired OTP." });
      }

      // Check if OTP is expired
      if (otpEntry.expiresAt < Date.now()) {
          await OTP.deleteOne({ _id: otpEntry._id });
          return res.status(400).json({ error: "OTP has expired." });
      }

      // Mark user as verified
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      user.isVerified = true;
      await user.save();

      await OTP.deleteOne({ _id: otpEntry._id }); // Delete OTP entry after verification

      res.json({ message: "OTP verified! You can now log in." });
  } catch (error) {
      console.error(error);
      res.status(500).send();
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

      

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!existingUser.isVerified) {
      const newOtp = generateOTP();
      const otpEntry = new OTP({
        userId: existingUser._id,
        otp: newOtp
        });
        await otpEntry.save();
        await sendEmail(existingUser.email, newOtp);
        return res.status(403).json({userId: existingUser._id});
  }

    generateAuthToken(existingUser._id, res);
    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/update-profile", auth, upload, async (req, res) => {
  try {
    const userId = req.user._id;

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Convert buffer to base64 (needed for Cloudinary)
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
    });

    // Update the user's profile picture in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/check-auth", auth, (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check auth:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
