var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Serve default files before static files
var defaultFileOptions = new DefaultFilesOptions();
defaultFileOptions.DefaultFileNames.Clear();
defaultFileOptions.DefaultFileNames.Add("index.html");

// Use the configured default files options
app.UseDefaultFiles(defaultFileOptions);
app.UseStaticFiles(); // Order matters: UseStaticFiles must come after UseDefaultFiles.

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
