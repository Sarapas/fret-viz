using Xunit;
using System;

public class FluentApiTests
{
    [Fact]
    public void BMajorScale_ShouldContain_CorrectIntervals()
    {
        var intervals = ScaleGuide.Bmajor.Intervals;

        foreach (var interval in intervals) {
            Console.WriteLine(interval);
        }

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
        var notes = ScaleGuide.Gmajor.Notes;
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
}