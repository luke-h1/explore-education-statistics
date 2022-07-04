#nullable enable
using System;
using AutoMapper;
using Azure.Storage.Blobs;
using GovUk.Education.ExploreEducationStatistics.Common.Functions;
using GovUk.Education.ExploreEducationStatistics.Common.Services;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Repository;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Publisher;
using GovUk.Education.ExploreEducationStatistics.Publisher.Services;
using GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using static GovUk.Education.ExploreEducationStatistics.Common.Utils.StartupUtils;
using FileStorageService = GovUk.Education.ExploreEducationStatistics.Publisher.Services.FileStorageService;
using IFileStorageService =
    GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces.IFileStorageService;
using IMethodologyService =
    GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces.IMethodologyService;
using IPublicationService =
    GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces.IPublicationService;
using IReleaseService = GovUk.Education.ExploreEducationStatistics.Publisher.Services.Interfaces.IReleaseService;
using MethodologyService = GovUk.Education.ExploreEducationStatistics.Publisher.Services.MethodologyService;
using PublicationService = GovUk.Education.ExploreEducationStatistics.Publisher.Services.PublicationService;
using ReleaseService = GovUk.Education.ExploreEducationStatistics.Publisher.Services.ReleaseService;

[assembly: FunctionsStartup(typeof(Startup))]

namespace GovUk.Education.ExploreEducationStatistics.Publisher
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services
                .AddAutoMapper(typeof(Startup).Assembly)
                .AddMemoryCache()
                .AddDbContext<ContentDbContext>(options =>
                    options.UseSqlServer(ConnectionUtils.GetAzureSqlConnectionString("ContentDb")))
                .AddDbContext<StatisticsDbContext>(options =>
                    options.UseSqlServer(ConnectionUtils.GetAzureSqlConnectionString("StatisticsDb")))
                .AddDbContext<PublicStatisticsDbContext>(options =>
                    options.UseSqlServer(ConnectionUtils.GetAzureSqlConnectionString("PublicStatisticsDb")))
                .AddSingleton<IFileStorageService, FileStorageService>(provider =>
                    new FileStorageService(GetConfigurationValue<string>(provider, "PublisherStorage")))
                .AddScoped(provider => GetBlobCacheService(provider, "PublicStorage"))
                .AddScoped<IPublishingService, PublishingService>(provider =>
                    new PublishingService(
                        publicStorageConnectionString: GetConfigurationValue<string>(provider, "PublicStorage"),
                        privateBlobStorageService: GetBlobStorageService(provider, "CoreStorage"),
                        publicBlobStorageService: GetBlobStorageService(provider, "PublicStorage"),
                        publicBlobCacheService: GetBlobCacheService(provider, "PublicStorage"),
                        methodologyService: provider.GetRequiredService<IMethodologyService>(),
                        publicationService: provider.GetRequiredService<IPublicationService>(),
                        releaseService: provider.GetRequiredService<IReleaseService>(),
                        contentDbContext: provider.GetService<ContentDbContext>()!,
                        logger: provider.GetRequiredService<ILogger<PublishingService>>(),
                        releasePublishingStatusService: provider.GetRequiredService<IReleasePublishingStatusService>()))
                .AddScoped<IContentService, ContentService>(provider =>
                    new ContentService(
                        publicBlobStorageService: GetBlobStorageService(provider, "PublicStorage"),
                        privateBlobCacheService: GetBlobCacheService(provider, "CoreStorage"),
                        publicBlobCacheService: GetBlobCacheService(provider, "PublicStorage"),
                        fastTrackService: provider.GetService<IFastTrackService>(),
                        releaseService: provider.GetRequiredService<IReleaseService>(),
                        publicationService: provider.GetRequiredService<IPublicationService>()
                    ))
                .AddScoped<IReleaseService, ReleaseService>(provider =>
                    new ReleaseService(
                        contentDbContext: provider.GetService<ContentDbContext>()!,
                        publicStatisticsDbContext: provider.GetService<PublicStatisticsDbContext>()!,
                        privateBlobStorageService: GetBlobStorageService(provider, "CoreStorage"),
                        methodologyService: provider.GetService<IMethodologyService>()!,
                        logger: provider.GetRequiredService<ILogger<ReleaseService>>(),
                        mapper: provider.GetRequiredService<IMapper>()
                    ))
                .AddScoped<ITableStorageService, TableStorageService>(provider =>
                    new TableStorageService(GetConfigurationValue<string>(provider, "PublisherStorage"), 
                        GetConfigurationValue(provider, "StorageSupportsBatchDeletes", defaultValue: true)))
                .AddScoped<IPublicationService, PublicationService>()
                .AddScoped<IFastTrackService, FastTrackService>(provider =>
                    new FastTrackService(
                        contentDbContext: provider.GetService<ContentDbContext>(),
                        publicBlobStorageService: GetBlobStorageService(provider, "PublicStorage"),
                        tableStorageService: new TableStorageService(
                            GetConfigurationValue<string>(provider, "PublicStorage"),
                            GetConfigurationValue(provider, "StorageSupportsBatchDeletes", defaultValue: true))))
                .AddScoped<IMethodologyVersionRepository, MethodologyVersionRepository>()
                .AddScoped<IMethodologyRepository, MethodologyRepository>()
                .AddScoped<IMethodologyService, MethodologyService>()
                .AddScoped<INotificationsService, NotificationsService>(provider =>
                    new NotificationsService(
                        context: provider.GetService<ContentDbContext>()!,
                        storageQueueService: new StorageQueueService(GetConfigurationValue<string>(provider,
                            "NotificationStorage"))))
                .AddScoped<IQueueService, QueueService>(provider =>
                    new QueueService(
                        storageQueueService: new StorageQueueService(
                            storageConnectionString: GetConfigurationValue<string>(provider, "PublisherStorage")
                        ),
                        releasePublishingStatusService: provider.GetService<IReleasePublishingStatusService>(),
                        logger: provider.GetRequiredService<ILogger<QueueService>>()))
                .AddScoped<IReleasePublishingStatusService, ReleasePublishingStatusService>()
                .AddScoped<IValidationService, ValidationService>()
                .AddScoped<IReleaseSubjectRepository, ReleaseSubjectRepository>(provider =>
                    new ReleaseSubjectRepository(
                        statisticsDbContext: provider.GetService<PublicStatisticsDbContext>()!,
                        footnoteRepository: new FootnoteRepository(provider.GetService<PublicStatisticsDbContext>())
                    ))
                .AddScoped<IFilterRepository, FilterRepository>()
                .AddScoped<IFootnoteRepository, FootnoteRepository>()
                .AddScoped<IIndicatorRepository, IndicatorRepository>()
                .AddScoped<IPublishingCompletionService, PublishingCompletionService>();

            AddPersistenceHelper<ContentDbContext>(builder.Services);
            AddPersistenceHelper<StatisticsDbContext>(builder.Services);
            AddPersistenceHelper<PublicStatisticsDbContext>(builder.Services);
        }

        private static IBlobCacheService GetBlobCacheService(IServiceProvider provider, string connectionStringKey)
        {
            return new BlobCacheService(
                GetBlobStorageService(provider, connectionStringKey),
                provider.GetRequiredService<ILogger<BlobCacheService>>());
        }

        private static IBlobStorageService GetBlobStorageService(IServiceProvider provider, string connectionStringKey)
        {
            var connectionString = GetConfigurationValue<string>(provider, connectionStringKey);
            return new BlobStorageService(
                connectionString,
                new BlobServiceClient(connectionString),
                provider.GetRequiredService<ILogger<BlobStorageService>>());
        }

        private static TValue GetConfigurationValue<TValue>(
            IServiceProvider provider, 
            string key, 
            TValue? defaultValue = default)
        {
            var configuration = provider.GetService<IConfiguration>();
            var value = configuration.GetValue<TValue>(key);

            if (value == null && defaultValue == null)
            {
                throw new ArgumentException($"No Configuration item found for key \"{key}\"");
            }
            return (value ?? defaultValue)!;
        }
    }
}
