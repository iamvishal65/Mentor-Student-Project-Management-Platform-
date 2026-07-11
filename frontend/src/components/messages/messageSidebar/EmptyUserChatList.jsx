import React from "react";
import { MessageCirclePlus } from "lucide-react";

const EmptyChatList = () => {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-gray-900">
        {/* Decorative Background */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-100 opacity-40 blur-3xl dark:bg-emerald-900/30" />
        <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-sky-100 opacity-30 blur-3xl dark:bg-sky-900/30" />

        {/* Icon */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
          <MessageCirclePlus
            size={38}
            className="text-emerald-600 dark:text-emerald-400"
            strokeWidth={2}
          />
        </div>

        {/* Content */}
        <div className="relative mt-6 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            No conversations yet
          </h2>

          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Start a new conversation to begin messaging. Your recent chats will
            appear here once you connect with someone.
          </p>
        </div>

        {/* Button */}
        <button
          type="button"
          aria-label="Start a new chat"
          className="relative mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default EmptyChatList;