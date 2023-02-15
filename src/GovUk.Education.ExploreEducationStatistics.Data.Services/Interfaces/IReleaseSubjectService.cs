#nullable enable
using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.Interfaces;

public interface IReleaseSubjectService
{
    Task<Either<ActionResult, ReleaseSubject>> CheckReleaseSubjectExists(Guid subjectId);

    Task<Either<ActionResult, ReleaseSubject>> CheckReleaseSubjectExists(Guid subjectId, Guid? releaseId);

    Task<ReleaseSubject?> GetReleaseSubjectForLatestPublishedVersion(Guid subjectId);
}
