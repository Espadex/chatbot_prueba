using Microsoft.AspNetCore.Mvc;
using ChatbotAPI.Models;
using System.Collections.Generic;

namespace ChatbotAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ChatsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<ConversationDto>> Get()
    {
        var chats = new List<ConversationDto>
        {
            new ConversationDto
            {
                Id = "alice",
                Name = "Alice",
                Initials = "AL",
                Status = "Online • Practicing JS",
                LastSeen = "Now",
                Unread = 2,
                GroupId = "group1",
                Messages = new List<MessageDto>
                {
                    new MessageDto { From = "them", Text = "Hey! Ready to practice some JS? 😊", Time = "10:21" },
                    new MessageDto { From = "me", Text = "Yeah! I'm building a chat UI with HTML/CSS/JS.", Time = "10:22" },
                    new MessageDto { From = "them", Text = "Nice. No backend needed — just mock the data.", Time = "10:23" }
                }
            },
            new ConversationDto
            {
                Id = "mentor",
                Name = "Mentor Bot",
                Initials = "MB",
                Status = "Last seen 2h ago",
                LastSeen = "2h",
                Unread = 0,
                GroupId = "group1",
                Messages = new List<MessageDto>
                {
                    new MessageDto { From = "them", Text = "Tip: Keep your JS simple first, then refactor.", Time = "08:01" },
                    new MessageDto { From = "them", Text = "Try separating data (conversations) from DOM logic.", Time = "08:02" }
                }
            },
            new ConversationDto
            {
                Id = "notes",
                Name = "Coding Notes",
                Initials = "CN",
                Status = "Pinned • Personal",
                LastSeen = "Yesterday",
                Unread = 3,
                GroupId = "group1",
                Messages = new List<MessageDto>
                {
                    new MessageDto { From = "me", Text = "• TODO: add localStorage\n• TODO: basic search filter\n• TODO: message timestamps", Time = "21:11" },
                    new MessageDto { From = "them", Text = "You can also log events to the console while testing.", Time = "21:12" }
                }
            },
            new ConversationDto
            {
                Id = "support",
                Name = "Tech Support",
                Initials = "TS",
                Status = "Online",
                LastSeen = "Now",
                Unread = 1,
                GroupId = "group2",
                Messages = new List<MessageDto>
                {
                    new MessageDto { From = "them", Text = "How can I help you today?", Time = "09:00" }
                }
            },
            new ConversationDto
            {
                Id = "billing",
                Name = "Billing Dept",
                Initials = "BD",
                Status = "Away",
                LastSeen = "1h",
                Unread = 0,
                GroupId = "group2",
                Messages = new List<MessageDto>
                {
                    new MessageDto { From = "me", Text = "I have a question about my invoice.", Time = "14:20" },
                    new MessageDto { From = "them", Text = "Sure, what's your account number?", Time = "14:25" }
                }
            }
        };

        return Ok(chats);
    }
}
