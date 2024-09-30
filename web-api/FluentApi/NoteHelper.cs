namespace WebApi.FluentApi;

public static class NoteHelper
{
    public static NoteEnum GetNote(NoteEnum note, int distance)
    {
        return (NoteEnum)(((int)note + distance) % 12);
    }

    public static IntervalEnum GetInterval(int distance)
    {
        if (distance == 0)
            return IntervalEnum.Root;
        
        if (distance % 12 == 0)
            return IntervalEnum.Octave;
            
        return (IntervalEnum)(distance % 12);
    }
}
