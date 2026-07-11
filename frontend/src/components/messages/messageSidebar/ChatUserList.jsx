import ChatCard from "./ChatCard";
import EmptyChatList from "./EmptyChatList";

const ChatList = ({ chats, selectedChatId }) => {
  if (!chats?.length) {
    return (
      <div className="h-full">
        <EmptyChatList />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden scroll-smooth px-3 py-2">
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <ChatCard
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;