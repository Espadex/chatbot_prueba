import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from '../../services/agent.service';


interface Message {
  from: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  status: string;
  lastSeen: string;
  unread: number;
  groupId: string; // New field to group chats
  messages: Message[];
}

@Component({
  selector: 'app-customer-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private route: ActivatedRoute, private agentService: AgentService) { }

  allConversations: Conversation[] = [
    // --- GROUP 1 CHATS ---
    {
      id: "alice",
      name: "Alice",
      initials: "AL",
      status: "Online • Practicing JS",
      lastSeen: "Now",
      unread: 2,
      groupId: "group1",
      messages: [
        { from: "them", text: "Hey! Ready to practice some JS? 😊", time: "10:21" },
        {
          from: "me",
          text: "Yeah! I'm building a chat UI with HTML/CSS/JS.",
          time: "10:22",
        },
        {
          from: "them",
          text: "Nice. No backend needed — just mock the data.",
          time: "10:23",
        },
      ],
    },
    {
      id: "mentor",
      name: "Mentor Bot",
      initials: "MB",
      status: "Last seen 2h ago",
      lastSeen: "2h",
      unread: 0,
      groupId: "group1",
      messages: [
        {
          from: "them",
          text: "Tip: Keep your JS simple first, then refactor.",
          time: "08:01",
        },
        {
          from: "them",
          text: "Try separating data (conversations) from DOM logic.",
          time: "08:02",
        },
      ],
    },
    {
      id: "notes",
      name: "Coding Notes",
      initials: "CN",
      status: "Pinned • Personal",
      lastSeen: "Yesterday",
      unread: 3,
      groupId: "group1",
      messages: [
        {
          from: "me",
          text: "• TODO: add localStorage\n• TODO: basic search filter\n• TODO: message timestamps",
          time: "21:11",
        },
        {
          from: "them",
          text: "You can also log events to the console while testing.",
          time: "21:12",
        },
      ],
    },
    // --- GROUP 2 CHATS ---
    {
      id: "support",
      name: "Tech Support",
      initials: "TS",
      status: "Online",
      lastSeen: "Now",
      unread: 1,
      groupId: "group2",
      messages: [
        { from: "them", text: "How can I help you today?", time: "09:00" },
      ],
    },
    {
      id: "billing",
      name: "Billing Dept",
      initials: "BD",
      status: "Away",
      lastSeen: "1h",
      unread: 0,
      groupId: "group2",
      messages: [
        { from: "me", text: "I have a question about my invoice.", time: "14:20" },
        { from: "them", text: "Sure, what's your account number?", time: "14:25" },
      ],
    },
  ];

  get conversations(): Conversation[] {
    return this.allConversations.filter(c => c.groupId === this.activeGroupId);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeGroupId = id;

        // Select the first conversation in the group by default
        const groupConversations = this.conversations;
        if (groupConversations.length > 0) {
          this.selectConversation(groupConversations[0].id);
        } else {
          this.activeConversationId = '';
        }

        // Dynamically get the agent name from the shared service
        const agent = this.agentService.getAgents().find(a => a.link === `/chat/${id}`);
        if (agent) {
          this.agentName = agent.name;
        } else {
          this.agentName = 'Chat Mockup';
        }
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
}
