import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import axiosInstance from "../../api/authApi";
import useChatSocket from "../../hooks/useChat";

import ChatLayout from "../../components/message/ChatLayout";

import { userProfileData } from "../../../recoil/ProfileData";
import { userData } from "../../recoil/UserData";

const MessagePage = () => {
  const profile = useRecoilValue(userProfileData);
  const currentUser = useRecoilValue(userData);

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Receive messages from socket
  const { sendMessage, connectionStatus } = useChatSocket((message) => {
    setSelectedChat((prev) => {
      if (!prev) return prev;

      if (prev.conversationId !== message.conversationId) {
        return prev;
      }

      return {
        ...prev,
        messages: [...(prev.messages || []), message],
      };
    });
  });

  useEffect(() => {
    if (!profile?._id) return;

    fetchConversations();
  }, [profile?._id]);

  async function fetchConversations() {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/message/checkConversation/${profile._id}`
      );

      if (!data.conversation) {
        setConversations([]);
        setSelectedChat(null);
        return;
      }

      setConversations([data.conversation]);

      setSelectedChat({
        ...data.conversation,
        messages: data.conversation.messages || [],
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleSelectChat(chat) {
    setSelectedChat(chat);
  }

  function handleSendMessage(text) {
    if (!text.trim() || !selectedChat) return;

    const payload = {
      receiverId: selectedChat.user.user,
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
    setSelectedChat((prev) => ({
      ...prev,
      messages: [
        ...(prev.messages || []),
        {
          ...payload,
          senderId: currentUser._id,
        },
      ],
    }));
  }

  return (
    <ChatLayout
      chats={conversations}
      selectedChat={selectedChat}
      onSelectChat={handleSelectChat}
      onSendMessage={handleSendMessage}
      currentUserId={currentUser?._id}
      connectionStatus={connectionStatus}
    />
  );
};

export default MessagePage;