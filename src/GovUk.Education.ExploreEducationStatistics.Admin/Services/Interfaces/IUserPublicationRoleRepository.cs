﻿using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Content.Model;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces
{
    public interface IUserPublicationRoleRepository
    {
        public Task<UserPublicationRole> Create(Guid userId,
            Guid publicationId,
            PublicationRole role,
            Guid createdById);

        public Task<UserPublicationRole> GetByUserAndRole(Guid userId,
            Guid publicationId,
            PublicationRole role);
    }
}