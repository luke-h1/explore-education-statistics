using System;
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels
{
    public record ObservationViewModel
    {
        public List<Guid> Filters { get; set; }

        [JsonConverter(typeof(StringEnumConverter), typeof(CamelCaseNamingStrategy))]
        public GeographicLevel GeographicLevel { get; set; }

        public LocationViewModel Location { get; set; }

        public Dictionary<Guid, string> Measures { get; set; }

        public string TimePeriod { get; set; }
    }
}
