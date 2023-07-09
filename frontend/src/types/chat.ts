// src/
//  └── types/
//      └── chat.ts
import { Message } from '@/utils/services/openai/openai-stream';

export interface Chat extends Record<string, any> {
    id: string
    title: string
    messages: Message[]
}