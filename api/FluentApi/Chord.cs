using System.Collections.Generic;

public class Chord
{
    public Chord()
    {
        Notes = new List<NoteEnum>();
    }
    public List<NoteEnum> Notes { get; set; }
}