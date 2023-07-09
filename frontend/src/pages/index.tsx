import { useState } from 'react';
import { Inter } from 'next/font/google'
import { Chat as ChatType } from '@/types/chat';
import { saveConversation, saveConversations, updateConversation } from '@/utils/app/chat';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from '@/components/sidebar';
import Chat from '@/pages/chat'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [conversations, setConversations] = useState<ChatType[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatType | null>(null);

  const addNewChat = () => {
    const newChat: ChatType = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
    };

    setConversations(prevConversations => [newChat, ...prevConversations]);

    saveConversation(newChat);
    saveConversations([newChat, ...conversations]);
  };

  const selectConversation = (conversation: ChatType) => {
    if (currentConversation) {
      // Save the current conversation before switching to a new one
      const updatedConversations = conversations.map((c: ChatType) => {
        if (c.id === currentConversation.id) {
          return currentConversation;
        }

        return c;
      });

      saveConversation(currentConversation);
      saveConversations(updatedConversations);
    }

    setCurrentConversation(conversation);
  };

  return (
    <main>
      {/* <Sidebar
        conversations={conversations}
        addNewChat={addNewChat}
        selectConversation={selectConversation}
      /> */}
      <Chat />
    </main>
  );
}
