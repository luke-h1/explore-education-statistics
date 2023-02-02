#nullable enable
using System;

namespace GovUk.Education.ExploreEducationStatistics.Data.Model;
    
public class Release
{
    public Guid Id { get; set; }
    public Guid PublicationId { get; set; }

    public Release CreateReleaseAmendment(Guid contentAmendmentId) => new()
    {
        Id = contentAmendmentId,
        PublicationId = PublicationId
    };
}
