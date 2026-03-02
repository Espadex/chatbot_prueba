using System;
using System.Text.Json.Serialization;

namespace ChatbotAPI.Models;

public class Message
{
    public Guid MessageId { get; set; }

    public Guid ConversationId { get; set; }
    [JsonIgnore]
    public Conversation? Conversation { get; set; }

    public string Role { get; set; } = "user"; // user | assistant | system | tool
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}