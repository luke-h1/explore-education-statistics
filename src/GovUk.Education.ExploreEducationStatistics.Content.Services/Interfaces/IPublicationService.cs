#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Lunr;
using Microsoft.AspNetCore.Mvc;
using static GovUk.Education.ExploreEducationStatistics.Content.Services.PublicationService;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;

public interface IPublicationService
{
    public Task<Either<ActionResult, PublicationCacheViewModel>> Get(string publicationSlug);

    Task<Either<ActionResult, List<FindStatsPublicationViewModel>>> GetPublications(
        ReleaseType? releaseType,
        string? searchTerm,
        int page,
        int pageSize,
        FindStatsSortBy sortBy,
        FindStatsSortOrder sortOrder);

    public Task<Index> UpdatePublicationIndex();
}
