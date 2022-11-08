#nullable enable
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces.Security;
using GovUk.Education.ExploreEducationStatistics.Common.Utils;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Security.Extensions;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services;

public class PublicationService : IPublicationService
{
    private readonly IPublicationRepository _publicationRepository;
    private readonly IUserService _userService;
    private readonly IPersistenceHelper<ContentDbContext> _contentPersistenceHelper;

    public PublicationService(
        IPublicationRepository publicationRepository,
        IUserService userService,
        IPersistenceHelper<ContentDbContext> contentPersistenceHelper)
    {
        _publicationRepository = publicationRepository;
        _userService = userService;
        _contentPersistenceHelper = contentPersistenceHelper;
    }

    public async Task<Either<ActionResult, PublicationCacheViewModel>> Get(string publicationSlug)
    {
        return await _contentPersistenceHelper
            .CheckEntityExists<Publication>(query => query
                .Include(p => p.Releases)
                .Include(p => p.Contact)
                .Include(p => p.LegacyReleases)
                .Include(p => p.Topic)
                .ThenInclude(topic => topic.Theme)
                .Where(p => p.Slug == publicationSlug))
            .OnSuccess(_userService.CheckCanViewPublication)
            .OnSuccess(async publication =>
            {
                var isSuperseded = await _publicationRepository.IsSuperseded(publication.Id);
                return BuildPublicationViewModel(publication, isSuperseded);
            });
    }

    private static PublicationCacheViewModel BuildPublicationViewModel(
        Publication publication,
        bool isSuperseded)
    {
        return new PublicationCacheViewModel
        {
            Id = publication.Id,
            Title = publication.Title,
            Slug = publication.Slug,
            LegacyReleases = publication.LegacyReleases
                .OrderByDescending(legacyRelease => legacyRelease.Order)
                .Select(legacyRelease => new LegacyReleaseViewModel(legacyRelease))
                .ToList(),
            Topic = new TopicViewModel(new ThemeViewModel(publication.Topic.Theme.Title)),
            Contact = new ContactViewModel(publication.Contact),
            ExternalMethodology = publication.ExternalMethodology != null
                ? new ExternalMethodologyViewModel(publication.ExternalMethodology)
                : null,
            LatestReleaseId = publication.LatestPublishedReleaseId!.Value,
            IsSuperseded = isSuperseded,
            Releases = ListPublishedReleases(publication)
        };
    }

    private static List<ReleaseTitleViewModel> ListPublishedReleases(Publication publication)
    {
        return publication.GetPublishedReleases()
            .OrderByDescending(release => release.Year)
            .ThenByDescending(release => release.TimePeriodCoverage)
            .Select(release => new ReleaseTitleViewModel
            {
                Id = release.Id,
                Slug = release.Slug,
                Title = release.Title
            })
            .ToList();
    }
}
