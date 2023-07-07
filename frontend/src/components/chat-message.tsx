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

const Avatar: React.FC<AvatarProps> = ({ role }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setDarkMode(mediaQuery.matches);

    const listener = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setDarkMode(e.matches);

    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (role === 'assistant' || role === 'function') {
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

  const renderContent = (message: Message, isStreaming: boolean) => {
    if (message.name === 'function_call') {
      // Function Call Results Collapse section
      const content: string = message.content || '';
      if (content.includes(`{"function_call":`)) {
        return (
          <div className="collapse collapse-arrow bg-base-200 top-0">
            <input type="checkbox" className="peer" defaultChecked />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <span className="font-bold">Function call</span>
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
              <span className="font-bold">Function call response</span>
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content overflow-auto overflow-x-auto">
              <p>
                <CodeBlock language={`json`} value={content} />
              </p>
            </div>
          </div>
        )
      }
    } else {
      const content: string = message.content || '';
      const segments = content.split('```');
      return segments.map((segment, index) => {
        if (index % 2 === 0) {
          return <MemoizedReactMarkdown key={index}>{segment}</MemoizedReactMarkdown>;
        } else {
          const lines = segment.split('\n');
          const language = lines[0]?.trim() || "javascript";
          const code = lines.slice(1).join('\n');
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
          {message.role !== 'function' && <Avatar role={message.role} />}
        </div>

        <div className="prose mt-[-2px] w-full dark:prose-invert">
          <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
            {message.role !== 'function' && renderContent(message, (isStreaming && currentMessageIndex === streamingMessageIndex) ?? false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;