using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Storage.Blob;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces
{
    public interface IFileTypeService
    {
        Task<string> GetMimeType(IFormFile file);

        Task<Encoding> GetEncoding(Stream stream);

        Task<bool> HasMatchingMimeType(IFormFile file, IEnumerable<Regex> mimeTypes);

        Task<bool> HasMatchingEncodingType(IFormFile file, IEnumerable<string> encodingTypes);

        bool HasMatchingMimeType(Stream stream, IEnumerable<Regex> mimeTypes);

        Task<bool> HasMatchingEncodingType(Stream stream, IEnumerable<string> encodingTypes);
    }
}