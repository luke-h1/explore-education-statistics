using System;
using System.Linq;
using GovUk.Education.ExploreEducationStatistics.Admin.Areas.Identity.Data;
using GovUk.Education.ExploreEducationStatistics.Admin.Areas.Identity.Data.Models;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GovUk.Education.ExploreEducationStatistics.Admin
{
    public class BootstrapUsersService
    {
        private readonly IConfiguration _configuration;
        private readonly UsersAndRolesDbContext _usersAndRolesDbContext;
        private readonly UsersAndRolesDbContext _contentDbContext;

        public BootstrapUsersService(
            IConfiguration configuration,
            UsersAndRolesDbContext usersAndRolesDbContext, 
            UsersAndRolesDbContext contentDbContext)
        {
            _configuration = configuration;
            _usersAndRolesDbContext = usersAndRolesDbContext;
            _contentDbContext = contentDbContext;
        }

        /**
         * Add any bootstrapping BAU users that we have specified on startup. 
         */
        public void AddBootstrapUsers()
        {
            var bauBootstrapUserEmailAddresses = _configuration
                .GetSection("BootstrapUsers")?
                .GetValue<string>("BAU")?
                .Split(',');

            if (bauBootstrapUserEmailAddresses.IsNullOrEmpty())
            {
                return;
            }

            var bauRole = _usersAndRolesDbContext.Roles.First(r => r.Name.Equals("BAU User"));

            var existingEmailInvites = _usersAndRolesDbContext
                .UserInvites
                .Select(i => i.Email.ToLower())
                .ToList();

            var existingUserEmails = _contentDbContext
                .Users
                .Select(u => u.Email.ToLower())
                .ToList();

            var newInvitesToCreate = bauBootstrapUserEmailAddresses
                .Where(email =>
                    !existingEmailInvites.Contains(email.ToLower()) &&
                    !existingUserEmails.Contains(email.ToLower()))
                .Select(email =>
                    new UserInvite
                    {
                        Email = email,
                        Role = bauRole,
                        Accepted = false,
                        Created = DateTime.UtcNow,
                    });

            if (newInvitesToCreate.IsNullOrEmpty())
            {
                return;
            }

            _usersAndRolesDbContext.UserInvites.AddRange(newInvitesToCreate);
            _usersAndRolesDbContext.SaveChanges();
        }
    }
}