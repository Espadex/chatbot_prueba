namespace ChatbotAPI.Models;

public class AgentDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool CanEdit { get; set; }
    public string Link { get; set; } = string.Empty;
}
