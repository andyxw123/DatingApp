using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helpers
{
    public class PagedList<T> : List<T>, IPaginationInfo
        where T : class
    {
        public PagedList(List<T> items, int totalItems, int currentPage, int itemsPerPage)
        {
            TotalItems = totalItems;
            ItemsPerPage = itemsPerPage;
            CurrentPage = currentPage;
            TotalPages = (int)Math.Ceiling(totalItems/ (double)itemsPerPage);
            this.AddRange(items);
        }

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int ItemsPerPage { get; set; }

        public int TotalItems { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize) 
        {
            var totalCount = await source.CountAsync();

            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, totalCount, pageNumber, pageSize);
        }
    }
}