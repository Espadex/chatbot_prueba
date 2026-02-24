export interface Message {
    from: 'me' | 'them';
    text: string;
    time: string;
}

export interface Conversation {
    id: string;
    name: string;
    initials: string;
    status: string;
    lastSeen: string;
    unread: number;
    groupId: string;
    messages: Message[];
}