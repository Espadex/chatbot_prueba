import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversations';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    // Se queda exactamente igual
    private endpoint = '/api/conversations';

    constructor(private http: HttpClient) { }

    // Recibimos el agentId como parámetro
    getConversations(agentId: string): Observable<Conversation[]> {
        const params = new HttpParams().set('agentId', agentId);
        return this.http.get<Conversation[]>(`${this.endpoint}/${agentId}`, { params });
    }

    createConversation(data: any): Observable<Conversation> {
        return this.http.post<Conversation>(this.endpoint, data);
    }

    deleteConversation(conversationId: string): Observable<any> {
        return this.http.delete(`${this.endpoint}/${conversationId}`);
    }

    renameConversation(conversationId: string, title: string): Observable<any> {
        // Asumiendo un endpoint PATCH, o bien usaremos PUT
        return this.http.patch(`${this.endpoint}/${conversationId}`, { title });
    }

    sendMessage(conversationId: string, message: any): Observable<any> {
        return this.http.post(`${this.endpoint}/${conversationId}/messages`, message);
    }
}
