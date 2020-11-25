using BKW.Backend.Api.Services.ParserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Controllers
{
    public class FileModel
    {
        public string FileName { get; set; }
        public IFormFile FormFile { get; set; }
    }

    // ToDo it is for testing
    [Route("api/animation-upload")]
    [ApiController]
    public class AnimationUploadController : ControllerBase
    {
        private readonly IParserService parserService;

        public AnimationUploadController(IParserService parserService)
        {
            this.parserService = parserService;
        }        

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Upload([FromForm(Name = "file")] IFormFile formFile)
        {
            byte[] bytes;
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                var anim = await parserService.ParseAnimation(memoryStream.ToArray());
                var image = parserService.GetBitmapFromAnimation(anim.Images.First());
                var imageMs = new MemoryStream();
                imageMs.Position = 0;
                // ToDo gives back black background
                image.Save(imageMs, ImageFormat.Png);
                imageMs.Seek(0, SeekOrigin.Begin);
                imageMs.Position = 0;
                bytes = imageMs.ToArray();
            }
            return File(bytes, "image/png");
        }
    }
}
