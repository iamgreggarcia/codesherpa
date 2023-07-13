import React from 'react';
import { Chat } from '@/types/chat';

interface ConversationItemProps {
  conversation: Chat;
  selectConversation: (conversation: Chat) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, selectConversation }) => {
  return (
    <div onClick={() => selectConversation(conversation)}>
      {conversation.title}
    </div>
  );
};

export default ConversationItem;
