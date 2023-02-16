#nullable enable
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Api.Models;
using GovUk.Education.ExploreEducationStatistics.Data.Api.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Api.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.ExploreEducationStatistics.Data.Api.Services;

public class PermalinkCsvMetaService : IPermalinkCsvMetaService
{
    private readonly ContentDbContext _contentDbContext;
    private readonly IReleaseSubjectService _releaseSubjectService;
    private readonly IReleaseFileBlobService _releaseFileBlobService;

    public PermalinkCsvMetaService(
        ContentDbContext contentDbContext,
        IReleaseSubjectService releaseSubjectService,
        IReleaseFileBlobService releaseFileBlobService)
    {
        _contentDbContext = contentDbContext;
        _releaseSubjectService = releaseSubjectService;
        _releaseFileBlobService = releaseFileBlobService;
    }

    public async Task<Either<ActionResult, PermalinkCsvMetaViewModel>> GetPermalinkCsvMeta(
        LegacyPermalink permalink,
        CancellationToken cancellationToken = default)
    {
        return await _releaseSubjectService.CheckReleaseSubjectExists(permalink.Query.SubjectId)
            .OnSuccess(releaseSubject => GetCsvStream(releaseSubject, cancellationToken))
            .OnSuccess(
                () =>
                {

                    var filters = GetFilters(permalink.FullTable.SubjectMeta.Indicators);

                    return new PermalinkCsvMetaViewModel
                    {
                        Filters = filters
                    };
                }
            );
    }

    private async Task<Either<ActionResult, Stream>> GetCsvStream(
        ReleaseSubject releaseSubject,
        CancellationToken cancellationToken = default)
    {
        return await _contentDbContext.ReleaseFiles
            .Include(rf => rf.File)
            .SingleOrNotFoundAsync(
                predicate: rf =>
                    rf.File.SubjectId == releaseSubject.SubjectId
                    && rf.ReleaseId == releaseSubject.ReleaseId,
                cancellationToken: cancellationToken
            )
            .OnSuccess(
                releaseFile =>
                    _releaseFileBlobService.StreamBlob(releaseFile, cancellationToken: cancellationToken)
            );
    }


    private static Dictionary<Guid, Dictionary<string, string>> GetLocations(IEnumerable<Observation> observations)
    {
        return observations
            .Select(observation => observation.Location)
            .Distinct()
            .ToDictionary(
                location => location.Id,
                location => location.GetCsvValues()
            );
    }

    private static Dictionary<Guid, Dictionary<string, string>> GetLocations(
        Dictionary<string, List<LocationAttributeViewModel>> locationsHierarchy)
    {
        return locationsHierarchy.Aggregate(
            new Dictionary<Guid, Dictionary<string, string>>(),
            (acc, kv) =>
            {
                return kv.Value.SelectMany(
                    attribute =>
                    {
                        return new LocationAttributeViewModel
                        {
                            Id = attribute.Id,
                            Level = attribute.Level ?? Enum.Parse<GeographicLevel>(kv.Key, ignoreCase: true),
                            Value = attribute.Value,
                        };
                    }
                );
            }
        );
    }

    private static Location UpdateLocationAttributes(Location location, LocationAttributeViewModel attribute)
    {
        if (attribute.Id.HasValue)
        {
            location.Id = attribute.Id.Value;
        }

        if (attribute.Level is not null)
        {
        }

        if (attribute.Options is not null)
        {
            attribute.Options.ForEach(option => UpdateLocationAttributes(location, option));
        }
    }

    private static LocationAttribute ParseLocationAttributeLevel(LocationAttributeViewModel attribute)
    {
        return attribute.Level switch
        {
            GeographicLevel.Country =>
                new Country(attribute.Value, attribute.Label),
            GeographicLevel.EnglishDevolvedArea =>
                new EnglishDevolvedArea(attribute.Value, attribute.Label),
            GeographicLevel.LocalAuthority =>
                new LocalAuthority(attribute.Value, null, attribute.Label),
            GeographicLevel.LocalAuthorityDistrict =>
                new LocalAuthorityDistrict(attribute.Value, attribute.Label),
            GeographicLevel.LocalEnterprisePartnership =>
                new LocalEnterprisePartnership(attribute.Value, attribute.Label),
            GeographicLevel.Institution =>
                new Institution(attribute.Value, attribute.Label),
            GeographicLevel.MayoralCombinedAuthority =>
                new MayoralCombinedAuthority(attribute.Value, attribute.Label),
            GeographicLevel.MultiAcademyTrust =>
                new MultiAcademyTrust(attribute.Value, attribute.Label),
            GeographicLevel.OpportunityArea =>
                new OpportunityArea(attribute.Value, attribute.Label),
            GeographicLevel.ParliamentaryConstituency =>
                new ParliamentaryConstituency(attribute.Value, attribute.Label),
            GeographicLevel.PlanningArea =>
                new PlanningArea(attribute.Value, attribute.Label),
            GeographicLevel.Provider =>
                new Provider(attribute.Value, attribute.Label),
            GeographicLevel.Region =>
                new Region(attribute.Value, attribute.Label),
            GeographicLevel.RscRegion =>
                new RscRegion(attribute.Value),
            GeographicLevel.School =>
                new School(attribute.Value, attribute.Label),
            GeographicLevel.Sponsor =>
                new Sponsor(attribute.Value, attribute.Label),
            GeographicLevel.Ward =>
                new Ward(attribute.Value, attribute.Label),
            _ => throw new ArgumentOutOfRangeException()
        };
    }
}
