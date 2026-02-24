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
  agentName = 'Chat Mockup';

  allConversations: Conversation[] = [];

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService,
    private chatService: ChatService
  ) { }

  get conversations(): Conversation[] {
    return this.allConversations.filter(c => c.groupId === this.activeGroupId);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeGroupId = id;

        // Fetch conversations from the mock backend
        this.chatService.getConversations().subscribe({
          next: (data) => {
            this.allConversations = data;

            // Select the first conversation in the group by default after loading
            const groupConversations = this.conversations;
            if (groupConversations.length > 0) {
              this.selectConversation(groupConversations[0].id);
            } else {
              this.activeConversationId = '';
            }
          },
          error: (err) => console.error('Error loading conversations:', err)
        });

        // Dynamically get the agent name from the shared service
        this.agentService.getAgents().subscribe({
          next: (agents) => {
            const agent = agents.find(a => a.link === `/chat/${id}`);
            if (agent) {
              this.agentName = agent.name;
            } else {
              this.agentName = 'Chat Mockup';
            }
          },
          error: (err) => {
            console.error('Error al cargar agentes:', err);
            this.agentName = 'Chat Mockup';
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
    return this.allConversations.find(c => c.id === this.activeConversationId && c.groupId === this.activeGroupId);
  }

  selectConversation(id: string) {
    this.activeConversationId = id;
    const conv = this.activeConversation;
    if (conv) {
      conv.unread = 0;
      this.shouldScroll = true;
    }
  }

  sendMessage() {
    if (!this.messageInput.trim()) return;

    const conv = this.activeConversation;
    if (!conv) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    conv.messages.push({
      from: 'me',
      text: this.messageInput.trim(),
      time
    });

    const userText = this.messageInput;
    this.messageInput = '';
    this.shouldScroll = true;

    setTimeout(() => {
      const replyText = this.createAutoReply(userText);
      conv.messages.push({
        from: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.shouldScroll = true;
    }, 1000);
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
  onChatClick(event: MouseEvent) {
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
