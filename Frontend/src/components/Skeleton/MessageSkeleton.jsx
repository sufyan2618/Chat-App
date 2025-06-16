import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-pulse">
      {/* Message container */}
      <div className="flex items-start space-x-4">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        
        {/* Message content */}
        <div className="flex-1 space-y-2">
          {/* Name placeholder */}
          <div className="w-1/4 h-4 bg-gray-200 rounded" />
          
          <div className="space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Second message */}
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="w-1/4 h-4 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Third message */}
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="w-1/4 h-4 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-4/5 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;