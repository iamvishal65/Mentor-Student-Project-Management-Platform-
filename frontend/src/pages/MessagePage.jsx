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

  const handleIncomingMessage = (savedMessage) => {
    console.log("Incoming:", savedMessage);

    setSelectedChat((prev) => {
      if (!prev) return prev;

      // Ignore messages for another conversation

      if (
        prev.conversationId &&
        savedMessage.conversationId !== prev.conversationId
      ) {
        return prev;
      }

      return {
        ...prev,
        conversationId: prev.conversationId || savedMessage.conversationId,
        conversationExists: true,
        messages: [...(prev.messages || []), savedMessage],
      };
    });
console.log("Incoming:", savedMessage);
    setConversations((prevChats) =>
      prevChats.map((chat) => {
        const isCurrentChat =
          chat.conversationId === savedMessage.conversationId ||
          (chat.conversationId === null &&
            chat.user._id ===
              (savedMessage.senderId._id === currentUser._id
                ? savedMessage.receiverId
                : savedMessage.senderId._id));

        if (!isCurrentChat) return chat;

        return {
          ...chat,
          conversationId: savedMessage.conversationId,
          conversationExists: true,
          messages: [...(chat.messages || []), savedMessage],
        };
      }),
    );
  };

  const { sendMessage, connectionStatus } = useChatSocket({
    onMessage: handleIncomingMessage,
    onTyping: (payload) => {
      console.log("Typing:", payload);
    },
    onStatus: (payload) => {
      console.log("Status:", payload);
    },
    onNotification: (payload) => {
      console.log("Notification:", payload);
    },
  });

  useEffect(() => {
    if (!profileData?._id) return;
    fetchConversation();
  }, [profileData?._id]);

  async function fetchConversation() {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/message/checkConversation/${profileData.user}`,
      );
      if (!data.conversationExists) {
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

      const otherUser = data.conversation.participants.find(
        (participant) => participant._id !== currentUser._id,
      );

      const chat = {
        conversationId: data.conversation._id,
        user: otherUser,
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
    console.log("Selected Chat:", selectedChat);
    console.log("Receiver:", selectedChat.user?._id);
    sendMessage({
      type: "MESSAGE",
      payload: {
        receiverId: selectedChat.user._id,
        conversationId: selectedChat.conversationId,
        message: text,
        timestamp: new Date(),
      },
    });
  }

  return (
    <ChatLayout
      chats={conversations}
      selectedChat={selectedChat}
      onSelectChat={setSelectedChat}
      currentUserId={currentUser._id}
      connectionStatus={connectionStatus}
      onSendMessage={handleSendMessage}
    />
  );
};

export default MessagePage;
