namespace DatingApp.API.Helpers
{
    public interface IPaginationInfo
    {
        int CurrentPage { get; set; }
        int ItemsPerPage { get; set; }
        int TotalItems { get; set; }
        int TotalPages { get; set; }
    }
}