#nullable enable
using System;
using System.Threading.Tasks;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;

public interface IPublicationRepository
{
    Task<bool> IsSuperseded(Guid publicationId);
}
