using System;
using System.Collections.Generic;
using System.Text;

namespace BKW.Backend.Dal.Exceptions
{
    public class FileUploadException : Exception
    {
        public FileUploadException(string message) : base("Error occured during uploading file: " + message) { }
    }
}
