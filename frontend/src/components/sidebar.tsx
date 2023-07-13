import React from 'react';
import { Chat } from '@/types/chat';

import ConversationList from './conversation-list';
import NewChatButton from './new-chat-button';

interface SidebarProps {
  conversations: Chat[];
  addNewChat: () => void;
  selectConversation: (conversation: Chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, addNewChat, selectConversation }) => {
  return (
    <div>
      <NewChatButton addNewChat={addNewChat} />
      <ConversationList 
        conversations={conversations}
        selectConversation={selectConversation}
      />
    </div>
  );
};

export default Sidebar;
