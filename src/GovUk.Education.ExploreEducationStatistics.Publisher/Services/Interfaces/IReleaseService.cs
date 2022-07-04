#nullable enable
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Publisher.Model.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Publisher.Models;

namespace GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces
{
    public interface IReleaseService
    {
        Task<Release> Get(Guid id);

        Task<IEnumerable<Release>> List(IEnumerable<Guid> ids);

        Task<IEnumerable<Release>> GetAmendedReleases(IEnumerable<Guid> releaseIds);

        Task<List<File>> GetFiles(Guid releaseId, params FileType[] types);

        Task<CachedReleaseViewModel> GetLatestReleaseViewModel(Guid publicationId,
            IEnumerable<Guid> includedReleaseIds,
            PublishContext context);

        Task<CachedReleaseViewModel> GetReleaseViewModel(Guid id, PublishContext context);

        Task SetPublishedDates(Guid id, DateTime published);
    }
}
