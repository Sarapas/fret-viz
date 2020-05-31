using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;

public class FretboardService : IFretboardService
{
    private const string FILE = "../src/assets/fretboard-large.png";

    public byte[] GetFretboardImage(Note[] notes, Note? root, Note[] tuning, string value) 
    {
        byte[] bytes = System.IO.File.ReadAllBytes(FILE);
        Image image = Image.Load(bytes);

        EllipsePolygon circle = new EllipsePolygon(x: 100, y: 100, width: 30, height: 30);
        image.Mutate(x => x.Fill(Color.Red, circle));

        using (var ms = new MemoryStream())
        {
            image.Save(ms, new SixLabors.ImageSharp.Formats.Png.PngEncoder());
            return ms.ToArray();
        }
    }
}