#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Backend/BKW.Backend.Api/BKW.Backend.Api.csproj", "Backend/BKW.Backend.Api/"]
COPY ["Backend/BKW.Backend.Dal/BKW.Backend.Dal.csproj", "Backend/BKW.Backend.Dal/"]
COPY ["Backend/BKW.Backend.Domain/BKW.Backend.Domain.csproj", "Backend/BKW.Backend.Domain/"]
RUN dotnet restore "Backend/BKW.Backend.Api/BKW.Backend.Api.csproj"
COPY . .
WORKDIR "/src/Backend/BKW.Backend.Api"
RUN dotnet build "BKW.Backend.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BKW.Backend.Api.csproj" -c Release -o /app/publish

FROM base AS final
RUN apt-get update \
    && apt-get install -y --allow-unauthenticated \
        libc6-dev \
        libgdiplus \
        libx11-dev \
     && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BKW.Backend.Api.dll"]