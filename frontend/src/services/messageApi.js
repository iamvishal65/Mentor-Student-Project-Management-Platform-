import axiosInstance from "../api/authApi";

export async function getConversation(userId) {
  const { data } = await axiosInstance.get(
    `/api/user/message/checkConversation/${userId}`
  );

  return data;
}

export async function getChatHistory(conversationId) {
  const { data } = await axiosInstance.get(
    `/api/user/message/history/${conversationId}`
  );

  return data;
}

export async function createConversation(receiverId) {
  const { data } = await axiosInstance.post(
    "/api/user/message/conversation",
    { receiverId }
  );

  return data;
}