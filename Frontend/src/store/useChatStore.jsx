import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import useAuthStore from './useAuthStore';

const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isSendingMessage: false,
    isUsersLoading: false,
    isMessagesLoading: false,
    isInCall: false,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isReceivingCall: false,
    incomingCallData: null,

    loadUsers: async (searchQuery = '') => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/all-users?query=${searchQuery}`);
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    loadMessages: async (userID) => {
        set({ isMessagesLoading: true })
        try {
            const response = await axiosInstance.get(`/messages/all-messages/${userID}`);
            set({ messages: response.data })
        } catch (error) {
            toast.error(error.response.data.error);
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) => {
        set({ isSendingMessage: true });
        const { messages, selectedUser } = get();
        try {
            const response = await axiosInstance.post(`/messages/send-message/${selectedUser._id}`, messageData);
            set({ messages: [...messages, response.data] })
        } catch (error) {
            toast.error(error.response.data.error);
        }
        finally {
            set({ isSendingMessage: false });
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) {
            return;
        }
        const socket = useAuthStore.getState().socket;

        socket.on('new-message', (newMessage) => {
            // ✅ Fix sender check
            const isMessageFromSelectedUser = newMessage.sender === selectedUser._id;

            if (!isMessageFromSelectedUser) return;

            // ✅ Update state correctly
            set((state) => ({ messages: [...state.messages, newMessage] }));
        });
    },




    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("new-message");
    },
    selectUser: (user) => set({ selectedUser: user }),

    toggleAudio: () => {
        const { localStream } = get();
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    },

    
})
)

export default useChatStore;