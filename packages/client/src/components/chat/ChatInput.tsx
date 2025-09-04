import * as React from 'react';

import { useForm } from 'react-hook-form';

import { Button } from '../ui/button';

import { FaArrowUp } from 'react-icons/fa';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   // Change height of textarea as text grows
   const textareaRef = React.useRef<HTMLTextAreaElement>(null);

   const handleInput = () => {
      const textarea = textareaRef.current;
      if (textarea) {
         textarea.style.height = 'auto';
         textarea.style.height = textarea.scrollHeight + 'px';
      }
   };

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   return (
      <form
         onSubmit={submit}
         onKeyDown={handleKeyDown}
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
            autoFocus
            className="w-full border-0 focus:outline-0 resize-none overflow-hidden"
            placeholder="Ask anything"
            maxLength={1000}
            onInput={handleInput}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
