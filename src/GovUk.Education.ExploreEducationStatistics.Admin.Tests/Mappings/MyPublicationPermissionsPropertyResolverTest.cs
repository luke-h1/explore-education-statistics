using GovUk.Education.ExploreEducationStatistics.Admin.Mappings;
using GovUk.Education.ExploreEducationStatistics.Admin.Security;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces.Security;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using Moq;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils.MockUtils;
using static Moq.MockBehavior;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Tests.Mappings
{
    public class MyPublicationPermissionsPropertyResolverTest
    {
        [Fact]
        public void ResolvePermissions()
        {
            var publication = new Publication();
            
            var userService = new Mock<IUserService>(Strict);
            var resolver = new MyPublicationPermissionSetPropertyResolver(userService.Object);
            
            userService.Setup(s => s.MatchesPolicy(publication, SecurityPolicies.CanUpdateSpecificPublication)).ReturnsAsync(true);
            userService.Setup(s => s.MatchesPolicy(publication, SecurityPolicies.CanCreateReleaseForSpecificPublication)).ReturnsAsync(true);
            userService.Setup(s => s.MatchesPolicy(publication, SecurityPolicies.CanCreateMethodologyForSpecificPublication)).ReturnsAsync(false);
            userService.Setup(s => s.MatchesPolicy(publication, SecurityPolicies.CanManageExternalMethodologyForSpecificPublication)).ReturnsAsync(false);

            var permissionsSet = resolver.Resolve(publication, null, null, null);
            VerifyAllMocks(userService);
            
            Assert.True(permissionsSet.CanUpdatePublication);
            Assert.True(permissionsSet.CanCreateReleases);
            Assert.False(permissionsSet.CanCreateMethodologies);
            Assert.False(permissionsSet.CanManageExternalMethodology);
        }
    }
}