import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/conversations';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-customer-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MarkdownPipe],
  templateUrl: './customer-chat.component.html',
  styleUrl: './customer-chat.component.css'
})
export class CustomerChatComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  title = 'Chat App Project';
  isLightMode = false;
  activeConversationId = ''; // Initialize empty, will set based on active group
  activeGroupId = ''; // Track which group of chats is currently active
  messageInput = '';
  shouldScroll = false;
  agentName = 'Unknown Agent';
  agentExists = true;

  // Generation details
  isGenerating = false;
  generationTimeoutId: any = null;

  // Dropdown menu state
  openDropdownId: string | null = null;
  editingChatId: string | null = null;
  editingChatTitle = '';

  allConversations: Conversation[] = [];

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService,
    private chatService: ChatService
  ) { }

  get conversations(): Conversation[] {
    return this.allConversations.filter(c => c.agentId === this.activeGroupId);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeGroupId = id;

        // Fetch conversations from the mock backend passing the agentId
        this.chatService.getConversations(id).subscribe({
          next: (data) => {
            this.allConversations = data;

            // Don't auto-select if we just created a new Temporary chat
            if (!this.activeConversationId || !this.allConversations.find(c => c.conversationId === this.activeConversationId)) {
              const groupConversations = this.conversations;
              if (groupConversations.length > 0) {
                this.selectConversation(groupConversations[0].conversationId);
              } else {
                this.activeConversationId = '';
              }
            }
          },
          error: (err) => console.error('Error loading conversations:', err)
        });

        // Dynamically get the agent name from the shared service
        this.agentService.getAgents().subscribe({
          next: (agents) => {
            const agent = agents.find(a => a.agentId === id);
            if (agent) {
              this.agentName = agent.name;
              this.agentExists = true;
            } else {
              this.agentName = 'Unknown Agent';
              this.agentExists = false;
            }
          },
          error: (err) => {
            console.error('Error al cargar agentes:', err);
            this.agentName = 'Unknown Agent';
            this.agentExists = false;
          }
        });
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  get activeConversation(): Conversation | undefined {
    return this.allConversations.find(c => c.conversationId === this.activeConversationId && c.agentId === this.activeGroupId);
  }

  selectConversation(id: string) {
    this.activeConversationId = id;
    const conv = this.activeConversation;
    if (conv) {
      // Unread logic removed since it's not in DB model yet
      this.shouldScroll = true;
    }
  }

  createNewTemporaryChat() {
    const newConv: Conversation = {
      conversationId: `temp-${Date.now()}`,
      ownerUserId: 'mock-user-id',
      agentId: this.activeGroupId,
      title: 'New Chat',
      status: 'Online',
      createdAtUtc: new Date().toISOString(),
      messages: []
    };
    this.allConversations.unshift(newConv);
    this.selectConversation(newConv.conversationId);
    this.closeDropdowns();
  }

  sendMessage() {
    if (!this.messageInput.trim() || this.isGenerating) return;

    const conv = this.activeConversation;
    if (!conv) return;

    const userText = this.messageInput.trim();
    this.messageInput = '';

    // Si es un chat temporal, lo volvemos "real" y le ponemos nombre
    if (conv.conversationId.startsWith('temp-')) {
      conv.conversationId = crypto.randomUUID();
      conv.title = userText; // El nombre por defecto es el primer mensaje

      // Simular POST a /api/conversations
      this.chatService.createConversation(conv).subscribe({
        next: () => console.log('Chat Guardado'),
        error: (err) => console.log('Mock fallback saving chat') // ignorar error falso
      });
    }

    // Agregar mensaje del usuario
    const userMsg = {
      messageId: crypto.randomUUID(),
      conversationId: conv.conversationId,
      role: 'user',
      content: userText,
      createdAtUtc: new Date().toISOString()
    };
    conv.messages.push(userMsg);

    // Mandar el mensaje al backend
    this.chatService.sendMessage(conv.conversationId, userMsg).subscribe({
      next: () => { }, error: () => { }
    });

    this.shouldScroll = true;
    this.isGenerating = true;

    // Simular que el agente escribe
    this.generationTimeoutId = setTimeout(() => {
      const replyText = this.createAutoReply(userText);
      const botMsg = {
        messageId: crypto.randomUUID(),
        conversationId: conv.conversationId,
        role: 'assistant',
        content: replyText,
        createdAtUtc: new Date().toISOString()
      };

      conv.messages.push(botMsg);
      this.chatService.sendMessage(conv.conversationId, botMsg).subscribe({
        next: () => { }, error: () => { }
      });

      this.isGenerating = false;
      this.shouldScroll = true;
    }, 2000);
  }

  stopGenerating() {
    if (this.generationTimeoutId) {
      clearTimeout(this.generationTimeoutId);
      this.isGenerating = false;

      // Añadimos mensaje visual de cancelación (Mock)
      const conv = this.activeConversation;
      if (conv) {
        conv.messages.push({
          messageId: crypto.randomUUID(),
          conversationId: conv.conversationId,
          role: 'assistant',
          content: '*(Generación detenida por el usuario)*',
          createdAtUtc: new Date().toISOString()
        });
        this.shouldScroll = true;
      }
    }
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdownId === id) this.openDropdownId = null;
    else this.openDropdownId = id;
  }

  closeDropdowns() {
    this.openDropdownId = null;
  }

  // Renaming Logic
  startRenaming(conv: Conversation, event: Event) {
    event.stopPropagation();
    this.editingChatId = conv.conversationId;
    this.editingChatTitle = conv.title;
    this.closeDropdowns();
  }

  saveRename(conv: Conversation, event: Event) {
    event.stopPropagation();
    const newTitle = this.editingChatTitle.trim();
    if (newTitle && newTitle !== conv.title) {
      conv.title = newTitle;
      this.chatService.renameConversation(conv.conversationId, newTitle).subscribe({
        next: () => { }, error: () => { }
      });
    }
    this.cancelRename(event);
  }

  cancelRename(event?: Event) {
    if (event) event.stopPropagation();
    this.editingChatId = null;
    this.editingChatTitle = '';
  }

  // Deletion logic
  deleteChat(conv: Conversation, event: Event) {
    event.stopPropagation();
    this.chatService.deleteConversation(conv.conversationId).subscribe({
      next: () => {
        this.allConversations = this.allConversations.filter(c => c.conversationId !== conv.conversationId);
        if (this.activeConversationId === conv.conversationId) this.activeConversationId = '';
      },
      error: () => {
        // Fallback en mock
        this.allConversations = this.allConversations.filter(c => c.conversationId !== conv.conversationId);
        if (this.activeConversationId === conv.conversationId) this.activeConversationId = '';
      }
    });
    this.closeDropdowns();
  }

  getInitials(title: string): string {
    return title ? title.charAt(0).toUpperCase() : '?';
  }

  createAutoReply(text: string): string {
    const lowered = text.toLowerCase();
    if (lowered.includes("html"))
      return "HTML is your structure. CSS is your style. JS is the behavior ✨";
    if (lowered.includes("css"))
      return "Try using flexbox or grid to lay out your chat UI.";
    if (lowered.includes("js") || lowered.includes("java"))
      return "Keep functions small and focused. Log things while you debug.";
    if (lowered.includes("help"))
      return "What part feels confusing right now? Break it into tiny steps.";
    return "Nice. Log this in the console so you can see your events in action.";
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    if (this.isLightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll error', err);
      }
    }
  }

  @HostListener('click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    if (this.openDropdownId) {
      this.closeDropdowns();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const copyBtn = target.closest('.copy-btn') as HTMLElement;

    if (copyBtn) {
      const encodedCode = copyBtn.getAttribute('data-code');
      if (encodedCode) {
        const decodedCode = decodeURIComponent(encodedCode);
        navigator.clipboard.writeText(decodedCode).then(() => {
          const originalHtml = copyBtn.innerHTML;
          copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span style="color:#22c55e">Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
          }, 2000);
        }).catch(err => console.error('Error copying text: ', err));
      }
    }
  }
}
