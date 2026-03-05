import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../models/agent';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    // Ya no necesitamos la URL base aquí. El interceptor se encargará de agregarla.
    // Solo definimos adónde queremos apuntar para "agents"
    private endpoint = '/agents';

    constructor(private http: HttpClient) { }

    getAgents(): Observable<Agent[]> {
        return this.http.get<Agent[]>(this.endpoint);
    }

    createAgent(agent: Partial<Agent>): Observable<Agent> {
        return this.http.post<Agent>(this.endpoint, agent);
    }

    deleteAgent(agentId: string): Observable<any> {
        return this.http.delete(`${this.endpoint}/${agentId}`);
    }
}
