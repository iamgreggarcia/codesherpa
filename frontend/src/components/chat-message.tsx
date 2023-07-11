// src/components/chat-message.tsx
import { useEffect, useState } from 'react';
import { components } from '@/types/openai';
import Image from "next/image";
import { MemoizedReactMarkdown } from '@/components/markdown';
import { CodeBlock } from '@/components/codeblock';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
    return (
      <Image src={darkMode ? "/openai-white-logomark.svg" : "/openai-logomark.svg"} alt="Assistant avatar" width={40} height={40} className='p-2 rounded-md shadow-xl dark:bg-black bg-white' />
    );
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

const ChatMessage: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`group md:px-4 ${message.role === 'user'
        ? 'border-b border-black/15 bg-transparent text-[#1e232a] dark:border-gray-900/50 dark:bg-[#1e232a] dark:text-white'
        : 'border-0 border-black/15 bg-slate-100 dark:border-gray-900/50 dark:bg-gray-700 dark:text-white'
        }`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="relative m-auto flex p-4  md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] text-right font-bold mr-5 sm:mr-4">
          {message.role !== 'function' && <Avatar role={message.role} />}
        </div>

        <div className=" mt-[-2px] w-full ">
          {message.content && (
            <MemoizedReactMarkdown
              className="dark:text-slate-200 prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == '▍') {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                      )
                    }

                    children[0] = (children[0] as string).replace('`▍`', '▍')
                  }

                  const match = /language-(\w+)/.exec(className || '')

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  )
                }
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};


export default ChatMessage;
