#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Services.CollectionUtils;

namespace GovUk.Education.ExploreEducationStatistics.Common.Tests.Extensions;

public static class QueryableExtensions
{
    public class FirstOrNotFound
    {
        [Fact]
        public async Task NotFound_Empty()
        {
            var result = await new List<string>()
                .AsQueryable()
                .FirstOrNotFound();

            result.AssertNotFound();
        }

        [Fact]
        public async Task NotFound_Predicate()
        {
            var result = await ListOf("me")
                .AsQueryable()
                .FirstOrNotFound(s => s == "you");

            result.AssertNotFound();
        }

        [Fact]
        public async Task Found_First()
        {
            var result = await ListOf("me", "me")
                .AsQueryable()
                .FirstOrNotFound();

            Assert.Equal("me", result.AssertRight());
        }

        [Fact]
        public async Task Found_Predicate()
        {
            var result = await ListOf("you", "me")
                .AsQueryable()
                .FirstOrNotFound(s => s == "me");

            Assert.Equal("me", result.AssertRight());
        }
    }

    public class SingleOrNotFound
    {
        [Fact]
        public async Task NotFound_Empty()
        {
            var result = await new List<string>()
                .AsQueryable()
                .SingleOrNotFound();

            result.AssertNotFound();
        }

        [Fact]
        public async Task NotFound_Predicate()
        {
            var result = await ListOf("me")
                .AsQueryable()
                .SingleOrNotFound(s => s == "you");

            result.AssertNotFound();
        }

        [Fact]
        public async Task Found_First()
        {
            var result = await ListOf("me")
                .AsQueryable()
                .SingleOrNotFound();

            Assert.Equal("me", result.AssertRight());
        }

        [Fact]
        public async Task Found_Multiple_Throws()
        {
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => ListOf("me", "me")
                    .AsQueryable()
                    .SingleOrNotFound()
            );
        }

        [Fact]
        public async Task Found_Predicate()
        {
            var result = await ListOf("me")
                .AsQueryable()
                .SingleOrNotFound(s => s == "me");

            Assert.Equal("me", result.AssertRight());
        }

        [Fact]
        public async Task Found_Predicate_Multiple_Throws()
        {
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => ListOf("me", "me")
                    .AsQueryable()
                    .SingleOrNotFound(s => s == "me")
            );
        }
    }
}
