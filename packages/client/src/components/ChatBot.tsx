import type { KeyboardEvent } from 'react';

import * as React from 'react';

import axios from 'axios';

import { useForm } from 'react-hook-form';

import { Button } from './ui/button';

import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const conversationId = React.useRef(crypto.randomUUID());
   const [messages, setMessages] = React.useState<string[]>([]);

   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, prompt]);

      reset();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, data.message]);
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   const textareaRef = React.useRef<HTMLTextAreaElement>(null);

   const handleInput = () => {
      // Change height of textarea as text grows
      const textarea = textareaRef.current;
      if (textarea) {
         textarea.style.height = 'auto';
         textarea.style.height = textarea.scrollHeight + 'px';
      }
   };

   return (
      <div>
         <div>
            {messages.map((message, index) => (
               <p key={index}>{message}</p>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               ref={(textPrompt) => {
                  textareaRef.current = textPrompt;
                  register('prompt').ref(textPrompt);
               }}
               className="w-full border-0 focus:outline-0 resize-none overflow-hidden"
               placeholder="Ask anything"
               maxLength={1000}
               onInput={handleInput}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
