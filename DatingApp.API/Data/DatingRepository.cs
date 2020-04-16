using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(u => u.Photos).AsQueryable();

            if (userParams.UserId.HasValue)
            {
                users = users.Where(x => x.Id != userParams.UserId);
            }

            if (!string.IsNullOrWhiteSpace(userParams.Gender))
            {
                users = users.Where(x => x.Gender == userParams.Gender);
            } 

            if (userParams.UserId.HasValue && userParams.Likers) 
            {
                var likerIds = await this.GetUserLikes(userParams.UserId.Value, true);
                users = users.Where(x => likerIds.Contains(x.Id));
            }

            if (userParams.Likees) 
            {
                var likeeIds = await this.GetUserLikes(userParams.UserId.Value, false);
                users = users.Where(x => likeeIds.Contains(x.Id));
            }

            if (userParams.MinAge.HasValue)
            {
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge.Value - 1);
                users = users.Where(x => x.DateOfBirth <= maxDob);
            }

            if (userParams.MaxAge.HasValue)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge.Value);
                users = users.Where(x => x.DateOfBirth >= minDob);
            }

            switch (userParams.OrderBy)
            {
                case "created":
                    users = users.OrderByDescending(x => x.Created);
                    break;
                case "lastActive":
                default:
                    users = users.OrderByDescending(x => x.LastActive);
                    break;
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            if (likers)
            {
                return await _context.Likes.Where(x => x.LikeeId == id).Select(x => x.LikerId).ToListAsync();
            }

            return await _context.Likes.Where(x => x.LikerId == id).Select(x => x.LikeeId).ToListAsync();
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.UserId == userId && p.IsMain);

            return photo;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == recipientId);
        }
    }
}