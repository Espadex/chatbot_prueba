import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() selectionMode = false;
  @Input() isSelected = false;
  @Output() toggleSelect = new EventEmitter<void>();

  onToggle(event?: Event) {
    if (this.selectionMode) {
      if (event) event.preventDefault();
      this.toggleSelect.emit();
    }
  }
}
