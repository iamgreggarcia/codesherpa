import { useState, useEffect, useRef, MutableRefObject, useCallback } from 'react';
import { Model, pathMap, serverUrl, SYSTEM_PROMPT, SYSTEM_PROMPT_CODE_INTERPRETER } from '@/constants/openai';
import { operations } from '@/utils/services/plugin-protocol/codesherpa';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ModelSelector from '@/components/model-selector';
import ChatMessage from '@/components/chat-message';
import { OpenAIError, descapeJsonString } from '@/utils/util';
import { Message } from '@/utils/services/openai/openai-stream';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { UploadedFile } from '@/components/uploaded-file';


export default function Chat() {
  const [selectedModel, setSelectedModel] = useState(Model.GPT3_5_CODE_INTERPRETER_16K);
  const [messages, setMessages] = useState<Message[]>([{ role: 'system', content: selectedModel === Model.GPT3_5_CODE_INTERPRETER_16K || Model.GPT4_CODE_INTERPRETER ? SYSTEM_PROMPT_CODE_INTERPRETER : SYSTEM_PROMPT }]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageIsStreaming, setMessageIsStreaming] = useState(false);
  const [functionCallArgs, setFunctionCallArgs] = useState<string>('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [functionCall, setFunctionCall] = useState(null);
  const [isFunctionCall, setIsFunctionCall] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cancelStreamRef: MutableRefObject<boolean> = useRef(false);
  const accumulatedChunksRef: MutableRefObject<string> = useRef('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);


  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const onUploadFile = async (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file);
    const fileData = formData.get('file');
    const fileName = fileData instanceof File ? fileData.name : '';

    console.log('formData: ', formData);

    try {
      const response = await fetch('http://localhost:3333/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OK')
        toast.success('File uploaded successfully');

        setUploadedFileName(fileName);
        setUploadedFileUrl(data.url);
        console.log('data.url: ', data.url)
      } else {
        toast.error(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`);
    }
  };

  const onDeleteFile = async () => {
    try {
      const response = await fetch(`http://localhost:3333/delete-file?fileName=${uploadedFileName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('File deleted successfully');
        setUploadedFileUrl(null);
        setUploadedFileName(null);
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      toast.error(`Failed to delete file: ${(error as Error).message}`);
    }
  };


  /**
   * This function fetches the chat messages from the backend API and updates the messages state.
   * It sends a POST request to the '/api/chat' endpoint with the current messages and selected model.
   * If the response contains a function call, it extracts the function name and arguments,
   * and displays the function call in the chat.
   * @param messages - The current chat messages.
   * @param abortController - The AbortController used to cancel the fetch request.
   * @returns The content of the assistant message.
   */
  const fetchChat = async (messages: Message[], abortController: AbortController) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify({ messages, model: selectedModel }),
    });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantMessageContent = '';
    let isFunction = false;
    let first = true;
    let done = false;

    if (reader) {
      while (!done) {
        if (cancelStreamRef.current === true) {
          abortController.abort();
          done = true;
          break;
        }
        const { done: doneReading, value } = await reader.read();
        done = doneReading;
        if (done) {
          break;
        }
        let decodedValue = decoder.decode(value);
        assistantMessageContent += decodedValue;

        // Check if the accumulated chunks form a complete JSON object
        try {
          const parsed = JSON.parse(assistantMessageContent);
          if (parsed.function_call) {
            isFunction = true;
            setIsFunctionCall(true);
          }
        } catch (error) {
          // If parsing fails, continue accumulating chunks
        }

        if (isFunction) {
          if (first) {
            first = false;
            const assistantMessage: Message = { role: 'assistant', name: 'function_call', content: decodedValue ?? '' };
            setMessages(prevMessages => [...prevMessages, assistantMessage]);

          } else {
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              lastMessage.content = assistantMessageContent;
              return updatedMessages;
            });
          }
        } else {
          if (first) {
            first = false;
            const assistantMessage: Message = { role: 'assistant', content: decodedValue ?? '' };
            setMessages(prevMessages => [...prevMessages, assistantMessage]);

          } else {
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              lastMessage.content = assistantMessageContent;
              return updatedMessages;
            });
          }
        }
      }
    }

    return assistantMessageContent;
  };

  /**
   * This function handles sending a message to the chatbot and receiving a response.
   * It is triggered when the user submits a message through the chat input field.
   * If the response contains a function call, it extracts the function name and arguments,
   * sends a POST request to the corresponding endpoint, and displays the result in the chat.
   * @param event - The form event triggered by submitting the message.
   */
  const handleSendMessage = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setMessageIsStreaming(true);
      setConversationStarted(true);
      const newUserMessage: Message = { role: 'user', content: newMessage ?? '' };
      setNewMessage('');
      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "56px";
      }

      if (uploadedFileUrl) {
        newUserMessage.content += `\nFile: ${uploadedFileUrl}`;
      }

      const abortController = new AbortController();
      try {
        let assistantMessageContent = await fetchChat([...messages, newUserMessage], abortController);

        const functionCallIndex = assistantMessageContent.indexOf('{"function_call":');
        console.log('functionCallIndex: ', functionCallIndex)
        if (functionCallIndex !== -1) {
          const functionCallStr = assistantMessageContent.slice(functionCallIndex);
          console.log('functionCallStr: ', functionCallStr)
          const parsed = JSON.parse(functionCallStr);
          console.log('parsed: ', parsed)
          let functionName = parsed.function_call.name
          let functionArgumentsStr = parsed.function_call.arguments;

          console.log('function name: ', parsed.function_call.name);
          console.log('function arguments: ', parsed.function_call.arguments);
          const requestBody = functionArgumentsStr;
          let endpoint = pathMap[functionName as keyof operations];
          if (!endpoint) {
            // throw new Error('Endpoint is undefined');
            const functionCallMessage: Message = { role: 'assistant', content: `I'm sorry, I used the incorret function name '${functionName}'. Let me try again:\n`};
            setMessages(prevMessages => [...prevMessages, functionCallMessage]);
            fetchChat([...messages, functionCallMessage], abortController);
          } else {
            console.log('endpoint: ', endpoint)
            const pluginResponse = await fetch(`${serverUrl}${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody
            });

            const parsedFunctionCallResponse = await pluginResponse.json();
            // const stringifiedparsedFunctionCallResponse = JSON.stringify(parsedFunctionCallResponse);
            // setMessages(prevMessages => {
            //   const updatedMessages = [...prevMessages];
            //   const lastMessage = updatedMessages[updatedMessages.length - 1];
            //   lastMessage.content = `\n${stringifiedparsedFunctionCallResponse}`;
            //   return updatedMessages;
            // });
            console.log('parsedFunctionCallResponse: ', parsedFunctionCallResponse)
            console.log('parsedFunctionCallResponse.result: ', parsedFunctionCallResponse.result ?? '')
            const functionCallMessage: Message = { role: 'function', name: functionName, content: `result: ${parsedFunctionCallResponse.result}` ?? 'result: ok' };
            setMessages(prevMessages => [...prevMessages, functionCallMessage]);
            fetchChat([...messages, functionCallMessage], abortController);
          }
        }
      } catch (error) {
        if (error instanceof OpenAIError) {
          alert(`OpenAIError: ${error.message}`);
        } else if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        }
        setMessageIsStreaming(false);
        setIsFunctionCall(false);
        setNewMessage('');
      }
      setMessageIsStreaming(false);
      setIsFunctionCall(false);
      setNewMessage('');
    },
    [messages, newMessage, selectedModel, cancelStreamRef, uploadedFileUrl],
  );

  const stopConversationHandler = () => {
    setMessageIsStreaming(false);
    setNewMessage('');
    cancelStreamRef.current = true;
    setTimeout(() => {
      cancelStreamRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    if (textareaRef.current && newMessage !== '') {
      // Reset the height to auto to reduce the height and recalculate scrollHeight
      textareaRef.current.style.height = 'inherit';

      // Set the height to scrollHeight to expand the textarea
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      // Set the maxHeight to limit how much the textarea can expand
      textareaRef.current.style.maxHeight = '200px';

      // Set the overflow to auto if the content exceeds maxHeight
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 200 ? 'auto' : 'hidden';
    }
  }, [newMessage]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, textareaRef.current]);

  return (
    <>
      <div className="relative h-screen mx-0">

        <div className="flex flex-col h-screen p-6 mx-14">
          <div className={`absolute top-0 left-0 w-full border-transparent  dark:border-white/20 dark:via-[#343541] dark:to-[#343541] 
      ${conversationStarted ? 'pt-0 md:pt-0' : 'pt-8 md:pt-6'}`}>
            <div className={`flex flex-row justify-center z-50 items-center pt-0 mx-0 md:mx-0 ${conversationStarted ? 'fixed' : ''}`}>
              <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} conversationStarted={conversationStarted} />
            </div>
            <div className=" mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto">
              <div className="flex-1 overflow-auto mt-12 mb-40 bg-transparent">
                {messages.map((message, index) => message.role !== 'system' && <ChatMessage key={index} message={message} isStreaming={messageIsStreaming} streamingMessageIndex={messages.length - 1} currentMessageIndex={index} isFunctionCall={isFunctionCall} selectedModel={selectedModel} />)}
                <div ref={messageEndRef} />
              </div>
            </div>
          </div>
          <div className="fixed border-0 bottom-0 left-0 w-full dark:border-orange-200 bg-gradient-to-b from-transparent via-white to-white pt-6 dark:via-[#1f232a] dark:to-[#1f232a] md:pt-2">
            <div className="stretch mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">


              <div className="relative flex mx-1 flex-col h-full flex-1 items-stretch border-black/10 bg-slate-100 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:bg-gray-700 dark:text-white dark:focus:border-12 dark:shadow-[0_0_20px_rgba(0,0,0,0.10)] sm:mx-4 rounded-xl outline-none">

                {uploadedFileName &&
                  <div className="md:mx-2 mt-2">
                    {/* The UploadedFile component should go here */}
                    <UploadedFile filename={uploadedFileName} onDelete={onDeleteFile} />
                  </div>
                }
                <textarea
                  ref={textareaRef}
                  className="flex-grow outline-none m-0 w-full resize-none bg-transparent pt-4 pr-12 pl-12 ml-4 text-black dark:bg-transparent dark:text-white md:pl-[30px] rounded-md placeholder:text-gray-400 dark:placeholder:text-gray-300"
                  style={{
                    maxHeight: '400px',
                    overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? 'auto' : 'hidden'}`,
                    minHeight: '56px',
                    cursor: 'text',

                  }}
                  placeholder={`Send a message`}
                  value={newMessage}
                  rows={1}
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }} />


                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  onChange={onUploadFile}
                />
                <button
                  className="absolute left-4 bottom-4 p-0 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:hover:bg-opacity-20 dark:hover:bg-neutral-200 dark:hover:rounded-full transition-all duration-200 dark:text-neutral-100 dark:hover:text-neutral-100"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  onKeyDown={() => { }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  type="submit"
                  className={`absolute right-2 bottom-4 p-1 rounded-md text-neutral-800 opacity-90 ${messageIsStreaming ? 'bg-red-500' : newMessage.length === 0 ? 'bg-transparent text-neutral-800 opacity-60' : 'bg-fuchsia-500 text-neutral-100'} dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-900 duration-100 transition-all`}
                  onClick={messageIsStreaming ? stopConversationHandler : handleSendMessage}
                  disabled={newMessage.length === 0}
                >
                  {messageIsStreaming ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path className="animate-pulse duration-150" strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                    </svg>
                  ) : (
                    <PaperAirplaneIcon className={`${newMessage.length === 0 ? 'h-0 w-0' : 'h-4 w-4'}`} />
                  )}
                </button>
                <button
                  className=" absolute left-4 bottom-2 p-0 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:hover:bg-opacity-20 dark:hover:bg-neutral-200 dark:hover:rounded-full transition-all duration-200 dark:text-neutral-100 dark:hover:text-neutral-100"
                  onClick={() => {/* regenerate response function */ }}
                  onKeyDown={() => { }}
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg> */}
                </button>
              </div>




            </div>
            <div className="px-3 pt-2 pb-3 text-center text-[12px] text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">            <a
              href="https://github.com/iamgreggarcia/codesherpa"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
            </a>
              {' '}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}