import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Link as MuiLink,
  Tooltip,
  Divider
}
 from '@mui/material';
import {
  Settings as SettingsIcon,
  Link as LinkIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { authUser, logOut } = useAuthStore();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      handleClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(to right, #2B2E4A, #384364)',
        marginBottom:'-10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon 
            sx={{ 
              fontSize: 32,
              color: '#61DAFB',
              filter: 'drop-shadow(0 0 8px rgba(97, 218, 251, 0.5))'
            }} 
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 2px 10px rgba(97, 218, 251, 0.3)'
            }}
          >
            <MuiLink component={RouterLink} to="/" color="inherit">
            Linkit
            </MuiLink>
          </Typography>
        </Box>

        {/* Right Section - Settings & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Settings">
            <IconButton 
              size="large"
              sx={{ 
                color: '#61DAFB',
                '&:hover': {
                  background: 'rgba(97, 218, 251, 0.1)',
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {authUser ? (
            <>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="large"
                  sx={{ 
                    ml: 1,
                    '&:hover': {
                      background: 'rgba(97, 218, 251, 0.1)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 35, 
                      height: 35,
                      background: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {authUser?.name ? authUser.name.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(to right, #2B2E4A, #384364)',
                    color: 'white',
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      '&:hover': {
                        background: 'rgba(97, 218, 251, 0.1)'
                      }
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ProfileIcon sx={{ mr: 1.5, color: '#61DAFB' }} />
                  <MuiLink component={RouterLink} to="/profile"  sx={{ mr: 1.5, color: '#61DAFB' }}>
                  Profile
                  </MuiLink>
                  
                </MenuItem>
                <Divider sx={{ my: 0.5, background: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5, color: '#FB61DA' }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;