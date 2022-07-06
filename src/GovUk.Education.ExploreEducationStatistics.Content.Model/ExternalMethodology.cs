#nullable enable
using System.ComponentModel.DataAnnotations;
using System;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model
{
    public class ExternalMethodology
    {
        [Key]
        public Guid PublicationId { get; set; }

        public Publication Publication { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [Url]
        public string Url { get; set; }
    }
}
