using Microsoft.AspNetCore.Mvc;
using ChatbotAPI.Models;
using System.Collections.Generic;
using System;

namespace ChatbotAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ChatsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Conversation>> Get()
    {
        var ownerId1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var agentGroup1 = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var agentGroup2 = Guid.Parse("00000000-0000-0000-0000-000000000002");

        var chats = new List<Conversation>
        {
            new Conversation
            {
                ConversationId = Guid.Parse("22222222-2222-2222-2222-000000000001"),
                OwnerUserId = ownerId1,
                AgentId = agentGroup1,
                Title = "Alice",
                Status = "Online • Practicing JS",
                CreatedAtUtc = DateTime.UtcNow,
                Messages = new List<Message>
                {
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "Hey! Ready to practice some JS? 😊", CreatedAtUtc = DateTime.UtcNow.AddMinutes(-5) },
                    new Message { MessageId = Guid.NewGuid(), Role = "user", Content = "Yeah! I'm building a chat UI with HTML/CSS/JS.", CreatedAtUtc = DateTime.UtcNow.AddMinutes(-4) },
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "Nice. No backend needed — just mock the data.", CreatedAtUtc = DateTime.UtcNow.AddMinutes(-3) }
                }
            },
            new Conversation
            {
                ConversationId = Guid.Parse("22222222-2222-2222-2222-000000000002"),
                OwnerUserId = ownerId1,
                AgentId = agentGroup1,
                Title = "Mentor Bot",
                Status = "Last seen 2h ago",
                CreatedAtUtc = DateTime.UtcNow.AddHours(-2),
                Messages = new List<Message>
                {
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "Tip: Keep your JS simple first, then refactor.", CreatedAtUtc = DateTime.UtcNow.AddHours(-2) },
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "Try separating data (conversations) from DOM logic.", CreatedAtUtc = DateTime.UtcNow.AddHours(-1.9) }
                }
            },
            new Conversation
            {
                ConversationId = Guid.Parse("22222222-2222-2222-2222-000000000003"),
                OwnerUserId = ownerId1,
                AgentId = agentGroup1,
                Title = "Coding Notes",
                Status = "Pinned • Personal",
                CreatedAtUtc = DateTime.UtcNow.AddDays(-1),
                Messages = new List<Message>
                {
                    new Message { MessageId = Guid.NewGuid(), Role = "user", Content = "• TODO: add localStorage\n• TODO: basic search filter\n• TODO: message timestamps", CreatedAtUtc = DateTime.UtcNow.AddDays(-1) },
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "You can also log events to the console while testing.", CreatedAtUtc = DateTime.UtcNow.AddDays(-1).AddMinutes(1) }
                }
            },
            new Conversation
            {
                ConversationId = Guid.Parse("22222222-2222-2222-2222-000000000004"),
                OwnerUserId = ownerId1,
                AgentId = agentGroup2,
                Title = "Tech Support",
                Status = "Online",
                CreatedAtUtc = DateTime.UtcNow,
                Messages = new List<Message>
                {
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "How can I help you today?", CreatedAtUtc = DateTime.UtcNow }
                }
            },
            new Conversation
            {
                ConversationId = Guid.Parse("22222222-2222-2222-2222-000000000005"),
                OwnerUserId = ownerId1,
                AgentId = agentGroup2,
                Title = "Billing Dept",
                Status = "Away",
                CreatedAtUtc = DateTime.UtcNow.AddHours(-1),
                Messages = new List<Message>
                {
                    new Message { MessageId = Guid.NewGuid(), Role = "user", Content = "I have a question about my invoice.", CreatedAtUtc = DateTime.UtcNow.AddHours(-1) },
                    new Message { MessageId = Guid.NewGuid(), Role = "assistant", Content = "Sure, what's your account number?", CreatedAtUtc = DateTime.UtcNow.AddHours(-0.9) }
                }
            }
        };

        return Ok(chats);
    }
}
