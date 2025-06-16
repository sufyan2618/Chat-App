import React, { useEffect,useState, useRef } from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';
import useChatStore from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './Skeleton/MessageSkeleton';
import { formatMessageTime } from "../lib/utils";
import useAuthStore from '../store/useAuthStore';

const ChatContainer = () => {
  const { messages, loadMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser, users } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    if (selectedUser?._id) {
        setIsLoading(true);
        
        loadMessages(selectedUser._id)
            .then(() => setIsLoading(false))
            .catch((error) => {
                console.error("Error loading messages:", error);
                setIsLoading(false);
            });

        subscribeToMessages();  // ✅ Subscribe to messages
    }

    return () => {
        unsubscribeFromMessages();  // ✅ Unsubscribe when user changes
    };
}, [selectedUser]); // ✅ Only run when selectedUser changes

  



  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

 

  if (isMessagesLoading || !authUser || !authUser._id) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        position: 'relative',
        height: '100%',
      }}
    >
      <ChatHeader />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
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
        {messages.map((message, index) => {
          const isSentByCurrentUser = message.sender === authUser._id;
          const isLastMessage = index === messages.length - 1;

          return (
            <Box
              key={message._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSentByCurrentUser ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
              ref={isLastMessage ? messageEndRef : null}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={isSentByCurrentUser ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  sx={{
                    width: 50,
                    height: 50,
                    border: '2px solid',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  {formatMessageTime(message.createdAt)}
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  maxWidth: '80%',
                  borderRadius: 2,
                  backgroundColor: isSentByCurrentUser ? 'rgba(97, 218, 251, 0.3)' : 'rgba(240, 240, 240, 0.9)',
                  border: '1px solid',
                  borderColor: isSentByCurrentUser ? 'rgba(97, 218, 251, 0.6)' : 'rgba(190, 190, 190, 0.5)',
                  color: 'black',
                }}
              >
                {message.image && (
                  <Box
                    component="img"
                    src={message.image}
                    alt="Attachment"
                    sx={{
                      maxWidth: { sm: '200px', xs: '100%' },
                      borderRadius: 1,
                      mb: message.text ? 1 : 0,
                    }}
                  />
                )}
                {message.text && (
                  <Typography sx={{ wordBreak: 'break-word' }}>
                    {message.text}
                  </Typography>
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>
      <MessageInput />
    </Box>
  );
};

export default ChatContainer;
