import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Avatar,
  IconButton,
  Button,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material';
import { Camera, Edit, Save } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { authUser, updateProfile, setAuthUser } = useAuthStore();
  const [profileData, setProfileData] = useState({
    fullName: authUser.fullName || 'John Doe',
    email: authUser.email || 'john@email.com',
    bio: authUser.bio || 'Software Developer | Coffee Enthusiast',
    location: authUser.location || 'San Francisco, CA',
    memberSince: authUser.memberSince || '2024-11-14'
  });

  const [profilePic, setProfilePic] = useState(authUser.profilePic || '/avatar.png');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false); // Track upload state

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if(!file.type.startsWith("image/")){
      toast.error("Please Select Image File");
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    setUploading(true); // Show loading spinner

    try {
      // Show preview immediately
      const previewURL = URL.createObjectURL(file);
      setProfilePic(previewURL);

      // Upload to backend
      const updatedUser = await updateProfile(formData);

      // Update global state to reflect new profile picture
      setAuthUser({ ...authUser, profilePic: updatedUser.profilePic });

    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false); // Hide loading spinner
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Profile Header */}
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 40,
                  height: 40
                }}
                component="label"
              >
                <Camera size={20} color="white"  />
                <input
                  hidden
                  disabled={uploading}
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
              </IconButton>
            }
          >
            {uploading ? (
              <CircularProgress size={40} sx={{ color: 'primary.main' }} />
            ) : (
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: 3,
                  borderColor: 'background.paper'
                }}
                alt="Profile Picture"
                src={profilePic}
              />
            )}
          </Badge>
        </Box>

        <Typography textAlign="center" mb={3}>
          {uploading ? "Updating Profile..." : "Click on the camera icon to change your profile picture"}
        </Typography>

        {/* Profile Form */}
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', right: 0, top: -4 }}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save /> : <Edit />}
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              disabled={!isEditing}
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            />

            <TextField
              label="Email"
              variant="outlined"
              disabled
              value={profileData.email}
            />

            <TextField
              label="Bio"
              variant="outlined"
              multiline
              rows={3}
              disabled={!isEditing}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />

            <TextField
              label="Location"
              variant="outlined"
              disabled={!isEditing}
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Account Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Member since: {new Date(profileData.memberSince).toLocaleDateString()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Account Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
