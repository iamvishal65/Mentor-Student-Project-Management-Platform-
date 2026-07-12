import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const EmptyConversation = ({
  title = "No messages yet",
  description = "Start the conversation by sending your first message.",
  buttonText = "Send First Message",
  onStartConversation,
}) => {
  return (
    <section className="flex h-full w-full items-center justify-center rounded-2xl bg-white px-6 py-10 dark:bg-gray-900">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <HiOutlineChatBubbleLeftRight
            className="h-12 w-12 text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {description}
        </p>

        <p className="mt-4 text-xs tracking-wide text-gray-400 dark:text-gray-500">
          Your messages are private and secure.
        </p>

        <button
          type="button"
          aria-label={buttonText}
          onClick={onStartConversation}
          className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default EmptyConversation;