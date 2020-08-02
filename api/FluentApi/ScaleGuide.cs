public static class ScaleGuide
{
    public static Scale Amajor { get; set; }
    public static Scale Bmajor { get; set; }
    public static Scale Cmajor { get; set; }
    public static Scale Dmajor { get; set; }
    public static Scale Emajor { get; set; }
    public static Scale Fmajor { get; set; }
    public static Scale Gmajor { get; set; }

    static ScaleGuide()
    {
        var builder = new ScaleBuilder();
        Amajor = builder.Build(NoteEnum.A, ScalePatterns.Major);
        Bmajor = builder.Build(NoteEnum.B, ScalePatterns.Major);
        Cmajor = builder.Build(NoteEnum.C, ScalePatterns.Major);
        Dmajor = builder.Build(NoteEnum.D, ScalePatterns.Major);
        Emajor = builder.Build(NoteEnum.E, ScalePatterns.Major);
        Fmajor = builder.Build(NoteEnum.F, ScalePatterns.Major);
        Gmajor = builder.Build(NoteEnum.G, ScalePatterns.Major);
    }
}