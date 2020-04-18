using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    [ServiceFilter(typeof(LogUserActivity))]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != this.GetCurrentUserId())
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
            {
                return NotFound();
            }

            if (userId != messageFromRepo.SenderId || userId != messageFromRepo.RecipientId)
            {
                return Unauthorized();
            }

            var messageForReturn = _mapper.Map<MessageForReturnDto>(messageFromRepo);

            return Ok(messageForReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            if (userId != this.GetCurrentUserId())
            {
                return Unauthorized();
            }

            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

            if (recipient == null)
            {
                return BadRequest($"Recipient {messageForCreationDto.RecipientId} not found");
            }

            await _repo.GetUser(userId); //Getting the sender user will allow AutoMapper to set the SenderKnownAs and SenderPhotoUrl on the message

            messageForCreationDto.SenderId = userId;

            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageForReturn = _mapper.Map<MessageForReturnDto>(message);

                return CreatedAtRoute("GetMessage", new { userId = userId, id = message.Id }, messageForReturn);
            }

            return BadRequest("Failed to create message");
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery]MessageParams messageParams)
        {
            var currentUserId = this.GetCurrentUserId();

            if (userId != currentUserId)
            {
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);

            Response.AddPaginationHeader(messagesFromRepo);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != this.GetCurrentUserId())
            {
                return Unauthorized();
            }

            var messagesFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messagesForReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);

            return Ok(messagesForReturn);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id)
        {
            if (userId != this.GetCurrentUserId())
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
            {
                return BadRequest($"Message {id} not found");
            }

            if (messageFromRepo.SenderId == userId)
            {
                messageFromRepo.SenderDeleted = true;
            }
            else if (messageFromRepo.RecipientId == userId)
            {
                messageFromRepo.RecipientDeleted = true;
            }

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
            {
                _repo.Delete(messageFromRepo);
            }

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Failed to delete message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if (userId != this.GetCurrentUserId())
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null) {
                return NotFound();
            }

            if (messageFromRepo.RecipientId != userId)
            {
                return Unauthorized();
            }

            messageFromRepo.DateRead = DateTime.Now;

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Message not marked as read");
        }
    }


}