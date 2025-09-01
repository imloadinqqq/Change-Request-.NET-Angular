FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /source
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
ENTRYPOINT ["dotnet", "ChangeRequestApi.dll", "--urls", "http://localhost:3000"]
