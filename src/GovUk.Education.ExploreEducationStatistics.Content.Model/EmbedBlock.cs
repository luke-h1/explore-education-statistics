#nullable enable
using System;
using System.ComponentModel.DataAnnotations;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model
{
    public class EmbedBlock
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [Url]
        public string Url { get; set; }
    }
}
