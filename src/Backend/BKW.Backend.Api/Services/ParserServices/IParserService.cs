using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services.ParserServices
{
    public interface IParserService
    {
        Task<bool> IsAnimationValid(IReadOnlyList<byte> content);
        Task<AnimationClient.Animation> ParseAnimation(IReadOnlyList<byte> content);
        Bitmap GetBitmapFromAnimation(AnimationClient.Image image);
    }
}
