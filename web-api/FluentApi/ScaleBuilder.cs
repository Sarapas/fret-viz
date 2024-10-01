using System.Linq;
using System;

namespace WebApi.FluentApi;

public class ScaleBuilder
{
    public Scale Build(NoteEnum root, int[] scalePattern)
    {
        if (!IsValidScalePattern(scalePattern))
            throw new Exception("Invalid scale pattern");

        var scale = new Scale();
        scale.Configure(root, scalePattern);
        return scale;
    }

    private bool IsValidScalePattern(int[] scalePattern)
    {
        return scalePattern.Sum(x => x) == 12;
    }
}
