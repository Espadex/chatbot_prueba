using System;
using System.ComponentModel.DataAnnotations;

namespace ChatbotAPI.Models;

public class Agent
{
    public Guid AgentId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required, MaxLength(100)]
    public string Model { get; set; } = "gpt-4.1";

    public string? SystemPrompt { get; set; }

    public decimal Temperature { get; set; } = 0.7m;

    public int? MaxTokens { get; set; }

    public bool IsEnabled { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}