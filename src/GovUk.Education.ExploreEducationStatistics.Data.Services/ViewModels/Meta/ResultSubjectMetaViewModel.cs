#nullable enable
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta
{
    public record ResultSubjectMetaViewModel
    {
        public Dictionary<string, FilterMetaViewModel> Filters { get; init; } = new();

        public List<FootnoteViewModel> Footnotes { get; init; } = new();

        public List<IndicatorMetaViewModel> Indicators { get; init; } = new();

        public Dictionary<GeographicLevel, List<LocationAttributeViewModel>> Locations { get; set; } = new();

        public List<BoundaryLevelViewModel> BoundaryLevels { get; init; } = new();

        public string PublicationName { get; init; } = string.Empty;

        public string SubjectName { get; init; } = string.Empty;

        public List<TimePeriodMetaViewModel> TimePeriodRange { get; init; } = new();

        public bool GeoJsonAvailable { get; init; }
    }
}
