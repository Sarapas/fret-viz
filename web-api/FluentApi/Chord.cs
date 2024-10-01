using System.Collections.Generic;

namespace WebApi.FluentApi;

public class Chord
{
    public Chord()
    {
        Notes = new List<NoteEnum>();
    }
    public List<NoteEnum> Notes { get; set; }
}
