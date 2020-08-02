public interface IFretboardService
{
    byte[] GetFretboardImage(NoteEnum[] notes, NoteEnum? root, NoteEnum[] tuning, string value);
}