FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Pyon.Api.sln ./
COPY Pyon.Api/ ./Pyon.Api/
RUN dotnet restore Pyon.Api/Pyon.Api.csproj
RUN dotnet publish Pyon.Api/Pyon.Api.csproj -c Release -o /app /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_URLS=http://+:__PYON_PORT_API__
EXPOSE __PYON_PORT_API__
ENTRYPOINT ["dotnet", "__PYON_NAMESPACE__.Api.dll"]
