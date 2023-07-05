import { useEffect, useState } from 'react';
import { components } from '@/types/openai';
import Image from "next/image";
import { MemoizedReactMarkdown } from '@/components/markdown';
import { CodeBlock } from '@/components/codeblock';
import { descapeJsonString } from '@/utils/util';

type Message = components['schemas']['ChatCompletionRequestMessage'];
type MessageProps = {
  message: Message;
  isFunctionCall?: boolean;
  isStreaming?: boolean;
  streamingMessageIndex?: number;
  currentMessageIndex?: number;
  selectedModel?: string;
};

type AvatarProps = {
  role: string;
  isStreaming?: boolean;
};

const Avatar: React.FC<AvatarProps> = ({ role, isStreaming }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setDarkMode(mediaQuery.matches);

    const listener = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setDarkMode(e.matches);

    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []); 

  if (role === 'assistant' || role === 'function') {
    if (isStreaming) {
      return (
        // Loading spinner
        <svg aria-hidden="true" className={`w-8 h-8 mr-2 text-gray-200 animate-spin ease-in-out dark:fill-fuchsia-500 fill-fuchsia-600 dark:text-gray-600`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      )
    } else {
      return (
        <Image src={darkMode ? "/openai-white-logomark.svg" : "/openai-logomark.svg"} alt="Assistant avatar" width={40} height={40}
          className={'p-2 rounded-md shadow-xl dark:bg-gray-950 bg-white'}
        />

      );
    }
  } else if (role === 'user') {
    return (
      <Image src={darkMode ? "/user-avatar-white.svg" : "/user-avatar-white.svg"} alt="User avatar" width={40} height={40}
        className={'p-2 rounded-md shadow-xl dark:bg-fuchsia-700 bg-black'} />
    );
  } else if (role === 'function') {
    return (
      <Image src={darkMode ? "/function-avatar-white.svg" : "/function-avatar.svg"} alt="Function avatar" width={30} height={30} />
    );
  } else {
    return null;
  }
};

const ChatMessage: React.FC<MessageProps> = ({ message, isStreaming, streamingMessageIndex, currentMessageIndex, selectedModel }) => {

  const renderContent = (message: Message) => {
    if (message.name === 'function_call') {
      // Function Call Results Collapse section
      const content: string = message.content || '';
      if (content.includes(`{"function_call":`)) {
        return (
          <div className="collapse collapse-arrow bg-base-200 top-0">
            <input type="checkbox" className="peer" defaultChecked />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              Function call
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content overflow-auto overflow-x-auto">
              <p>
                <CodeBlock language={`json`} value={content} />
              </p>
            </div>
          </div>
        )
      } else if (content.startsWith(`{"result":`)) {
        return (
          <div className="collapse collapse-arrow bg-base-200 top-0">
            <input type="checkbox" className="peer" defaultChecked />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              Function call response
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content overflow-auto overflow-x-auto">
              <p>
                <CodeBlock language={`json`} value={content} />
              </p>
            </div>
          </div>
        )
      }
      // Non-functional call standard collapse section
    } else {
      const content: string = message.content || '';
      const segments = content.split('```');
      return segments.map((segment, index) => {
        if (index % 2 === 0) {
          // This is a markdown segment
          return <MemoizedReactMarkdown key={index}>{segment}</MemoizedReactMarkdown>;
        } else {
          // This is a code block segment
          const lines = segment.split('\n');
          const language = lines[0]?.trim() || "javascript"; // Default to "javascript" if no language is specified
          const code = lines.slice(1).join('\n'); // The rest of the lines contain the code
          return (
            <div className="mt-4 mb-8" key={index}>
              <CodeBlock language={language} value={code} />
            </div>
          )
        }
      });
    }
  };

  return (
    
    <div
      className={`group md:px-4 ${message.role === 'user'
        ? 'border-b border-black/10 bg-transparent text-#1e232a dark:border-gray-900/50 dark:bg-[#1e232a] dark:text-white'
          : 'border-0 border-black/10 bg-slate-100 dark:border-gray-900/50 dark:bg-gray-700 dark:text-white'
        }`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] text-right font-bold mr-5 sm:mr-4">
          {message.role !== 'function' && <Avatar role={message.role} isStreaming={isStreaming && currentMessageIndex === streamingMessageIndex} />}
        </div>

        <div className="prose mt-[-2px] w-full dark:prose-invert">
          <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
            {message.role !== 'function' && renderContent(message)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;