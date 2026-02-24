import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../models/agent';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    // REEMPLAZA esta URL con el enlace de tu Postman o JSON Generator (asegúrate de que apunte al JSON de tus agentes)
    private apiUrl = 'https://AQUI-VA-TU-URL-DE-POSTMAN/api/agents';

    constructor(private http: HttpClient) { }

    getAgents(): Observable<Agent[]> {
        return this.http.get<Agent[]>(this.apiUrl);
    }
}
