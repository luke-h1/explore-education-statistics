#nullable enable
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Publisher.Model;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static GovUk.Education.ExploreEducationStatistics.Common.BlobContainers;
using static GovUk.Education.ExploreEducationStatistics.Publisher.Model.PublisherQueues;

namespace GovUk.Education.ExploreEducationStatistics.Publisher.Functions;

public class PermalinkMigrationFunction
{
    private readonly ContentDbContext _contentDbContext;
    private readonly BlobServiceClient _blobServiceClient;

    public PermalinkMigrationFunction(ContentDbContext contentDbContext,
        BlobServiceClient blobServiceClient)
    {
        _contentDbContext = contentDbContext;
        _blobServiceClient = blobServiceClient;
    }

    /// <summary>
    /// Azure Function which stores high level details about a Permalink in the database.
    /// </summary>
    /// <param name="message"></param>
    /// <param name="executionContext"></param>
    /// <param name="logger"></param>
    [FunctionName("PermalinkMigration")]
    public async Task PermalinkMigration(
        [QueueTrigger(PermalinkMigrationQueue)]
        PermalinkMigrationMessage message,
        ExecutionContext executionContext,
        ILogger logger)
    {
        logger.LogInformation("{functionName} triggered: {message}",
            executionContext.FunctionName,
            message);

        try
        {
            var permalink = await GetPermalinkFromStorage(message.PermalinkId);
            _contentDbContext.Permalinks.Add(permalink);
            await _contentDbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to migrate permalinks");
        }
    }

    private async Task<Permalink> GetPermalinkFromStorage(Guid permalinkId)
    {
        var blobContainer = _blobServiceClient.GetBlobContainerClient(Permalinks.Name);
        var blob = blobContainer.GetBlobClient(permalinkId.ToString());

        if (!await blob.ExistsAsync())
        {
            throw new InvalidOperationException($"Blob not found for Permalink {permalinkId}");
        }

        await using var stream = await blob.OpenReadAsync();
        using var streamReader = new StreamReader(stream);
        using var jsonReader = new JsonTextReader(streamReader);

        var jsonObject = await JToken.ReadFromAsync(jsonReader);

        var id = jsonObject.Value<Guid>("id");
        var created = jsonObject.Value<DateTime>("Created");
        // TODO
        var subjectId = Guid.NewGuid();

        // if (!id.HasValue)
        // {
        //     throw new InvalidOperationException("Permalink found with no id value");
        // }
        //
        // if (!created.HasValue)
        // {
        //     throw new InvalidOperationException($"Permalink {id} has no created value");
        // }

        return new Permalink
        {
            Id = id,
            ReleaseId = null,
            SubjectId = subjectId,
            Created = created
        };
    }
}
