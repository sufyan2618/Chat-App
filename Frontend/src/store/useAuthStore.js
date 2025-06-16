import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';


const BASE_URL = "http://localhost:5001"

const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check-auth');
            set({ authUser: res.data });
            get().connectSocket();

        } catch (error) {
            set({ authUser: null });
            console.error("Check Auth error:", error);
        }
    },

    signUp: async (data) => {

        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully! Please verify your account now. For verification , please check your email.");
            const id = res.data.userId
            return id;
        } catch (error) {
            console.error("Signup Error:",  error); // Log error
            toast.error(error.response.data.error || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },
    logOut: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out Successfully");
            get().disconnectSocket();
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error(error.response.data.message)
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in Successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Login Error:", error.response?.data || error); // Log error
            if (error.response?.status === 403) {  // Account not verified
                const userId = error.response.data.userId;
                toast.error('Your account is not verified. Please check your email for OTP verification.');
                return userId;  // Returning userId instead of navigating here
            } else {
                toast.error('Wrong Credentials');
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },
    
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.post("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update Profile Error:", error.response.data || error); // Log error
            toast.error(error.response.data.message || "Failed to update profile");
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })

    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }

}));

export default useAuthStore;
