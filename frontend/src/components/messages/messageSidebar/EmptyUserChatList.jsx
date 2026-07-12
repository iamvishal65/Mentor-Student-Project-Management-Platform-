import React from "react";
import { MessageCircle } from "lucide-react";

const EmptyChatList = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
        <MessageCircle className="w-8 h-8 text-gray-500" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-800">
        No Conversations
      </h2>

      <p className="mt-2 text-sm text-gray-500 max-w-xs">
        You don't have any conversations yet.
      </p>
    </div>
  );
};

export default React.memo(EmptyChatList);