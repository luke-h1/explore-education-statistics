#nullable enable

using System;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model
{
    public class ReleaseStatus
    {
        public Guid Id { get; set; }

        public Guid ReleaseId { get; set; }

        public Release Release { get; set; }

        public string InternalReleaseNote { get; set; }

        public bool EmailSubscribers { get; set; }

        public ReleaseApprovalStatus ApprovalStatus { get; set; }

        public DateTime? Created { get; set; }

        public Guid? CreatedById { get; set; }

        public User? CreatedBy { get; set; }
    }
}
