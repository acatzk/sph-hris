using api.Context;
using api.DTOs;
using api.Entities;
using api.Enums;
using api.Requests;
using api.Utils;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ESLOffsetService
    {
        private readonly IDbContextFactory<HrisContext> _contextFactory = default!;
        private readonly ITopicEventSender _eventSender;
        private readonly CustomInputValidation _customInputValidation;

        public ESLOffsetService(IDbContextFactory<HrisContext> contextFactory, ITopicEventSender eventSender)
        {
            _contextFactory = contextFactory;
            _eventSender = eventSender;
            _customInputValidation = new CustomInputValidation(_contextFactory);
        }

        public async Task<ESLOffset> Create(CreateESLOffsetRequest request, HrisContext context)
        {
            // validate inputs
            var errors = _customInputValidation.checkESLOffsetRequestInput(request);

            if (errors.Count > 0) throw new GraphQLException(errors);

            //  Create ESLChangeShiftRequest
            var eslOffset = new ESLOffset
            {
                UserId = request.UserId,
                TeamLeaderId = request.TeamLeaderId,
                TimeEntryId = request.TimeEntryId,
                TimeIn = TimeSpan.ParseExact(request.TimeIn, "hh':'mm", null),
                TimeOut = TimeSpan.ParseExact(request.TimeOut, "hh':'mm", null),
                Description = request.Description,
                Title = request.Title
            };

            context.ESLOffsets.Add(eslOffset);
            await context.SaveChangesAsync();
            return eslOffset;
        }

        public async Task<List<ESLOffsetDTO>> GetTimeEntryOffsets(int timeEntryId, bool onlyUnused)
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                var eslOffsets = await context.ESLOffsets
                    .Include(x => x.TeamLeader)
                    .Include(x => x.User)
                    .Where(x => x.TimeEntryId == timeEntryId && (onlyUnused ? x.IsUsed == false && x.IsLeaderApproved == true : true))
                    .OrderByDescending(x => x.CreatedAt)
                    .Select(x => new ESLOffsetDTO(x))
                    .ToListAsync();

                return eslOffsets;
            }
        }

        public async Task<List<ESLOffsetDTO>> GetAllESLOffsets(bool? isUsed)
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                var eslOffsets = await context.ESLOffsets
                    .Include(x => x.TeamLeader)
                    .Include(x => x.User)
                    .Where(x => isUsed != null ? x.IsUsed == isUsed : true)
                    .Select(x => new ESLOffsetDTO(x))
                    .ToListAsync();

                return eslOffsets;
            }
        }
        public async Task<List<ESLOffsetDTO>> GetAllFiledOffsets()
        {
            using (HrisContext context = _contextFactory.CreateDbContext())
            {
                var filedOffsets = await context.ESLOffsets
                    .Include(x => x.TeamLeader)
                    .Include(x => x.User)
                    .OrderByDescending(x => x.CreatedAt)
                    .Select(x => new ESLOffsetDTO(x))
                    .ToListAsync();

                return filedOffsets;
            }
        }
        public string GetRequestStatus(ESLOffset request)
        {
            if (request.IsLeaderApproved == true) return RequestStatus.APPROVED;
            if (request.IsLeaderApproved == false) return RequestStatus.DISAPPROVED;
            return RequestStatus.PENDING;
        }
    }
}
