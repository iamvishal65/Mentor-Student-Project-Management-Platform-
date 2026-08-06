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

  const handleIncomingMessage = (payload) => {
    const savedMessage = payload.message ?? payload;

    console.log("Incoming:", savedMessage);

    setSelectedChat((prev) => {
      if (!prev) return prev;

      // Ignore messages for another conversation

      if (
        prev.conversationId &&
        savedMessage.conversationId?.toString() !==
          prev.conversationId?.toString()
      ) {
        return prev;
      }

      const exists = (prev.messages || []).some(
        (m) => m._id === savedMessage._id,
      );

      if (exists) return prev;

      return {
        ...prev,
        conversationId: prev.conversationId || savedMessage.conversationId,
        conversationExists: true,
        user: {
          ...prev.user,
          _id: payload.receiverId,
        },
        messages: [...(prev.messages || []), savedMessage],
      };
    });
    console.log("Incoming:", savedMessage);
    setConversations((prev) => {
      let found = false;

      const updated = prev.map((chat) => {
        if (chat.conversationId !== savedMessage.conversationId) {
          return chat;
        }

        found = true;

        return {
          ...chat,
          lastMessage: savedMessage,
          updatedAt: savedMessage.createdAt,
        };
      });

      if (!found && selectedChat) {
        updated.unshift({
          conversationId: savedMessage.conversationId,
          user: selectedChat.user,
          lastMessage: savedMessage,
          updatedAt: savedMessage.createdAt,
        });
      }

      updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return updated;
    });
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
    fetchAllConversations();
  }, []);

  useEffect(() => {
    if (profileData?._id) {
      checkConversation();
    }
  }, [profileData?._id]);

  async function checkConversation() {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/message/checkConversation/${profileData.user}`,
      );
      if (!data.conversationExists) {
        const newChat = {
          conversationId: null,
          user: {
            _id: profileData.user,
            name: profileData.Name,
            userName: profileData.userName,
            profilePicture: profileData.profilePicture,
          },
          messages: [],
          conversationExists: false,
        };

        setConversations((prev) => {
          const exists = prev.some((c) => c.user._id === newChat.user._id);

          if (exists) return prev;

          return [newChat, ...prev];
        });
        setSelectedChat(newChat);
        return;
      }

      const otherUser = data.conversation.participants.find(
        (participant) =>
          participant._id.toString() !== currentUser._id.toString(),
      );

      const chat = {
        conversationId: data.conversation._id,
        user: otherUser,
        messages: data.conversation.messages || [],
        conversationExists: true,
      };

      setConversations((prev) => {
        const index = prev.findIndex(
          (c) => c.conversationId === chat.conversationId,
        );

        if (index === -1) {
          return [chat, ...prev];
        }

        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          ...chat,
        };

        return copy;
      });
      setSelectedChat(chat);
    } catch (err) {
      console.error(err);
    }
  }

  async function openConversation(conversationId) {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/message/conversation/${conversationId}`,
      );

      const conversation = data.conversation;

      const otherUser = conversation.participants.find(
        (p) => p._id.toString() !== currentUser._id.toString(),
      );

      setSelectedChat({
        conversationId: conversation._id,
        user: otherUser,
        messages: conversation.messages,
        conversationExists: true,
      });
      setConversations((prev) =>
        prev.map((chat) =>
          chat.conversationId === conversation._id
            ? {
                ...chat,
                user: otherUser,
              }
            : chat,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAllConversations() {
    try {
      const { data } = await axiosInstance.get(
        "/api/user/message/allConversation",
      );

      console.log("All conversations:", data);

      setConversations(data.chats || []);
      if (data.chats?.length > 0) {
        openConversation(data.chats[0].conversationId);
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleSendMessage = (text) => {
    if (!selectedChat || !text.trim()) return;

    const receiverId = selectedChat.user._id;

    const sent = sendMessage({
      type: "MESSAGE",
      payload: {
        receiverId,
        conversationId: selectedChat.conversationId,
        message: text.trim(),
      },
    });

    if (!sent) {
      console.error("Failed to send message. Socket is not connected.");
    }
  };
  return (
    <ChatLayout
      chats={conversations}
      selectedChat={selectedChat}
      onSelectChat={(chat) => {
        if (!chat.conversationId) {
          setSelectedChat(chat);
          return;
        }

        openConversation(chat.conversationId);
      }}
      currentUserId={currentUser._id}
      connectionStatus={connectionStatus}
      onSendMessage={handleSendMessage}
    />
  );
};

export default MessagePage;
