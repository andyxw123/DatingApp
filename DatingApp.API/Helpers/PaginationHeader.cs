namespace DatingApp.API.Helpers
{
    public class PaginationHeader : IPaginationInfo
    {
        public PaginationHeader(IPaginationInfo paginationInfo)
            : this(paginationInfo.CurrentPage, paginationInfo.ItemsPerPage, paginationInfo.TotalItems, paginationInfo.TotalPages)
        {

        }

        public PaginationHeader(int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPage = itemsPerPage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

        public int CurrentPage { get; set;}
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}