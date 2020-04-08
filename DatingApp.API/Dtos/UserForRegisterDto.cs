using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto : UserBaseDto
    {
        [Required]
        public new string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "{0} must be between {2} and {1} characters in length")]
        public new string Password { get; set; }
    }
}