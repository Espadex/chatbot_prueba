using Microsoft.AspNetCore.Mvc;
using ChatbotAPI.Models;
using System.Collections.Generic;
using System;

namespace ChatbotAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class AgentsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Agent>> Get()
    {
        var agents = new List<Agent>
        {
            new Agent
            {
                AgentId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Practice Chats",
                Description = "Your coding practice mockups (Alice, Mentor, Notes).",
                Model = "gpt-4.1",
                SystemPrompt = "You are a practice group assistant.",
                Temperature = 0.7m,
                MaxTokens = 1000,
                IsEnabled = true,
                CreatedAtUtc = DateTime.UtcNow
            },
            new Agent
            {
                AgentId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Support Bots",
                Description = "Customer service bots (Tech Support, Billing).",
                Model = "gpt-3.5-turbo",
                SystemPrompt = "You are a customer service assistant.",
                Temperature = 0.5m,
                MaxTokens = 500,
                IsEnabled = true,
                CreatedAtUtc = DateTime.UtcNow
            }
        };

        return Ok(agents);
    }
}
