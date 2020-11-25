using AnimationClient;
using Grpc.Core;
using Grpc.Net.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace BKW.Backend.Api.Services.ParserServices
{
    public static class ParserServiceBuilder
    {
        public static IServiceCollection AddParserServices(this IServiceCollection services)
        {
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

            services.AddTransient<IBitmapConverter, BitmapConverter>();
            services.AddTransient<IParserService, ParserService>();

            services.AddGrpcClient<Parser.ParserClient>(
                options => options.Address = new Uri("http://parser:50051"))
                .ConfigurePrimaryHttpMessageHandler(p => new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
                }).ConfigureChannel(option =>
                {
                    var loggerFactory = LoggerFactory.Create(logging =>
                    {
                        logging.AddConsole();
                        logging.SetMinimumLevel(LogLevel.Debug);
                    });

                    option.LoggerFactory = loggerFactory;
                    option.Credentials = ChannelCredentials.Insecure;
                    option.MaxReceiveMessageSize = null;
                });

            return services;
        }
    }
}
