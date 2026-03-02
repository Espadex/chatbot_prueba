export interface Message {
    messageId: string;
    conversationId: string;
    role: string; // 'user' | 'assistant'
    content: string;
    createdAtUtc: string;
}

export interface Conversation {
    conversationId: string;
    ownerUserId: string;
    agentId: string;
    title: string;
    status: string;
    createdAtUtc: string;
    messages: Message[];
}