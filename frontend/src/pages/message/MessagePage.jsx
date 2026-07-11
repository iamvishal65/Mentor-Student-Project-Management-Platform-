import React, { useEffect, useState } from "react";
import MessagePageStructure from "./MessagePageStructure";
import axiosInstance from "../../api/authApi";
import { useRecoilValue } from "recoil";
import { userProfileData } from "../../recoil/ProfileData";
import useChatSocket from "../../customHooks/ChatSocket";
import { userData } from "../../recoil/UserData";

const MessagePage = () => {
  const {messages,sendMessage} = useChatSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const profileData = useRecoilValue(userProfileData);
  const [conversations, setConversations] = useState([]);
  const currentUser=useRecoilValue(userData);

  useEffect(() => {
    if (!profileData?._id) return;
    async function fetchChats() {
      try {
        const { data } = await axiosInstance.get(
          `/api/user/message/checkConversation/${profileData._id}`,
        );
        // No conversation yet
        if (!data.conversation) {
          setConversations([]);
          setSelectedChat({
            conversationId: null,
            user: profileData,
            messages: [],
            conversationExists: false,
          });

          return;
        }
        // Conversation exists
        setConversations([data.conversation]);
        setSelectedChat({
          ...data.conversation,
          conversationExists: true,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchChats();
  }, [selectedChat]);
  function onSend(message) {
    if (!message.trim() || !selectedChat) return;
    const messageData = {
      type: "MESSAGE",
      payload: {
        receiverId: selectedChat.user.user,
        message: message,
        timestamp: new Date(),
        conversationId: selectedChat.conversationId,
      },
    };
    sendMessage(messageData);

  }

  return (
    <MessagePageStructure
      chats={conversations}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      currentUserId={currentUser._id}
      onSendMessage={onSend}
    />
  );
};

export default MessagePage;
