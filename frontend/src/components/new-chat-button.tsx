import React from 'react';

interface NewChatButtonProps {
    addNewChat: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ addNewChat }) => {
    return (
        <button onClick={addNewChat}>New Chat</button>
    );
};

export default NewChatButton;
