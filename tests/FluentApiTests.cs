using Xunit;
using System;

public class FluentApiTests
{
    [Fact]
    public void BMajorScale_ShouldContain_CorrectIntervals()
    {
        var intervals = ScaleGuide.Major(NoteEnum.B).Intervals;
        Assert.Equal(8, intervals.Count);
        Assert.Equal(IntervalEnum.Root, intervals[0]);
        Assert.Equal(IntervalEnum.MajorSecond, intervals[1]);
        Assert.Equal(IntervalEnum.MajorThird, intervals[2]);
        Assert.Equal(IntervalEnum.PerfectFourth, intervals[3]);
        Assert.Equal(IntervalEnum.PerfectFifth, intervals[4]);
        Assert.Equal(IntervalEnum.MajorSixth, intervals[5]);
        Assert.Equal(IntervalEnum.MajorSeventh, intervals[6]);
        Assert.Equal(IntervalEnum.Octave, intervals[7]);
    }

    [Fact]
    public void GMajorScale_ShouldContain_CorrectNotes()
    {
        var notes = ScaleGuide.Major(NoteEnum.G).Notes;
        Assert.Equal(8, notes.Count);
        Assert.Equal(NoteEnum.G, notes[0]);
        Assert.Equal(NoteEnum.A, notes[1]);
        Assert.Equal(NoteEnum.B, notes[2]);
        Assert.Equal(NoteEnum.C, notes[3]);
        Assert.Equal(NoteEnum.D, notes[4]);
        Assert.Equal(NoteEnum.E, notes[5]);
        Assert.Equal(NoteEnum.Gb, notes[6]);
        Assert.Equal(NoteEnum.G, notes[7]);
    }

    [Fact]
    public void CMajorScale_ShouldContain_AminorTriad()
    {
        var chords = ScaleGuide.Major(NoteEnum.C).GetChords(3);
        Assert.Equal(7, chords.Count);
        var am = chords[5];
        Assert.Equal(am.Notes[0], NoteEnum.A);
        Assert.Equal(am.Notes[1], NoteEnum.C);
        Assert.Equal(am.Notes[2], NoteEnum.E);
    }
}