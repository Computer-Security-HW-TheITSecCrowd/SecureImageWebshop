using AnimationClient;
using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services.ParserServices
{
    internal class ParserService : IParserService
    {
        private readonly Parser.ParserClient parserClient;
        private readonly IBitmapConverter bitmapConverter;

        public ParserService(Parser.ParserClient parserClient, IBitmapConverter bitmapConverter)
        {
            this.parserClient = parserClient;
            this.bitmapConverter = bitmapConverter;
        }

        public async Task<bool> IsAnimationValid(IReadOnlyList<byte> content) => 
            (await parserClient.ValidateAsync(GenerateRawAnimation(content))).Value;

        public async Task<Animation> ParseAnimation(IReadOnlyList<byte> content)
        {
            try
            {
                var animation = await parserClient.ParseAsync(GenerateRawAnimation(content));
                return animation;
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.Cancelled)
            {
                return null;
            }
        }


        public Bitmap GetBitmapFromAnimation(AnimationClient.Image image)
        {
            var data = image.Content
                .Select(rgb => (Convert.ToInt32(rgb.R), Convert.ToInt32(rgb.G), Convert.ToInt32(rgb.B)))
                .ToArray();

            return bitmapConverter.ConvertRgbToBitmap(
                Convert.ToInt32(image.Width),
                Convert.ToInt32(image.Height),
                data);
        }

        private static RawAnimation GenerateRawAnimation(IReadOnlyList<byte> content)
        {
            var ints = content.Select(b => (uint)b).ToList();

            var rawAnimation = new RawAnimation();
            rawAnimation.Bytes.AddRange(ints);

            return rawAnimation;
        }
    }
}
