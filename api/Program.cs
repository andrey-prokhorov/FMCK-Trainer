using FMCK.Trainer.Api.Startup;

// await WebApplication
//     .CreateBuilder(args)
//     .ConfigureServices()
//     .ConfigurePipeline()
//     .RunAsync();

var builder = WebApplication.CreateBuilder(args);
builder.ConfigureServices();

var app = builder.Build();

await app.ConfigureApplication();
await app.RunAsync();



public abstract partial class Program;