using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Exceptions
{
    public class AnimationAlreadyOwnedException : Exception
    {
        public AnimationAlreadyOwnedException() : base("Animation already owned") { }
    }
}
