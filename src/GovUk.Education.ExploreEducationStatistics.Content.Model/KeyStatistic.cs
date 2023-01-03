#nullable enable
using System;
using AutoMapper;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using Newtonsoft.Json;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model
{
    public abstract class KeyStatistic : ICreatedUpdatedTimestamps<DateTime, DateTime?>
    {
        public Guid Id { get; set; }

        public Guid ReleaseId { get; set; }

        [JsonIgnore, IgnoreMap] public Release Release { get; set; } = null!;

        public string? Trend { get; set; } = string.Empty;

        public string? GuidanceTitle { get; set; } = string.Empty;

        public string? GuidanceText { get; set; } = string.Empty;

        public int Order { get; set; }

        public DateTime Created { get; set; }

        public DateTime? Updated { get; set; }
    }

    public class KeyStatisticDataBlock : KeyStatistic
    {
        public Guid DataBlockId { get; set; } // @MarkFix copy these rows in amendments and get new dataBlockId?

        [JsonIgnore, IgnoreMap] public DataBlock DataBlock { get; set; } = null!;

        // @MarkFix include data block name here?

        //public string DataBlockQuery { get; set; } // @MarkFix include this since Trend/etc. are duplicated in the ContentBlocks row too?
    }

    public class KeyStatisticText : KeyStatistic
    {
        public string Title { get; set; } = string.Empty;

        public string Statistic { get; set; } = string.Empty;
    }
}
