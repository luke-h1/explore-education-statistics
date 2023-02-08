#nullable enable
using System;
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Data.Model;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;

public record FilterCsvMetaViewModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public IReadOnlyDictionary<Guid, FilterItemCsvMetaViewModel> Items { get; init; } =
        new Dictionary<Guid, FilterItemCsvMetaViewModel>();

    public FilterCsvMetaViewModel()
    {
    }

    public FilterCsvMetaViewModel(Filter filter)
    {
        Id = filter.Id;
        Name = filter.Name;
    }
}

public record FilterItemCsvMetaViewModel
{
    public Guid Id { get; init; }

    public string Label { get; init; } = string.Empty;

    public FilterItemCsvMetaViewModel()
    {
    }

    public FilterItemCsvMetaViewModel(FilterItem filter)
    {
        Id = filter.Id;
        Label = filter.Label;
    }
}
