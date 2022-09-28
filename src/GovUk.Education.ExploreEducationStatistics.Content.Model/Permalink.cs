#nullable enable
using System;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model;

public class Permalink
{
    public Guid Id { get; init; }

    public Guid? ReleaseId { get; init; }

    public Guid SubjectId { get; init; }

    public DateTime Created { get; init; }
}
