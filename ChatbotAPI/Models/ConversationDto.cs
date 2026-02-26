using System.Collections.Generic;

namespace ChatbotAPI.Models;

public class ConversationDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string LastSeen { get; set; } = string.Empty;
    public int Unread { get; set; }
    public string GroupId { get; set; } = string.Empty;
    public List<MessageDto> Messages { get; set; } = new();
}
