import { Injectable } from '@angular/core';
import { Agent } from '../models/agent';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private agents: Agent[] = [
        {
            id: 'chat-mockup',
            name: 'Practice Chats',
            role: 'practice.group',
            description: 'Your coding practice mockups (Alice, Mentor, Notes).',
            status: 'Unrestricted',
            canEdit: true,
            link: '/chat/group1'
        },
        {
            id: 'support-bots',
            name: 'Support Bots',
            role: 'service.group',
            description: 'Customer service bots (Tech Support, Billing).',
            status: 'Unrestricted',
            canEdit: true,
            link: '/chat/group2'
        }
    ];

    getAgents(): Agent[] {
        return this.agents;
    }
}
