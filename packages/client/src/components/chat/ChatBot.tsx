import type { Message } from './ChatMessages';

import * as React from 'react';

import axios from 'axios';

import ChatInput, { type ChatFormData } from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ChatMessages from './ChatMessages';

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = React.useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = React.useState(false);
   const [error, setError] = React.useState('');

   const conversationId = React.useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
