import React from "react";

const ChatPageStructure = () => {
  return (
    <section className="pt-20 px-4 h-[calc(100vh-5rem)] bg-gray-100">
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500">
          Simple one-to-one chat
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-[calc(100%-4rem)] bg-white rounded-lg shadow overflow-hidden">
        
        {/* Receiver Header */}
        <div className="h-16 border-b flex items-center px-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <div>
              <p className="font-semibold">Receiver Name</p>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
          
          {/* Incoming */}
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-lg shadow max-w-xs">
              Hello 👋
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow max-w-xs">
              Hi, how are you?
            </div>
          </div>

        </div>

        {/* Input */}
        <div className="p-3 border-t flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full outline-none"
          />
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full">
            Send
          </button>
        </div>

      </div>
    </section>
  );
};

export default ChatPageStructure;
