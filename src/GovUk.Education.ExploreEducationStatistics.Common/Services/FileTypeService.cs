#nullable enable
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using MimeDetective;
using MimeDetective.Definitions;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services
{
    public class FileTypeService : IFileTypeService
    {
        private readonly ContentInspector _contentInspector = new ContentInspectorBuilder
        {
            Parallel = true,
            Definitions = Default.All()
        }.Build();
        
        public async Task<string?> GetMimeType(IFormFile file)
        {
            await using var stream = file.OpenReadStream();
            return GetMimeType(stream);
        }

        public async Task<bool> HasMatchingMimeType(IFormFile file, IEnumerable<Regex> mimeTypes)
        { 
            var mimeType = await GetMimeType(file);
            return mimeType != null && mimeTypes.Any(pattern => pattern.Match(mimeType).Success);
        }

        public async Task<bool> HasMatchingEncodingType(IFormFile file, IEnumerable<string> encodingTypes)
        {
            var encoding = await GetEncoding(file);
            var encodingType = encoding.ToString();
            return encodingTypes.Any(pattern => pattern.Equals(encodingType));
        }

        private string? GetMimeType(Stream stream)
        {
            var results = _contentInspector.Inspect(stream);
            var resultsByMimeType = results.ByMimeType();
            return resultsByMimeType.FirstOrDefault()?.MimeType;
        }

        public async Task<string> GetEncoding(IFormFile formFile)
        {
            await using var stream = formFile.OpenReadStream();
            return DetectFileEncoding(stream);
        }

        /// <summary>
        /// From https://stackoverflow.com/questions/3825390/effective-way-to-find-any-files-encoding
        /// </summary>
        public async Task<Encoding> GetEncoding(Stream stream)
        {
            // Read the BOM
            var bom = new byte[4];
            await stream.ReadAsync(bom.AsMemory(0, 4));

            // Analyze the BOM
            if (bom[0] == 0x2b && bom[1] == 0x2f && bom[2] == 0x76) return Encoding.UTF7;
            if (bom[0] == 0xef && bom[1] == 0xbb && bom[2] == 0xbf) return Encoding.UTF8;
            if (bom[0] == 0xff && bom[1] == 0xfe && bom[2] == 0 && bom[3] == 0) return Encoding.UTF32; //UTF-32LE
            if (bom[0] == 0xff && bom[1] == 0xfe) return Encoding.Unicode; //UTF-16LE
            if (bom[0] == 0xfe && bom[1] == 0xff) return Encoding.BigEndianUnicode; //UTF-16BE
            if (bom[0] == 0 && bom[1] == 0 && bom[2] == 0xfe && bom[3] == 0xff)
                return new UTF32Encoding(true, true); //UTF-32BE

            // We actually have no idea what the encoding is if we reach this point, so
            // you may wish to return null instead of defaulting to ASCII
            return Encoding.ASCII;
        }
        
        // Using encoding from BOM or UTF8 if no BOM found,
// check if the file is valid, by reading all lines
// If decoding fails, use the local "ANSI" codepage

        public string DetectFileEncoding(Stream fileStream)
        {
            var Utf8EncodingVerifier = Encoding.GetEncoding("utf-8", new EncoderExceptionFallback(), new DecoderExceptionFallback());
            using (var reader = new StreamReader(fileStream, Utf8EncodingVerifier,
                       detectEncodingFromByteOrderMarks: true, leaveOpen: true, bufferSize: 1024))
            {
                string detectedEncoding;
                try
                {
                    while (!reader.EndOfStream)
                    {
                        var line = reader.ReadLine();
                    }
                    detectedEncoding = reader.CurrentEncoding.BodyName;
                }
                catch (Exception e)
                {
                    // Failed to decode the file using the BOM/UT8. 
                    // Assume it's local ANSI
                    detectedEncoding = "ISO-8859-1";
                }
                // Rewind the stream
                fileStream.Seek(0, SeekOrigin.Begin);
                return detectedEncoding;
            }
        }

        public bool HasMatchingMimeType(Stream stream, IEnumerable<Regex> mimeTypes)
        {
            var mimeType = GetMimeType(stream);
            return mimeType != null && mimeTypes.Any(pattern => pattern.Match(mimeType).Success);
        }

        public async Task<bool> HasMatchingEncodingType(Stream stream, IEnumerable<string> encodingTypes)
        {
            var encodingType =  DetectFileEncoding(stream);
            return encodingTypes.Any(pattern => pattern.Equals(encodingType.ToString()));
        }
    }
}