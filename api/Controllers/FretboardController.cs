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
        private readonly IFretboardService _fretboardService;

        public FretboardController(ILogger<FretboardController> logger, IFretboardService fretboardService)
        {
            _logger = logger;
            _fretboardService = fretboardService;
        }

        [HttpPost("Image")]
        public async Task<IActionResult> Image(FretboardRequest request)
        {
            if (request.Notes == null)
                request.Notes = new Note[0];

            if (request.Tuning == null)
                request.Tuning = new Note[] { Note.E, Note.A, Note.D, Note.G, Note.B, Note.E };

            if (request.Value == null) {
                request.Value = "note";
            }

            // Console.WriteLine("Tuning: " + string.Join(' ', request.Tuning));
            // Console.WriteLine("Notes: " + string.Join(' ', request.Notes));
            // Console.WriteLine("Root: " + request.Root);
            // Console.WriteLine("Value: " + request.Value);

            var bytes = _fretboardService.GetFretboardImage(request.Notes, request.Root, request.Tuning, request.Value);
            String file = Convert.ToBase64String(bytes);
            return Content("data:image/png;base64, " + file);
        }

        public class FretboardRequest
        {
            public Note[] Notes { get; set; }
            public Note? Root { get; set; }
            public Note[] Tuning { get; set; }
            public string Value { get; set; }
        }
    }
}
