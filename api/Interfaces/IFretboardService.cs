public interface IFretboardService
{
    byte[] GetFretboardImage(Note[] notes, Note? root, Note[] tuning, string value);
}