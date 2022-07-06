using System.ComponentModel.DataAnnotations;

namespace GovUk.Education.ExploreEducationStatistics.Admin.ViewModels;

public record ExternalMethodologyViewModel(string Title, string Url);

public record ExternalMethodologySaveViewModel
{
    [Required]
    public string Title { get; set; }

    [Required]
    [Url]
    public string Url { get; set; }
}
