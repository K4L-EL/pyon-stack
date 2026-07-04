FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Pyon.Api.sln ./
COPY Pyon.Api/ ./Pyon.Api/
RUN dotnet restore Pyon.Api/Pyon.Api.csproj
RUN dotnet publish Pyon.Api/Pyon.Api.csproj -c Release -o /app /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_URLS=http://+:5082
EXPOSE 5082
ENTRYPOINT ["dotnet", "Pyon.Api.dll"]
