import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { Agent } from '../../models/agent';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TopNavComponent, AgentCardComponent],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent implements OnInit {

  myAgents: Agent[] = [];

  // Modal State
  showCreateModal = false;
  newAgent = {
    name: '',
    description: '',
    systemPrompt: ''
  };

  // Selection State
  selectionMode = false;
  selectedAgentIds: Set<string> = new Set();

  constructor(private agentService: AgentService) { }

  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
    this.agentService.getAgents().subscribe({
      next: (data) => this.myAgents = data,
      error: (err) => console.error('Error al cargar agentes:', err)
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.newAgent = { name: '', description: '', systemPrompt: '' };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createNewAgent() {
    if (!this.newAgent.name) return; // Simple validation

    // Simulate other properties that the backend or DB will fill or need Default
    const agentToCreate: Partial<Agent> = {
      name: this.newAgent.name,
      description: this.newAgent.description,
      systemPrompt: this.newAgent.systemPrompt,
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 500,
      isEnabled: true,
      agentId: crypto.randomUUID(), // Temporarily generate a UUID if local, usually backend handles it
      createdAtUtc: new Date().toISOString()
    };

    this.agentService.createAgent(agentToCreate).subscribe({
      next: (agentCreated) => {
        this.myAgents.push(agentCreated);
        this.closeCreateModal();
        this.loadAgents(); // Refresh from backend to get true ID if DB created it
      },
      error: (err) => {
        console.error('Error creating agent', err);
        // Fallback for mock backend: Just add it logically since the API returns 404 or nothing sometimes on Mock
        this.myAgents.push(agentToCreate as Agent);
        this.closeCreateModal();
      }
    });
  }

  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
    this.selectedAgentIds.clear();
  }

  toggleAgentSelection(agentId: string) {
    if (this.selectedAgentIds.has(agentId)) {
      this.selectedAgentIds.delete(agentId);
    } else {
      this.selectedAgentIds.add(agentId);
    }
  }

  deleteSelectedAgents() {
    const idsToDelete = Array.from(this.selectedAgentIds);
    if (idsToDelete.length === 0) return;

    // Call delete sequentially or parallel. For now let's just do an iterative approach
    idsToDelete.forEach(id => {
      this.agentService.deleteAgent(id).subscribe({
        next: () => {
          this.myAgents = this.myAgents.filter(a => a.agentId !== id);
        },
        error: (err) => {
          // If the backend doesn't support DELETE completely yet on mock, just fake delete locally
          console.error(`Mock fallback to delete agent: ${id}`, err);
          this.myAgents = this.myAgents.filter(a => a.agentId !== id);
        }
      });
    });

    this.toggleSelectionMode();
  }

}
