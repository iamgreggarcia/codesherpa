import { Chat } from '@/types/chat';

/**
 * Updates a conversation in the list of all conversations and saves it to local storage.
 * @param updatedConversation The updated conversation object.
 * @param allConversations The list of all conversations.
 * @returns An object containing the updated conversation and the list of all conversations.
 */
export const updateConversation = (
    updatedConversation: Chat,
    allConversations: Chat[],
): { single: Chat, all: Chat[] } => {
    const updatedConversations = allConversations.map((c: Chat) => {
        if (c.id === updatedConversation.id) {
            return updatedConversation;
        }

        return c;
    });

    saveConversation(updatedConversation);
    saveConversations(updatedConversations);

    return {
        single: updatedConversation,
        all: updatedConversations,
    };
};

/**
 * Saves a conversation to local storage.
 * @param conversation The conversation object to be saved.
 */
export const saveConversation = (conversation: Chat): void => {
    localStorage.setItem('selectedConversation', JSON.stringify(conversation));
};

/**
 * Saves a list of conversations to local storage.
 * @param conversations The list of conversations to be saved.
 */
export const saveConversations = (conversations: Chat[]): void => {
    localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};