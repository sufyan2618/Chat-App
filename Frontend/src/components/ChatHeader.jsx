import React from 'react';
import { Box, Typography, IconButton, Avatar, Button, Dialog } from '@mui/material';
import { X, Circle, Phone, PhoneOff } from 'lucide-react';
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, selectUser, startCall, endCall, incomingCall, answerCall, rejectCall } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <Box
      sx={{
        p: 2.5,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(90deg, rgba(43, 46, 74, 0.9), rgba(56, 67, 100, 0.9))',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              sx={{ width: 48, height: 48, border: '2px solid rgba(97, 218, 251, 0.3)' }}
            />
            {onlineUsers.includes(selectedUser._id) && (
              <Box sx={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
            )}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>{selectedUser.fullName}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: onlineUsers.includes(selectedUser._id) ? '#10B981' : 'gray' }}>
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={startCall} sx={{ color: '#10B981' }}>
            <Phone />
          </IconButton>
          <IconButton onClick={() => selectUser(null)} sx={{ color: 'red' }}>
            <X />
          </IconButton>
        </Box>
      </Box>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <Dialog open={true} onClose={rejectCall}>
          <Box p={3} textAlign="center">
            <Typography variant="h6">Incoming Call</Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={2}>
              <Button variant="contained" color="success" onClick={answerCall}>Accept</Button>
              <Button variant="contained" color="error" onClick={rejectCall}>Reject</Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default ChatHeader;