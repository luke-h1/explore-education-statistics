#nullable enable
using System;
using System.Net.Mime;
using GovUk.Education.ExploreEducationStatistics.Common.Cache;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Content.Api.Controllers;

[Route("api")]
[Produces(MediaTypeNames.Application.Json)]
public class RedirectController : ControllerBase
{
    [MemoryCache(typeof(GetRedirectsCacheKey), durationInSeconds: 60)]
    [HttpGet("redirects")]
    public ActionResult<RedirectViewModel[]> List()
    {
        Console.WriteLine("Fetching redirects from db");
        
        return new RedirectViewModel[]
        {
            new (
                @"\/find-statistics\/pupil-absence-in-schools-in-england-old",
                "/find-statistics/pupil-absence-in-schools-in-england"),
            new (
                @"\/find-statistics\/pupil-absence-in-schools-in-england-old([\/#?])(.*)",
                "/find-statistics/pupil-absence-in-schools-in-england$1$2")
        };
    }
}

public record RedirectViewModel(string Source, string Destination);
    
public record GetRedirectsCacheKey : IMemoryCacheKey
{
    public string Key => "redirects";
}
