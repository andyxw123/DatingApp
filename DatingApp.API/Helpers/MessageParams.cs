namespace DatingApp.API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public int UserId { get; set; }

        public string MessageContainer { get; set; }
    }


}