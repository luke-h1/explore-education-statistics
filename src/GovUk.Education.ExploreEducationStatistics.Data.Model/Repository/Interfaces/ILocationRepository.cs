#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;

namespace GovUk.Education.ExploreEducationStatistics.Data.Model.Repository.Interfaces
{
    public interface ILocationRepository
    {
        Task<Dictionary<GeographicLevel, IEnumerable<ILocationAttribute>>> GetLocationAttributes(Guid subjectId);

        Task<Dictionary<GeographicLevel, IEnumerable<ILocationAttribute>>> GetLocationAttributes(
            IQueryable<Observation> observations);

        Task<Dictionary<GeographicLevel, List<LocationAttributeNode>>> GetLocationAttributesHierarchical(
            Guid subjectId,
            Dictionary<GeographicLevel, List<string>>? hierarchies);

        Task<Dictionary<GeographicLevel, List<LocationAttributeNode>>> GetLocationAttributesHierarchical(
            IQueryable<Observation> observations,
            Dictionary<GeographicLevel, List<string>>? hierarchies);

        IEnumerable<ILocationAttribute> GetLocationAttributes(
            GeographicLevel level,
            IEnumerable<string> codes);
    }
}
