using api.Context;
using api.DTOs;
using api.Entities;
using api.Enums;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class UserService
    {
        private readonly IDbContextFactory<HrisContext> _contextFactory = default!;
        private readonly HttpContextService _httpService;
        public UserService(IDbContextFactory<HrisContext> contextFactory, IHttpContextAccessor accessor)
        {
            _contextFactory = contextFactory;
            _httpService = new HttpContextService(accessor);
        }
        public async Task<List<User>> Index()
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                return await context.Users.Include(i => i.Role).ToListAsync();
            }
        }

        public string GenerateAvatarLink(int avatarId)
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                var avatar = context.Medias.FindAsync(avatarId).Result;
                var avatarLink = $"{_httpService.getDomainURL()}/media/{avatar?.CollectionName}/{avatar?.FileName}";

                return avatarLink;
            }
        }

        public UserDTO? GetLoggedInUser()
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                var httpContext = _httpService.GetHttpContext();
                User? currentUser = httpContext != null ? (User?)httpContext.Items["User"] : null;

                return currentUser != null ? new UserDTO(currentUser, "") : null;
            }
        }

        public async Task<UserDTO?> GetUserByEmail(string email)
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                User? user = await context.Users
                    .Include(i => i.EmployeeSchedule)
                        .ThenInclude(i => i.WorkingDayTimes)
                    .Include(i => i.TimeEntries.OrderByDescending(o => o.CreatedAt))
                        .ThenInclude(i => i.TimeIn)
                    .Include(i => i.TimeEntries.OrderByDescending(o => o.CreatedAt))
                        .ThenInclude(i => i.TimeOut)
                    .Where(i => i.Email == email).FirstAsync();

                return user != null ? new UserDTO(user, "") : null;
            }
        }

        public async Task<List<User>> ESLUsers(int? exceptUserId)
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                return await context.Users
                    .Include(x => x.Role)
                    .Include(x => x.Position)
                    .Where(x => x.PositionId == PositionEnum.ESL_TEACHER && x.Id != exceptUserId)
                    .ToListAsync();
            }
        }
    }
}
