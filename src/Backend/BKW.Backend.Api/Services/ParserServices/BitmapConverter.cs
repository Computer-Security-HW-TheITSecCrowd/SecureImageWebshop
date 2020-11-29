using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services.ParserServices
{
    internal class BitmapConverter : IBitmapConverter
    {
        // If it throws exception run in Release mode
        public Bitmap ConvertRgbToBitmap(int w, int h, (int r, int g, int b)[] data)
        {
            Bitmap pic = new Bitmap(w, h);

            for (int x = 0; x < w; x++)
            {
                for (int y = 0; y < h; y++)
                {
                    int arrayIndex = y * w + x;
                    Color c = Color.FromArgb(
                       alpha: 255,
                       red: data[arrayIndex].r,
                       green: data[arrayIndex].g,
                       blue: data[arrayIndex].b
                    );
                    pic.SetPixel(x, y, c);
                }
            }

            return pic;
        }
    }
}
