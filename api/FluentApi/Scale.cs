using System;
using System.Collections.Generic;

public class Scale
{
    public string Name { get; set; }

    public void Configure(NoteEnum root, int[] steps)
    {
        Intervals = new List<IntervalEnum>();
        Notes = new List<NoteEnum>();
        Notes.Add(root);
        Intervals.Add(IntervalEnum.Root);

        var distance = 0;
        for (var i = 0; i < steps.Length; i++)
        {
            distance += steps[i];
            var note = NoteHelper.GetNote(root, distance);
            var interval = NoteHelper.GetInterval(distance);
            Intervals.Add(interval);
            Notes.Add(note);
        }
    }

    public List<IntervalEnum> Intervals { private set; get; }
    public List<NoteEnum> Notes { private set; get; }
}