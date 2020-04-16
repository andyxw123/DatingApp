namespace DatingApp.API.Helpers
{
    public class UserParams : PaginationParams
    {
        public int? UserId { get; set; }
        public string Gender { get; set; }

        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }

        public string OrderBy { get; set; }

        public bool Likees { get; set; }
        public bool Likers { get; set; }
    }
}