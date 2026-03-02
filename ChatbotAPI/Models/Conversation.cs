using System;
using System.Collections.Generic;

namespace ChatbotAPI.Models;

public class Conversation
{
    public Guid ConversationId { get; set; }
    
    public Guid OwnerUserId { get; set; }
    public User? OwnerUser { get; set; }

    public Guid? AgentId { get; set; }
    public Agent? Agent { get; set; }

    public string? Title { get; set; }
    public string Status { get; set; } = "active";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}