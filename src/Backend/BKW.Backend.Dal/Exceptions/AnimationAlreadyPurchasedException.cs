using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Dal.Exceptions
{
    public class AnimationAlreadyPurchasedException : Exception
    {
        public AnimationAlreadyPurchasedException() : base("Animation already purchased") { }
    }
}
