using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services.ParserServices
{
    internal interface IBitmapConverter
    {
        Bitmap ConvertRgbToBitmap(int width, int height, (int r, int g, int b)[] data);
    }
}
