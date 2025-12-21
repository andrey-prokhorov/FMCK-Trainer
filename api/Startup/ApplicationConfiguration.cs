using FMCK_Trainer_Api.Startup;
using FMCK.Trainer.Api.Data.Seed;
using FMCK.Trainer.Api.Endpoints.Positions;

namespace FMCK.Trainer.Api.Startup;

public static class ApplicationConfiguration
{
    public static async Task ConfigureApplication(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseCors("AllowLocalhost3000");
        }
        else
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }

        var api = app.MapGroup("/api");

        api.MapEndpoints();

        await PositionsSeeder.SeedAsync(app.Services, app.Environment);
    }
}