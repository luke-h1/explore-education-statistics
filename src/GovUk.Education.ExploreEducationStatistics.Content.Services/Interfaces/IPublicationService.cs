#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;

public interface IPublicationService
{
    public Task<Either<ActionResult, PublicationCacheViewModel>> Get(string publicationSlug);

    Task<Either<ActionResult, List<PublicationService.FindStatsPublicationViewModel>>> GetPublications(
        ReleaseType? releaseType,
        string? searchTerm,
        int page,
        int pageSize,
        PublicationService.FindStatsSortBy sortBy,
        PublicationService.FindStatsSortOrder sortOrder);

    public Task UpdatePublicationIndex();
}
