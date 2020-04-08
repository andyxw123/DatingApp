using System;
using System.Collections.Generic;
using AutoMapper;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserForListDto : UserBaseDto
    {
        public static UserForListDto Map(IMapper mapper, User user)
        {
            return mapper.Map<UserForListDto>(user);
        }

        public static IEnumerable<UserForListDto> Map(IMapper mapper, IEnumerable<User> users)
        {
            return mapper.Map<IEnumerable<UserForListDto>>(users);
        }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
    }
}