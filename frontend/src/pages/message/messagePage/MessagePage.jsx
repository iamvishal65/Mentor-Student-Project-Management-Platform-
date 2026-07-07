import React, { useEffect, useState } from "react";
import MessagePageStructure from "./MessagePageStructure";
import axiosInstance from "../../../api/authApi";
import { useRecoilValue } from "recoil";
import { userProfileData } from "../../../recoil/ProfileData";
import useChatSocket from "../../../components/customHooks/ChatSocket";


const MessagePage = () => {
  const[messages,conversationId]=useChatSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const profileData = useRecoilValue(userProfileData);
  const[conversationId,setConversationId]=useState(null);
  useEffect(() => {
    if (!profileData?._id) return;
    async function fetchChats() {
      try {
        const { data } = await axiosInstance.get(
          `/api/user/message/checkConversation/${profileData._id}`
        );
        // No conversation yet
        if (!data.conversation) {
          setConversations([]);
          setSelectedChat({
            _id: null,
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
  }, [profileData]);
 function onSend(message){
 
}
  return (
    <MessagePageStructure
      chats={conversations}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      currentUserId={null} 
      onSendMessage={onSend}
    />
  );
};

export default MessagePage;
