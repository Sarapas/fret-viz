using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FretboardController : ControllerBase
    {
        private readonly ILogger<FretboardController> _logger;

        public FretboardController(ILogger<FretboardController> logger)
        {
            _logger = logger;
        }

        [HttpPost("Image")]
        public async Task<IActionResult> Image(FretboardRequest request)
        {
            Byte[] bytes = System.IO.File.ReadAllBytes("../src/assets/fretboard-large.png");
            String file = Convert.ToBase64String(bytes);
            return Content("data:image/png;base64, " + file);
        }

        public class FretboardRequest
        {
            public Note[] Notes { get; set; }
            public Note Root { get; set; }
            public Note[] Tuning { get; set; }
            public string Value { get; set; }
        }
    }
}
