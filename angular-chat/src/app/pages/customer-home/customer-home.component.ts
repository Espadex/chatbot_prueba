import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { Agent } from '../../models/agent';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TopNavComponent, AgentCardComponent],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent {

  myAgents: Agent[] = [
    {
      id: 'chat-mockup',
      name: 'Chat Mockup',
      role: 'practice.user',
      description: 'The Angular chat interface we just refactored. Click Try to enter.',
      status: 'Unrestricted',
      canEdit: true,
      link: '/chat'
    }
  ];

}
