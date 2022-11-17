#nullable enable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Chart;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data.Query;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using JsonKnownTypes;

namespace GovUk.Education.ExploreEducationStatistics.Admin.ViewModels
{
    [JsonKnownThisType(nameof(EmbedBlock))]
    public record EmbedBlockViewModel : IContentBlockViewModel
    {
        public Guid Id { get; init; }

        public List<CommentViewModel> Comments { get; init; } = new();

        public int Order { get; init; }

        public DateTimeOffset? Locked { get; init; }

        public DateTimeOffset? LockedUntil { get; init; }

        public UserDetailsViewModel? LockedBy { get; init; }
    }

    public record EmbedBlockCreateRequest
    {
        [Required] public string Title { get; init; } = string.Empty;

        [Required] public string Url { get; init; } = string.Empty;

        [Required] public Guid ContentSectionId { get; set; }
    }
}
