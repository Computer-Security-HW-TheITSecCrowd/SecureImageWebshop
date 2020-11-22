using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Exceptions
{
    public class CommentNotFoundException : Exception
    {
        public CommentNotFoundException() : base("Comment not found") { }
    }
}
