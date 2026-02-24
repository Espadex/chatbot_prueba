import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // REEMPLAZA esta URL con el enlace de tu Postman para las CONVERSACIONES
    private apiUrl = 'https://AQUI-VA-TU-URL-DE-POSTMAN/api/conversations';

    constructor(private http: HttpClient) { }

    getConversations(): Observable<Conversation[]> {
        return this.http.get<Conversation[]>(this.apiUrl);
    }
}
