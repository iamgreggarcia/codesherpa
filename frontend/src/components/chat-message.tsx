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
  isStreaming?: boolean;
  lastMessage: Message;
  streamingMessageIndex?: number;
  isCurrentMessage: boolean;
};

type AvatarProps = {
  role: string;
  lastMessageRole: string;
};

const Avatar: React.FC<AvatarProps> = ({ role, lastMessageRole }) => {
  const [darkMode, setDarkMode] = useState(false);
  console.log(lastMessageRole)
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

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  isStreaming?: boolean;
  isCurrentMessage?: boolean;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, className = "", isStreaming, isCurrentMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex items-center text-xs rounded p-3 text-gray-900 bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <span className={`text-secondary mr-2 ${isStreaming && isCurrentMessage ? 'loading loading-spinner loading-sm' : 'hidden'}`} style={{ width: '1.5rem' }}></span>
        <div>{title}</div>
        <div className="ml-12 flex items-center gap-2" role="button">
          <div className="text-xs text-gray-600">{isOpen ? 'Hide work' : 'Show work'}</div>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
          </svg>
        </div>
      </div>
      {isOpen && <div className="mt-3 self-stretch">{children}</div>}
    </div>
  );
};


function checkContent(content: string) {
  return content.includes('{"function_call":') || content.includes('result:');
}

const ChatMessage: React.FC<MessageProps> = ({ message, isStreaming, isCurrentMessage, streamingMessageIndex, lastMessage }) => {
  let content = message.content;
  if (isStreaming && isCurrentMessage && message.role !== 'user') {
    // Append the cursor character at the end of the streaming text
    content += '▍';
  }

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
          {((message.role === 'user') ||
            (message.role === 'assistant' && lastMessage.role === 'user') ||
            (message.role === 'function' && lastMessage?.role === 'user')) &&
            <Avatar role={message.role} lastMessageRole={lastMessage.role} />}
        </div>


        <div className=" mt-[-2px] w-full">
          {content && (
            checkContent(content) ?
              <CollapsibleSection title="Function call" isStreaming={isStreaming} isCurrentMessage={isCurrentMessage} >
                {/* <div className='bg-gray-400 h-5 pl-2 text-black text-sm text-left mr-7'>content</div> */}
                <MemoizedReactMarkdown
                  className="dark:text-slate-200 prose break-words bg-gray-950 overflow-x-scroll p-4 dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
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
                        <>
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ''}
                            value={String(children).replace(/\n$/, '')}
                            isCurrentMessage={isCurrentMessage}
                            isStreaming={isStreaming}
                            {...props}
                          />
                        </>
                      )
                    }
                  }}
                >
                  {content}

                </MemoizedReactMarkdown >
              </CollapsibleSection>
              :
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
                      <>
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          isCurrentMessage={isCurrentMessage}
                          isStreaming={isStreaming}
                          {...props}
                        />
                      </>
                    )
                  }
                }}
              >
                {content}
              </MemoizedReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
