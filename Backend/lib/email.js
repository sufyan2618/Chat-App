const mailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};

const sendEmail = async (email, otp) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f7fc;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    font-size: 36px;
                    color: #4C6CFE;
                    margin: 0;
                }
                .content {
                    text-align: center;
                    margin: 20px 0;
                }
                .otp {
                    font-size: 36px;
                    font-weight: bold;
                    color: #4C6CFE;
                    margin: 20px 0;
                    background-color: #e9f1ff;
                    padding: 15px;
                    border-radius: 10px;
                }
                .footer {
                    font-size: 14px;
                    text-align: center;
                    color: #999;
                    margin-top: 20px;
                }
                .footer a {
                    color: #4C6CFE;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>OTP Verification</h1>
                </div>
                <div class="content">
                    <p>Hi there,</p>
                    <p>Your One-Time Password (OTP) for account verification is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please use it to complete your verification. This OTP is valid for the next 10 minutes.</p>
                </div>
                <div class="footer">
                    <p>If you did not request this OTP, please ignore this email.</p>
                    <p>For more assistance, visit our <a href="#">Support Center</a>.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, generateOTP };
