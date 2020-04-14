using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto : UserBaseDto
    {
        public UserForRegisterDto()
        {
            this.Created = DateTime.Now;
            this.LastActive = DateTime.Now;
        }

        [Required]
        public new string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "{0} must be between {2} and {1} characters in length")]
        public new string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; private set; }
        public DateTime LastActive { get; set; }
    }
}