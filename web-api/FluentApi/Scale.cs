using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.FluentApi;

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
    private List<NoteEnum> UniqueNotes
    {
        get
        {
            return Notes.ToArray()[0..^1].ToList();
        }
    }

    public List<Chord> GetChords(int noteCount)
    {
        var chords = new List<Chord>();
        foreach (var note in UniqueNotes)
        {
            var chord = new Chord();
            chord.Notes.Add(note);
            NoteEnum lastNote = note;
            for (var i = 1; i < noteCount; i++)
            {
                var n = GetNextChordNote(lastNote);
                chord.Notes.Add(n);
                lastNote = n;
            }
            chords.Add(chord);
        }
        return chords;
    }

    private NoteEnum GetNextChordNote(NoteEnum note)
    {
        var index = UniqueNotes.IndexOf(note);
        if (index < 0) {
            Console.WriteLine(note);
            throw new Exception("Note does not exist in the scale");
        }

        var i = (index + 2) % UniqueNotes.Count;
        return UniqueNotes[i];
    }
}
