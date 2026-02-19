import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Agent } from '../../models/agent';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-card.component.html',
  styleUrl: './agent-card.component.css'
})
export class AgentCardComponent {
  @Input() agent!: Agent;
}
