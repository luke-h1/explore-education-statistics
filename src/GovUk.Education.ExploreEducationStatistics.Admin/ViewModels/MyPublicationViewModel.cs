using System;
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Content.Model;

namespace GovUk.Education.ExploreEducationStatistics.Admin.ViewModels
{
    // @MarkFix Remove this
    public class MyPublicationViewModel
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Summary { get; set; }

        public DateTime? NextUpdate { get; set; }

        public List<ReleaseViewModel> Releases { get; set; }

        public List<MethodologyVersionSummaryViewModel> Methodologies { get; set; }

        public ExternalMethodology ExternalMethodology { get; set; }

        public Guid TopicId { get; set; }

        public Guid ThemeId { get; set; }

        public Contact Contact { get; set; }

        public Guid? SupersededById { get; set; }

        public bool IsSuperseded { get; set; }

        public PermissionsSet Permissions { get; set; }

        public record PermissionsSet
        {
            public bool CanUpdatePublication { get; set; }
            public bool CanUpdatePublicationTitle { get; set; }
            public bool CanUpdatePublicationSupersededBy { get; set; }
            public bool CanCreateReleases { get; set; }
            public bool CanAdoptMethodologies { get; set; }
            public bool CanCreateMethodologies { get; set; }
            public bool CanManageExternalMethodology { get; set; }
        }
    }
}
