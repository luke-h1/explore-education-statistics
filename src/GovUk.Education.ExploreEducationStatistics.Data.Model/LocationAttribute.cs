#nullable enable

using System;
using System.Collections.Generic;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;

namespace GovUk.Education.ExploreEducationStatistics.Data.Model;

public abstract record LocationAttribute(string? Code, string? Name)
{
    /// <summary>
    /// Produces a key string that represents this location attribute uniquely.
    /// </summary>
    /// <remarks>
    /// Used when adding Location cache entries to an in-memory cache while importing statistical data.
    ///
    /// </remarks>
    public virtual string GetCacheKey()
    {
        return $"{GetType().Name}:{GetCodeOrFallback()}:{Name ?? string.Empty}";
    }

    public virtual string GetCodeOrFallback()
    {
        return Code ?? string.Empty;
    }

    public GeographicLevel GeographicLevel => Enum.Parse<GeographicLevel>(GetType().Name);

    public abstract KeyValuePair<string, string>[] GetCsvValues();
}

public record Country(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("country_code", Code ?? string.Empty),
            new("country_name", Name ?? string.Empty),
        };
    }
}

public record EnglishDevolvedArea(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("english_devolved_area_code", Code ?? string.Empty),
            new("english_devolved_area_name", Name ?? string.Empty),
        };
    }
}

public record Institution(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("institution_id", Code ?? string.Empty),
            new("institution_name", Name ?? string.Empty),
        };
    }
}

public record LocalAuthority(string? Code, string? OldCode, string? Name) : LocationAttribute(Code, Name)
{
    public string? OldCode { get; } = OldCode;

    public override string GetCacheKey()
    {
        // Don't use GetCodeOrFallback here as the string needs to represent the local authority uniquely by all
        // attributes. Two local authorities with the same name and code but different old code are not identical.
        return $"{GetType().Name}:{Code ?? string.Empty}:{OldCode ?? string.Empty}:{Name ?? string.Empty}";
    }

    public override string GetCodeOrFallback()
    {
        return string.IsNullOrEmpty(Code) ? OldCode ?? string.Empty : Code;
    }

    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("new_la_code", Code ?? string.Empty),
            new("old_la_code", OldCode ?? string.Empty),
            new("la_name", Name ?? string.Empty),
        };
    }
}

public record LocalAuthorityDistrict(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("lad_code", Code ?? string.Empty),
            new("lad_name", Name ?? string.Empty),
        };
    }
}

public record LocalEnterprisePartnership(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("local_enterprise_partnership_code", Code ?? string.Empty),
            new("local_enterprise_partnership_name", Name ?? string.Empty),
        };
    }
}

public record Mat(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("trust_id", Code ?? string.Empty),
            new("trust_name", Name ?? string.Empty),
        };
    }
}

public record MayoralCombinedAuthority(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("mayoral_combined_authority_code", Code ?? string.Empty),
            new("mayoral_combined_authority_name", Name ?? string.Empty),
        };
    }
}

public record OpportunityArea(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("opportunity_area_code", Code ?? string.Empty),
            new("opportunity_area_name", Name ?? string.Empty),
        };
    }
}

public record ParliamentaryConstituency(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("pcon_code", Code ?? string.Empty),
            new("pcon_name", Name ?? string.Empty),
        };
    }
}

public record PlanningArea(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("planning_area_code", Code ?? string.Empty),
            new("planning_area_name", Name ?? string.Empty),
        };
    }
}

public record Provider(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("provider_ukprn", Code ?? string.Empty),
            new("provider_name", Name ?? string.Empty),
        };
    }
}

public record Region(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("region_code", Code ?? string.Empty),
            new("region_name", Name ?? string.Empty),
        };
    }
}

public record RscRegion(string? Code) : LocationAttribute(Code, Code)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("rsc_region_lead_name", Code ?? string.Empty),
        };
    }
}

public record School(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("school_urn", Code ?? string.Empty),
            new("school_name", Name ?? string.Empty),
        };
    }
}

public record Sponsor(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("sponsor_id", Code ?? string.Empty),
            new("sponsor_name", Name ?? string.Empty),
        };
    }
}

public record Ward(string? Code, string? Name) : LocationAttribute(Code, Name)
{
    public override KeyValuePair<string, string>[] GetCsvValues()
    {
        return new KeyValuePair<string, string>[]
        {
            new("ward_code", Code ?? string.Empty),
            new("ward_name", Name ?? string.Empty),
        };
    }
}
