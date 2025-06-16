import React, { useState } from 'react';
import { Box, Typography, IconButton, Badge, Avatar, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Users, Circle } from 'lucide-react';
import { useEffect } from 'react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

const Sidebar = () => {
  const { users, loadUsers, selectedUser, selectUser } = useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    loadUsers(searchQuery); // Call the function to load users based on the search query
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: { xs: '434px', lg: '288px' },
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',

        background: 'linear-gradient(180deg, rgba(43, 46, 74, 0.8), rgba(56, 67, 100, 0.8))',
        backdropFilter: 'blur(10px)',
        transition: 'width 0.2s ease-in-out'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          p: 2.5,
          background: 'rgba(255,255,255,0.03)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Users
              size={24}
              style={{
                color: '#61DAFB',
                filter: 'drop-shadow(0 0 8px rgba(97, 218, 251, 0.3))'
              }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: { s: 'center', lg: 'flex-start' },
                background: 'linear-gradient(45deg, #61DAFB, #FB61DA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Contacts
            </Typography>
          </Box>
          {/* Search Input */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              color: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white', 
                },
                '&:hover fieldset': {
                  borderColor: '#61DAFB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#61DAFB',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Online Users Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            sx={{
              color: 'rgba(97, 218, 251, 0.3)',
              '&.Mui-checked': {
                color: '#61DAFB',
              },
              marginTop: 2
            }}
          />
        }
        label={
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: { xs: '1rem', lg: '0.875rem' },
              marginTop: '15px',
              display: 'block'
            }}
          >
            Show online users only
          </Typography>
        }
        sx={{
          marginTop: 2,
          marginLeft: 0
        }}
      />

      {/* User List */}
      <Box
        sx={{
          overflowY: 'auto',
          py: 1.5,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(97, 218, 251, 0.3)',
            borderRadius: '4px',
          },
        }}
      >
        {filteredUsers.map((user) => (
          <Button
            key={user._id}
            onClick={() => selectUser(user)}
            sx={{
              width: '100%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'left',
              transition: 'all 0.2s ease-in-out',
              background: selectedUser?._id === user._id ?
                'linear-gradient(90deg, rgba(97, 218, 251, 0.1), rgba(251, 97, 218, 0.1))' :
                'transparent',
              '&:hover': {
                background: 'linear-gradient(90deg, rgba(97, 218, 251, 0.15), rgba(251, 97, 218, 0.15))',
              },
              borderRadius: 0,
            }}
          >
            <Box sx={{ position: 'relative', mx: { xs: 'auto', lg: 0 } }}>
              <Avatar
                src={user.profilePic || "/avatar.png"}
                alt={user.username}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid rgba(97, 218, 251, 0.3)',
                  background: 'linear-gradient(45deg, rgba(97, 218, 251, 0.1), rgba(251, 97, 218, 0.1))'
                }}
              />
              {onlineUsers.includes(user._id) && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    boxShadow: '0 0 0 2px rgba(43, 46, 74, 1)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)'
                      },
                      '70%': {
                        boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)'
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)'
                      }
                    }
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'block',
                minWidth: 0,
                flex: 1
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.username}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: onlineUsers.includes(user._id) ? '#10B981' : 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Circle size={8} />
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Button>
        ))}

        {filteredUsers.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'rgba(255,255,255,0.5)',
              px: 2
            }}
          >
            <Typography>
              {showOnlineOnly ? 'No online users' : 'No users available'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;





