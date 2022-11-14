#nullable enable
using System.ComponentModel.DataAnnotations;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model
{
    public class EmbedBlock
    {
        [Required]
        public string Title { get; set; }

        [Required]
        [Url]
        public string Url { get; set; }
    }
}
