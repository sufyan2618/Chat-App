// VerifyOTP.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const { userId } = useParams();
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/auth/verify-otp/${userId}`, { otp }); 
            toast.success("Account Verified Successfully. Please login to access your account.");
            navigate('/login'); // Redirect to login after successful verification
        } catch (error) {
            console.error("OTP Verification Error:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3}>
                <Box component="form" onSubmit={handleVerify}>
                    <Typography variant="h4">Verify OTP</Typography>
                    <TextField label="Enter OTP" required onChange={(e) => setOtp(e.target.value)} />
                    <Button type="submit">Verify</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VerifyOTP;
