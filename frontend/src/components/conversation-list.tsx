// src/
//  └── components/
//      └── ConversationList.tsx

import React from 'react';
import { Chat } from '@/types/chat';

import ConversationItem from './conversation-item';

interface ConversationListProps {
  conversations: Chat[];
  selectConversation: (conversation: Chat) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectConversation }) => {
  return (
    <div>
      {conversations.map((conversation) => 
        <ConversationItem 
          key={conversation.id}
          conversation={conversation} 
          selectConversation={selectConversation}
        />
      )}
    </div>
  );
};

export default ConversationList;
