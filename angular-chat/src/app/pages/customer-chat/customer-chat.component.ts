import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  messages: Message[];
}

@Component({
  selector: 'app-customer-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-chat.component.html',
  styleUrl: './customer-chat.component.css'
})
export class CustomerChatComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  title = 'Chat App Project';
  isLightMode = false;
  activeConversationId = 'alice';
  messageInput = '';
  shouldScroll = false;

  conversations: Conversation[] = [
    {
      id: "alice",
      name: "Alice",
      initials: "AL",
      status: "Online • Practicing JS",
      lastSeen: "Now",
      unread: 2,
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
  ];

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  get activeConversation(): Conversation | undefined {
    return this.conversations.find(c => c.id === this.activeConversationId);
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
