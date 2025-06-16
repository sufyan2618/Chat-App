import React, { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
  Container, Box, Typography, TextField, Button, IconButton,
  InputAdornment, Link as MuiLink, Paper, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Link as LinkIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [redirectToOTP, setRedirectToOTP] = useState(false);
  const [userId, setUserId] = useState(null); 

  const validateForm = () => {
    if (!formData.username.trim()) {
        toast.error('Please Enter Full Name');
        return false;
    }
    if (!formData.email.trim()) {
        toast.error('Please Enter Email');
        return false;
    }
    if (!formData.password.trim()) {
        toast.error('Please Enter Password');
        return false;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(formData.email)) {
        toast.error('Invalid Email');
        return false;
    }
    if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
    }
    console.log(formData);  // Ensure form data is being logged
    return true;
    
};


const handleSubmit = async (e) => {
  e.preventDefault();
  const isValid = validateForm();
  if (isValid) {
    try {
      const res = await signUp(formData);
      if( res){
        setUserId(res);
        setRedirectToOTP(true);
        } 
    } catch (error) {
      // Handle signup errors, e.g., display error message
      console.error("Signup Error:", error); 
      toast.error(error.response?.data?.error || "Signup failed"); 
      setRedirectToOTP(false)
    }
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);

  };


  if (redirectToOTP) {
    return <Navigate to={`/verify-otp/${userId}`} replace={true} />;
}

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 3
          }}
        >
          <LinkIcon sx={{ fontSize: 40, color: '#2196f3' }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196f3, #9c27b0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Linkit
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196f3, #9c27b0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Welcome to Linkit
            </Typography>

            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Connect, Share, Thrive - Your Digital Journey Starts Here
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                required
                id="username"
                name="username"
                label="User Name"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                required
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                disabled={isSigningUp}
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  mb: 2,
                  background: 'linear-gradient(45deg, #2196f3, #9c27b0)',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2, #7b1fa2)',
                  }
                }}
              >
                {isSigningUp ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  "Create Account"
                )}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={RouterLink} to="/login" sx={{ color: '#2196f3', fontWeight: 500 }}>
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 3 }}
        >
          By signing up, you agree to our{' '}
          <MuiLink component={RouterLink} to="/terms" sx={{ color: '#2196f3' }}>
            Terms
          </MuiLink>{' '}
          and{' '}
          <MuiLink component={RouterLink} to="/privacy" sx={{ color: '#2196f3' }}>
            Privacy Policy
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}

export default Signup;