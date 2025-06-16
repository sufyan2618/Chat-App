import React, { useRef, useState } from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import { Image, Send, X } from "lucide-react";
import  useChatStore  from "../store/useChatStore";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material"

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        background: "linear-gradient(180deg, rgba(43, 46, 74, 0.3), rgba(56, 67, 100, 0.3))",
        backdropFilter: "blur(10px)",
      }}
    >
      {imagePreview && (
        <Box 
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 2,
                border: "2px solid rgba(97, 218, 251, 0.3)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
              }}
            />
            <IconButton
              onClick={removeImage}
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "rgba(43, 46, 74, 0.9)",
                width: 24,
                height: 24,
                border: "2px solid rgba(251, 97, 218, 0.3)",
                '&:hover': {
                  bgcolor: "rgba(251, 97, 218, 0.2)",
                },
              }}
            >
              <X size={12} color="#FB61DA" />
            </IconButton>
          </Box>
        </Box>
      )}

      <form onSubmit={handleSendMessage}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center"
          }}
        >
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: "2px",
              background: "linear-gradient(90deg, #61DAFB, #FB61DA)",
              borderRadius: 3,
            }}
          >
            <Paper
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: "6px 16px",
                background: "rgba(43, 46, 74, 0.95)",
                borderRadius: 2.5,
              }}
            >
              <InputBase
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{
                  flex: 1,
                  color: "white",
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: imagePreview ? "#61DAFB" : "rgba(255,255,255,0.5)",
                  '&:hover': {
                    background: "rgba(97, 218, 251, 0.1)",
                  },
                }}
              >
                <Image size={20} />
              </IconButton>
            </Paper>
          </Paper>

          <IconButton
            type="submit"
            disabled={!text.trim() && !imagePreview}
            sx={{
              background: "linear-gradient(45deg, #61DAFB, #FB61DA)",
              color: "white",
              width: 45,
              height: 45,
              '&:hover': {
                background: "linear-gradient(45deg, #61DAFB, #FB61DA)",
                opacity: 0.9,
                transform: "scale(1.05)",
              },
              '&.Mui-disabled': {
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            { isSendingMessage ? <CircularProgress size={20} /> : <Send size={20} /> }
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default MessageInput;