import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversations';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Apuntamos al endpoint específico. El interceptor pondrá la URL del Postman al inicio.
    private endpoint = '/chats';

    constructor(private http: HttpClient) { }

    getConversations(): Observable<Conversation[]> {
        return this.http.get<Conversation[]>(this.endpoint);
    }
}
