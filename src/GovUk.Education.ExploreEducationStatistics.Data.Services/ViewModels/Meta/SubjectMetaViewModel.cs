#nullable enable
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta
{
    public record SubjectMetaViewModel
    {
        public Dictionary<string, FilterMetaViewModel> Filters { get; set; } = new();

        public Dictionary<string, IndicatorGroupMetaViewModel> Indicators { get; set; } = new();

        public Dictionary<GeographicLevel, LocationsMetaViewModel> Locations { get; set; } = new();

        public TimePeriodsMetaViewModel TimePeriod { get; set; } = new();
    }
}
