using System;
using System.IO;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;

public class FretboardService : IFretboardService
{
    private const string FILE = "../src/assets/fretboard-large.png";

    public byte[] GetFretboardImage(NoteEnum[] notes, NoteEnum? root, NoteEnum[] tuning, string value)
    {
        byte[] bytes = System.IO.File.ReadAllBytes(FILE);
        Image image = Image.Load(bytes);

        var stringTop1 = 92;
        var stringBottom1 = 286;
        var stringTop12 = 66;
        var stringBottom12 = 310;
        var frets = new int[] { 20, 142, 200, 190, 178, 170, 158, 152, 137, 134, 122, 120, 112 };

        NoteEnum GetNote(NoteEnum[] tuning, int fret, int str)
        {
            var note = tuning[5 - str] + fret;
            if ((int)note >= 12) note -= 12;
            return note;
        }

        string GetNoteInterval(NoteEnum root, NoteEnum note)
        {
            var intervals = new string[] { "R", "m2", "2", "m3", "3", "P4", "4#", "P5", "m6", "6", "m7", "7", "R" };
            var n = note - root;
            if (n < 0) n += 12;
            return intervals[n];
        };

        string GetNoteName(NoteEnum note)
        {
            var names = new string[] { "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A" };
            return names[(int)note];
        }

        void DrawNote(Image image, int fret, int str, bool isRoot, string text)
        {
            var fretPos = 0;
            for (var f = 0; f <= fret; fretPos += frets[f++]);

            var stringTop = stringTop1 - (stringTop1 - stringTop12) / 12 * fret;
            var stringBottom = stringBottom1 + (stringBottom12 - stringBottom1) / 12 * fret;
            var stringPos = stringTop + (stringBottom - stringTop) / 5 * str;

            var R = 18;

            var location = new PointF(fretPos, stringPos);
            var circle = new EllipsePolygon(location, R);
            var fillColor = isRoot ? Color.Red : Color.Black;
            var outlinePen = new SolidPen(Color.Black, 1);
            var fo = SystemFonts.Get("Tahoma");
            var font = new Font(fo, 19, FontStyle.Bold);
            var fontLocation = new PointF(fretPos, stringPos);

            var textOptions = new RichTextOptions(font)
            {
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                Origin = fontLocation
            };

            image.Mutate(x =>
                x.Fill(fillColor, circle)
                 .Draw(new DrawingOptions(), outlinePen, circle)
                 //.DrawText(textOptions, text, new SolidPen(Color.White, 1.5f)));
                 .DrawText(textOptions, text, Color.White));
        };

        if (notes.Length > 0)
        {
            root = root ?? notes[0];

            for (var fret = 0; fret < 13; fret++)
            {
                for (var str = 0; str < 6; str++)
                {
                    var note = GetNote(tuning, fret, str);
                    if (Array.IndexOf(notes, note) > -1)
                    {
                        var text = "";
                        if (value == "interval")
                        {
                            text = GetNoteInterval(root.Value, note);
                        }
                        else if (value == "note")
                        {
                            text = GetNoteName(note);
                        }
                        DrawNote(image, fret, str, root == note, text);
                    }
                }
            }
        }

        using (var ms = new MemoryStream())
        {
            image.Save(ms, new SixLabors.ImageSharp.Formats.Png.PngEncoder());
            return ms.ToArray();
        }
    }
}