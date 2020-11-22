using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Exceptions
{
    public class AnimationNotFoundException : Exception
    {
        public AnimationNotFoundException() : base("Animation not found") { }
    }
}
