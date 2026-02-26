using Microsoft.AspNetCore.Mvc;
using ChatbotAPI.Models;
using System.Collections.Generic;

namespace ChatbotAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class AgentsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<AgentDto>> Get()
    {
        var agents = new List<AgentDto>
        {
            new AgentDto
            {
                Id = "chat-mockup",
                Name = "Practice Chats",
                Role = "practice.group",
                Description = "Your coding practice mockups (Alice, Mentor, Notes).",
                Status = "Unrestricted",
                CanEdit = true,
                Link = "/chat/group1"
            },
            new AgentDto
            {
                Id = "support-bots",
                Name = "Support Bots",
                Role = "service.group",
                Description = "Customer service bots (Tech Support, Billing).",
                Status = "Unrestricted",
                CanEdit = true,
                Link = "/chat/group2"
            }
        };

        return Ok(agents);
    }
}
