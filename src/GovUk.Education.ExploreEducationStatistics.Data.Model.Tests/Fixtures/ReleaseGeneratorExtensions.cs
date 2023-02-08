#nullable enable
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Fixtures;

namespace GovUk.Education.ExploreEducationStatistics.Data.Model.Tests.Fixtures;

public static class ReleaseGeneratorExtensions
{
    public static Generator<Release> DefaultRelease(this DataFixture fixture)
        => fixture.Generator<Release>().WithDefaults();

    public static Generator<Release> WithDefaults(this Generator<Release> generator)
        => generator.ForInstance(s => s.SetDefaults());

    public static InstanceSetters<Release> SetDefaults(this InstanceSetters<Release> setters)
        => setters
            .SetDefault(r => r.Id)
            .SetDefault(r => r.Slug)
            .SetDefault(r => r.Title)
            .Set(r => r.TimeIdentifier, TimeIdentifier.AcademicYear)
            .Set(r => r.Year, f => f.Random.Int(2016, 2022));
}
