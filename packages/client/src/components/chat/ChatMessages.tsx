import * as React from 'react';

import ReactMarkdown from 'react-markdown';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};

type Props = {
   messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = React.useRef<HTMLDivElement | null>(null);

   // Scroll down to bottom of the conversation after submitting new prompts
   React.useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   // Resetting copy styiling
   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col gap-3">
         {messages.map((message, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 rounded-xl  ${
                  message.role === 'user'
                     ? 'bg-blue-600 text-white self-end'
                     : 'bg-gray-100 text-black self-start'
               }`}
            >
               <ReactMarkdown
                  components={{
                     p: ({ node, ...props }) => (
                        <p className="my-2 first:mt-0 last:mb-0" {...props} />
                     ),
                     ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-5 mb-4" {...props} />
                     ),
                     ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-5 mb-4" {...props} />
                     ),
                     li: ({ node, ...props }) => (
                        <li className="mb-1 last:mb-0" {...props} />
                     ),
                  }}
               >
                  {message.content}
               </ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
