using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Services;
using GovUk.Education.ExploreEducationStatistics.Common.Validators;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Validators.FileTypeValidationUtils;

namespace GovUk.Education.ExploreEducationStatistics.Common.Tests.Services
{
    class FileInfo
    {
        public readonly string Filename;
        
        // we have a possible list of matching mime types that we'd expect to see, that potentially change when run
        // on different operating systems, but are considered valid either way 
        public readonly string ExpectedMimeType;
        public readonly Encoding ExpectedEncoding;

        public FileInfo(
            string filename, 
            string expectedMimeType,
            Encoding expectedEncoding = null)
        {
            Filename = filename;
            ExpectedEncoding = expectedEncoding ?? Encoding.UTF8;
            ExpectedMimeType = expectedMimeType;
        }
    }
    
    public class FileTypeServiceTests
    {
        private static readonly FileInfo Doc = new FileInfo("test.doc", "application/msword");
        
        private static readonly FileInfo Docx = new FileInfo("test.docx", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        
        private static readonly FileInfo Ods = new FileInfo("test.ods", 
            "application/vnd.oasis.opendocument.spreadsheet");
        
        private static readonly FileInfo Odt = new FileInfo("test.odt", 
            "application/vnd.oasis.opendocument.text");
        
        private static readonly FileInfo Xls = new FileInfo("test.xls", "application/excel");
        private static readonly FileInfo Xlsx = new FileInfo("test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        private static readonly FileInfo Xlsx2 = new FileInfo("test2.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        private static readonly FileInfo Csv = new FileInfo("test.csv", "application/csv");
        private static readonly FileInfo Txt = new FileInfo("test.txt", "text/plain");
        private static readonly FileInfo Pdf = new FileInfo("test.pdf", "application/pdf");
        private static readonly FileInfo Bmp = new FileInfo("test.bmp", "image/bmp");
        private static readonly FileInfo Gif = new FileInfo("test.gif", "image/gif");
        private static readonly FileInfo Jpg = new FileInfo("test.jpg", "image/jpeg");
        private static readonly FileInfo Png = new FileInfo("test.png", "image/png");
        private static readonly FileInfo Zip = new FileInfo("test.zip", "application/x-compressed");
        
        private static readonly List<FileInfo> ImageTypes = new List<FileInfo>
        {
            Bmp,
            Gif,
            Jpg,
            Png
        };
        
        private static readonly List<FileInfo> CsvTypes = new List<FileInfo>
        {
            Csv,
            Txt,
        };
        
        private static readonly List<FileInfo> ArchiveTypes = new List<FileInfo>
        {
            Zip,
        };
        
        private static readonly List<FileInfo> AllTypes = new List<FileInfo>
        {
            Doc,
            Docx,
            Ods,
            Odt,
            Xls,
            Xlsx,
            Xlsx2,
            Csv,
            Txt,
            Pdf,
            Bmp,
            Gif,
            Jpg,
            Png,
            Zip
        };
        
        [Fact]
        public void GetMimeType_Doc()
        {
            AssertMimeTypeCorrect(Doc);
        }
        
        [Fact]
        public void GetMimeType_Docx()
        {
            AssertMimeTypeCorrect(Docx);
        }
        
        [Fact]
        public void GetMimeType_Ods()
        {
            AssertMimeTypeCorrect(Ods);
        }
        
        [Fact]
        public void GetMimeType_Odt()
        {
            AssertMimeTypeCorrect(Odt);
        }
        
        [Fact]
        public void GetMimeType_Xls()
        {
            AssertMimeTypeCorrect(Xls);
        }
        
        [Fact]
        public void GetMimeType_Xlsx()
        {
            AssertMimeTypeCorrect(Xlsx);
        }

        [Fact]
        public void GetMimeType_Xlsx2()
        {
            AssertMimeTypeCorrect(Xlsx2);
        }

        [Fact]
        public void GetMimeType_Csv()
        {
            AssertMimeTypeCorrect(Csv);
        }
        
        [Fact]
        public void GetMimeType_Pdf()
        {
            AssertMimeTypeCorrect(Pdf);
        }
        
        [Fact]
        public void GetMimeType_Bmp()
        {
            AssertMimeTypeCorrect(Bmp);
        }
        
        [Fact]
        public void GetMimeType_Jpg()
        {
            AssertMimeTypeCorrect(Jpg);
        }
        
        [Fact]
        public void GetMimeType_Gif()
        {
            AssertMimeTypeCorrect(Gif);
        }
        
        [Fact]
        public void GetMimeType_Png()
        {
            AssertMimeTypeCorrect(Png);
        }
        
        [Fact]
        public void GetMimeType_Txt()
        {
            AssertMimeTypeCorrect(Txt);
        }

        [Fact]
        public void GetEncoding_Doc()
        {
            AssertEncodingCorrect(Doc);
        }
        
        [Fact]
        public void GetEncoding_Docx()
        {
            AssertEncodingCorrect(Docx);
        }
        
        [Fact]
        public void GetEncoding_Ods()
        {
            AssertEncodingCorrect(Ods);
        }
        
        [Fact]
        public void GetEncoding_Odt()
        {
            AssertEncodingCorrect(Odt);
        }
        
        [Fact]
        public void GetEncoding_Xls()
        {
            AssertEncodingCorrect(Xls);
        }
        
        [Fact]
        public void GetEncoding_Xlsx()
        {
            AssertEncodingCorrect(Xlsx);
        }

        [Fact]
        public void GetEncoding_Xlsx2()
        {
            AssertEncodingCorrect(Xlsx2);
        }

        [Fact]
        public void GetEncoding_Csv()
        {
            AssertEncodingCorrect(Csv);
        }
        
        [Fact]
        public void GetEncoding_Pdf()
        {
            AssertEncodingCorrect(Pdf);
        }
        
        [Fact]
        public void GetEncoding_Bmp()
        {
            AssertEncodingCorrect(Bmp);
        }
        
        [Fact]
        public void GetEncoding_Jpg()
        {
            AssertEncodingCorrect(Jpg);
        }
        
        [Fact]
        public void GetEncoding_Gif()
        {
            AssertEncodingCorrect(Gif);
        }
        
        [Fact]
        public void GetEncoding_Png()
        {
            AssertEncodingCorrect(Png);
        }
        
        [Fact]
        public void GetEncoding_Txt()
        {
            AssertEncodingCorrect(Txt);
        }
        
        [Fact]
        public void GetEncoding_Ascii()
        {
            AssertEncodingCorrect(Txt);
        }

        
        [Fact]
        public void ValidChartFileUploads()
        {
            // test that all image files are valid for chart file uploads and not others
            AllTypes.ForEach(type =>
            {
                var expectedToSucceed = ImageTypes.Contains(type);
                AssertHasMatchingMimeType(type, FileTypeValidationUtils.AllowedChartFileTypes.ToList(), expectedToSucceed);
            });
        }
        
        [Fact]
        public void ValidAncillaryFileUploads()
        {
            // check that all types are valid for ancillary file uploads
            AllTypes.ForEach(type =>
            {
                AssertHasMatchingMimeType(type, AllowedAncillaryFileTypes.ToList(), true);
            });
        }
        
        [Fact]
        public void ValidCsvFileUploads()
        {
            // check that csv file types (either explicitly detected as application/csv / text/csv or indirectly as
            // text/plain) are valid for data and metadata file uploads
            AllTypes.ForEach(type =>
            {
                var expectedToSucceed = CsvTypes.Contains(type);
                AssertHasMatchingMimeType(type, AllowedCsvMimeTypes.ToList(), expectedToSucceed);
            });
        }
        
        [Fact]
        public void ValidArchiveFileUploads()
        {
            AllTypes.ForEach(type =>
            {
                var expectedToSucceed = ArchiveTypes.Contains(type);
                AssertHasMatchingMimeType(type, AllowedArchiveMimeTypes.ToList(), expectedToSucceed);
            });
        }
        
        private static void AssertMimeTypeCorrect(FileInfo fileInfo)
        {
            var service = new FileTypeService();

            var formFile = GetMockFormFile(fileInfo);

            var result = service.GetMimeType(formFile.Object).Result;
            
            Assert.True(fileInfo.ExpectedMimeType == result, 
                $"Detected Mime type {result ?? "null"} was not the expected Mime type of " +
                $"{fileInfo.ExpectedMimeType}");
        }

        private static void AssertEncodingCorrect(FileInfo fileInfo)
        {
            var service = new FileTypeService();

            var formFile = GetMockFormFile(fileInfo);
            
            var result = service.GetEncoding(formFile.Object).Result;
            
            Assert.True(fileInfo.ExpectedEncoding.Equals(result), 
                $"Detected Encoding {result} was not the expected Encoding of {fileInfo.ExpectedEncoding}");
        }

        private static Mock<IFormFile> GetMockFormFile(FileInfo fileInfo)
        {
            var filePath = GetResourcesFilePath(fileInfo);

            var formFile = new Mock<IFormFile>();
            
            formFile
                .Setup(f => f.OpenReadStream())
                .Returns(() => File.OpenRead(filePath));
            
            return formFile;
        }

        private static string GetResourcesFilePath(FileInfo fileInfo)
        {
            var filePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty,
                "Resources" + Path.DirectorySeparatorChar + fileInfo.Filename);
            return filePath;
        }

        private static void AssertHasMatchingMimeType(FileInfo fileInfo, List<Regex> availableMimeTypes, 
            bool expectedToSucceed)
        {
            var service = new FileTypeService();

            var filePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location),
                "Resources" + Path.DirectorySeparatorChar + fileInfo.Filename);
            
            var formFile = new Mock<IFormFile>();
            formFile
                .Setup(f => f.OpenReadStream())
                .Returns(() => File.OpenRead(filePath));
            
            var result = service.HasMatchingMimeType(formFile.Object, availableMimeTypes).Result;
            
            Assert.Equal(expectedToSucceed, result);
        }
    }
}