﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces
{
    public interface IReleaseDataFileRepository
    {
        public Task<File> Create(
            Guid releaseId,
            Guid subjectId,
            string filename,
            FileType type,
            Guid createdById,
            string name = null,
            File replacingFile = null,
            File source = null);

        public Task<File> CreateZip(
            Guid releaseId,
            string filename,
            Guid createdById);

        public Task<IList<File>> ListDataFiles(Guid releaseId);

        public Task<bool> HasAnyDataFiles(Guid releaseId);

        public Task<IList<File>> ListReplacementDataFiles(Guid releaseId);

        public Task<ReleaseFile> GetBySubject(Guid releaseId, Guid subjectId);
    }
}