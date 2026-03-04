FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TirthSeva.API/TirthSeva.API.csproj", "TirthSeva.API/"]
RUN dotnet restore "TirthSeva.API/TirthSeva.API.csproj"
COPY . .
WORKDIR "/src/TirthSeva.API"
RUN dotnet build "TirthSeva.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TirthSeva.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TirthSeva.API.dll"]
