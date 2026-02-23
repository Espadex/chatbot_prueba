import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { Agent } from '../../models/agent';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TopNavComponent, AgentCardComponent],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent implements OnInit {

  myAgents: Agent[] = [];

  constructor(private agentService: AgentService) { }

  ngOnInit() {
    this.myAgents = this.agentService.getAgents();
  }

}
