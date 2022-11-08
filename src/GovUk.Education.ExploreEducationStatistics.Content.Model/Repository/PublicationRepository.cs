using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model.Repository;

public class PublicationRepository : IPublicationRepository
{
    private readonly ContentDbContext _contentDbContext;

    public PublicationRepository(ContentDbContext contentDbContext)
    {
        _contentDbContext = contentDbContext;
    }

    public async Task<bool> IsSuperseded(Guid publicationId)
    {
        // TODO EES-3707 could also try this
        // return await _contentDbContext
        //     .Publications
        //     .Include(p => p.SupersededBy)
        //     .AnyAsync(p => p.Id == publicationId && p.SupersededBy.LatestPublishedReleaseId.HasValue);

        // TODO EES-3707 or this!
        // return await _contentDbContext
        //     .Publications
        //     .Include(p => p.SupersededBy)
        //     .AnyAsync(p => p.Id == publicationId && p.SupersededBy.Published.HasValue);

        var publication = await _contentDbContext
            .Publications
            .SingleAsync(p => p.Id == publicationId);
        
        if (publication.SupersededById == null)
        {
            return false;
        }

        // To be superseded, superseding publication must have a published release
        return (await _contentDbContext.Publications.SingleAsync(p => p.Id == publication.SupersededById))
            .LatestPublishedReleaseId.HasValue;
    }
}
