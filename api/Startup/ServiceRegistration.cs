using FMCK.Trainer.Api.Data;
using FMCK.Trainer.Api.Endpoints.Positions;
using Microsoft.EntityFrameworkCore;

namespace FMCK.Trainer.Api.Startup;

public static class ServiceRegistration
{
    
    public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        services.AddMemoryCache();
        services.AddHttpContextAccessor();


        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost3000", policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        services.AddDbContext<AppDbContext>(opt =>
            opt.UseInMemoryDatabase("PositionsDb"));        

        return builder;
    }
}