public static class ScaleGuide
{
    private static ScaleBuilder builder = new ScaleBuilder();

    public static Scale Major(NoteEnum root)
    {
        return builder.Build(root, ScalePatterns.Major);
    }
}