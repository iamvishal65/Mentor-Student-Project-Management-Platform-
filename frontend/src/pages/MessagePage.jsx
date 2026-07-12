import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import axiosInstance from "../api/authApi";
import useChatSocket from "../customHooks/ChatSocket";
import ChatLayout from "../components/messages/ChatLayout";

import { userProfileData } from "../recoil/ProfileData";
import { userData } from "../recoil/UserData";

const MessagePage = () => {
  const profileData = useRecoilValue(userProfileData);
  const currentUser = useRecoilValue(userData);

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  const handleIncomingMessage = (message) => {
    setSelectedChat((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [...(prev.messages || []), message],
      };
    });
  };

  const { sendMessage } = useChatSocket(handleIncomingMessage);

  useEffect(() => {
    if (!profileData?._id) return;

    fetchConversation();
  }, [profileData?._id]);

  async function fetchConversation() {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/message/checkConversation/${profileData._id}`
      );

      // No conversation yet
      if (!data.conversation) {
        const newChat = {
          conversationId: null,
          user: profileData,
          messages: [],
          conversationExists: false,
        };

        setConversations([newChat]);
        setSelectedChat(newChat);

        return;
      }

      // Existing conversation
      const chat = {
        ...data.conversation,
        messages: data.conversation.messages || [],
        conversationExists: true,
      };

      setConversations([chat]);
      setSelectedChat(chat);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSendMessage(text) {
    if (!text.trim() || !selectedChat) return;

    const payload = {
      receiverId: selectedChat.user._id,
      conversationId: selectedChat.conversationId,
      message: text,
      timestamp: new Date(),
    };

    const success = sendMessage({
      type: "MESSAGE",
      payload,
    });

    if (!success) return;

    // Optimistic update
    const optimisticMessage = {
      ...payload,
      senderId: currentUser._id,
    };

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), optimisticMessage],
    }));
  }

  return (
    <ChatLayout
      chats={conversations}
      selectedChat={selectedChat}
      onSelectChat={setSelectedChat}
      currentUserId={currentUser._id}
      onSendMessage={handleSendMessage}
    />
  );
};

export default MessagePage;
