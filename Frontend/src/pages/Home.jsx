import React from 'react';
import useChatStore from '../store/useChatStore.jsx';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import NoChatContainer from '../components/NoChatContainer';

const Home = () => {
  const { selectedUser, isInCall } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center px-4 h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-5rem)]">
          <div className="flex h-full rounded-lg overflow-hidden ">
            <div className={`w-full sm:w-[300px] ${selectedUser ? 'hidden sm:block' : 'block'}`}>
              <Sidebar />
            </div>
            <div className={`flex-1 ${selectedUser ? 'block' : 'hidden sm:block'}`}>
              {!selectedUser ? <NoChatContainer /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
