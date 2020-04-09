using System;
using System.Collections.Generic;
using AutoMapper;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserForDetailsDto : UserForListDto
    {
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }

        public ICollection<PhotoForDetailsDto> Photos { get; set; }
    }
}