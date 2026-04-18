using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data;
using __PYON_NAMESPACE__.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("ConnectionStrings:Default not configured");
    opt.UseNpgsql(cs);
});

builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddSingleton<IAiService, AiService>();
builder.Services.AddScoped<DataSeeder>();

var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "__PYON_NAME__";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "__PYON_NAME__";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();

app.Logger.LogInformation("Starting __PYON_DISPLAY_NAME__ API");

// Apply schema + seed on boot.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        // Check if base tables exist; fall back to EnsureCreated on a fresh DB.
        var usersTableExists = false;
        try
        {
            await db.Database.ExecuteSqlRawAsync(@"SELECT 1 FROM ""Users"" LIMIT 1");
            usersTableExists = true;
        }
        catch
        {
            // table doesn't exist yet
        }

        if (!usersTableExists)
        {
            logger.LogInformation("Base tables not found. Creating schema via EnsureCreated...");
            try { await db.Database.ExecuteSqlRawAsync(@"DROP TABLE IF EXISTS ""__EFMigrationsHistory"""); }
            catch { /* ignore */ }
            db.Database.EnsureCreated();
            logger.LogInformation("Database schema created");
        }
        else
        {
            logger.LogInformation("Applying pending migrations (if any)...");
            db.Database.Migrate();
        }

        // Idempotent column guards — safe to re-run on every boot.
        // When you add a new column to an entity, add a matching guard here so prod
        // never fails with "42703 column does not exist" before the migration runs.
        try
        {
            await db.Database.ExecuteSqlRawAsync(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='LastLoginAt') THEN
                        ALTER TABLE ""Users"" ADD COLUMN ""LastLoginAt"" timestamptz NULL;
                    END IF;
                END $$;
            ");
            logger.LogInformation("Column guards applied");
        }
        catch (Exception colEx)
        {
            logger.LogWarning(colEx, "Column guards failed (non-fatal)");
        }

        var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during database initialization");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Json(new { message = "__PYON_DISPLAY_NAME__ API", version = "0.1.0" }));

app.Run();
