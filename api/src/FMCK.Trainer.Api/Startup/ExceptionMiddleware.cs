namespace FMCK_Trainer_Api.Startup;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        // TODO: Catch more specific exceptions and return appropriate status codes if needed here
        catch (Exception exception)
        {
            logger.LogError(exception, exception.Message);
            await Results.Problem().ExecuteAsync(context);
        }
    }
}