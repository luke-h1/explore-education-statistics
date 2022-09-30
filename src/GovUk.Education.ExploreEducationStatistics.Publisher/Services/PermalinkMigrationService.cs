﻿#nullable enable
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Publisher.Model;
using GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static GovUk.Education.ExploreEducationStatistics.Common.BlobContainers;
using static GovUk.Education.ExploreEducationStatistics.Publisher.Model.PublisherQueues;

namespace GovUk.Education.ExploreEducationStatistics.Publisher.Services;

public class PermalinkMigrationService : IPermalinkMigrationService
{
    private readonly ContentDbContext _contentDbContext;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IStorageQueueService _storageQueueService;

    public PermalinkMigrationService(ContentDbContext contentDbContext,
        BlobServiceClient blobServiceClient,
        IStorageQueueService storageQueueService)
    {
        _contentDbContext = contentDbContext;
        _blobServiceClient = blobServiceClient;
        _storageQueueService = storageQueueService;
    }

    public async Task EnumerateAllPermalinksForMigration()
    {
        string? continuationToken = null;

        var blobContainer = _blobServiceClient.GetBlobContainerClient(Permalinks.Name);

        do
        {
            var pages = blobContainer
                .GetBlobsAsync(BlobTraits.None, prefix: null)
                .AsPages(continuationToken);

            await foreach (var page in pages)
            {
                var messages = page.Values.Select(blobItem =>
                {
                    var name = blobItem.Name;
                    var permalinkId = Guid.Parse(name);
                    return new PermalinkMigrationMessage(permalinkId);
                }).ToList();

                await _storageQueueService.AddMessages(PermalinkMigrationQueue, messages);

                continuationToken = page.ContinuationToken;
            }
        } while (continuationToken != string.Empty);
    }

    public async Task<Permalink> AddPermalinkToDbFromStorage(Guid permalinkId)
    {
        var permalink = await GetPermalinkFromStorage(permalinkId);
        _contentDbContext.Permalinks.Add(permalink);
        await _contentDbContext.SaveChangesAsync();
        return permalink;
    }

    private async Task<Permalink> GetPermalinkFromStorage(Guid permalinkId)
    {
        var blobContainer = _blobServiceClient.GetBlobContainerClient(Permalinks.Name);
        var blob = blobContainer.GetBlobClient(permalinkId.ToString());

        if (!await blob.ExistsAsync())
        {
            throw new InvalidOperationException($"Blob not found for permalink {permalinkId}");
        }

        await using var stream = await blob.OpenReadAsync();
        using var streamReader = new StreamReader(stream);
        using var jsonReader = new JsonTextReader(streamReader);

        var jsonObject = await JToken.ReadFromAsync(jsonReader);

        var idAsString = jsonObject.Value<string>("Id");
        var created = jsonObject.Value<DateTime>("Created");
        var subjectIdAsString = jsonObject.SelectToken("$.Query.SubjectId")?.ToObject<string>();

        if (subjectIdAsString == null)
        {
            throw new InvalidOperationException("Permalink found with no subject id");
        }

        return new Permalink
        {
            Id = Guid.Parse(idAsString),
            ReleaseId = null,
            SubjectId = Guid.Parse(subjectIdAsString),
            Created = created
        };
    }
}
