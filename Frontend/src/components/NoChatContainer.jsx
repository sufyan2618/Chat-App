import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

const NoChatContainer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 8,
        background: 'linear-gradient(145deg, rgba(43, 46, 74, 0.05), rgba(56, 67, 100, 0.1))'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: '400px',
          textAlign: 'center',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Icon Container */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(97, 218, 251, 0.1), rgba(251, 97, 218, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-20px)',
                },
              },
            }}
          >
            <ChatIcon
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'black',
                filter: 'drop-shadow(0 0 8px rgba(97, 218, 251, 0.3))'
              }}
            />
          </Box>
        </Box>

        {/* Welcome Text */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 2px 10px rgba(97, 218, 251, 0.3)'
          }}
        >
          Welcome to Linkit Chat!
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
            maxWidth: '300px',
            mx: 'auto'
          }}
        >
          Select a conversation from the sidebar to start chatting
        </Typography>
      </Paper>
    </Box>
  );
};

export default NoChatContainer;