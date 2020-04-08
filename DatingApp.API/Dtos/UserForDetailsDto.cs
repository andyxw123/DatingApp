using System;
using System.Collections.Generic;
using AutoMapper;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserForDetailsDto : UserForListDto
    {
        public new static UserForDetailsDto Map(IMapper mapper, User user)
        {
            return mapper.Map<UserForDetailsDto>(user);
        }

        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }

        public ICollection<PhotoForDetailsDto> Photos { get; set; }
    }
}