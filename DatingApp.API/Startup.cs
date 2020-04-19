using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        //These Configure...Services method are convention based - the relevant one will be used dependent on the environment mode
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            // // "DefaultConnection": "Data Source=datingapp.db"
            // services.AddDbContext<DataContext>(x =>
            // {
            //     x.UseLazyLoadingProxies();
            //     x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            // });

            services.AddDbContext<DataContext>(x =>
            {
                x.UseLazyLoadingProxies(); //Microsoft.EntityFrameworkCore.Proxies.dll
                x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            ConfigureServices(services);
        }
        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
            {
                x.UseLazyLoadingProxies();
                x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            services.AddCors();

            services.AddAutoMapper(this.GetType().Assembly);

            // Use Newtonsoft (package: Microsoft.AspNetCore.Mvc.NewtonsoftJson) rather than System.Text.Json
            services.AddControllers().AddNewtonsoftJson(option =>
            {
                option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            //Data Repositories
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IDatingRepository, DatingRepository>();

            //Enforce Jwt bearer token authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false

                    };
                });

            services.AddScoped<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                //Developer friendly exception message formatting (inc stack trace etc)
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //User friendly exception message formatting
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async httpContext =>
                    {
                        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = httpContext.Features.Get<IExceptionHandlerFeature>();

                        if (error != null)
                        {
                            httpContext.Response.AddApplicationErrorHeader(error.Error.Message);

                            await httpContext.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();

            app.UseAuthorization();

            // Start: Serve static files from wwwroot folder via the Kestral Server
            app.UseDefaultFiles();      //Looks for the index.html file in /wwwroot
            app.UseStaticFiles();
            // End

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Spa");  //Falls back to using the SpaController to serve up the Angular routes
            });
        }
    }
}
