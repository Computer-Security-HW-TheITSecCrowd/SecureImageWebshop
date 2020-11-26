using System;
using System.Collections.Generic;
using System.Text;

namespace BKW.Backend.Dal.Exceptions
{
    public class FileDownloadException : Exception
    {
        public FileDownloadException(string message) : base("Error occured during downloading file: " + message) { }
    }
}
