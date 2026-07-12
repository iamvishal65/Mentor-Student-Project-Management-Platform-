import { atom } from "recoil";

export const conversationsState = atom({
  key: "conversationsState",
  default: [],
});

export const selectedChatState = atom({
  key: "selectedChatState",
  default: null,
});