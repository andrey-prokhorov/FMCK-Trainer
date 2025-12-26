# FMCK.Trainer - Backend

This repository contains a .NET solution targeting **net10.0**.

## Prerequisites

- **.NET SDK 10.0** installed  
  Verify with:
  ```bash
  dotnet --version
  ```

## Running the Application

From the repository root:

```bash
dotnet restore
dotnet run --project src/FMCK.Trainer.Api/FMCK.Trainer.Api.csproj
```

## Building for Production

```bash
dotnet build -c Release
dotnet publish src/FMCK.Trainer.Api/FMCK.Trainer.Api.csproj -c Release -o ./artifacts/publish
```

Optional (publish for a specific runtime):

```bash
dotnet publish src/FMCK.Trainer.Api/FMCK.Trainer.Api.csproj -c Release -r linux-x64 -o ./artifacts/publish
```

## Testing

```bash
dotnet test -c Release
```

Run tests without rebuilding:

```bash
dotnet test -c Release --no-build
```

Run a specific test project:

```bash
dotnet test src/FMCK.Trainer.Tests/FMCK.Trainer.Tests.csproj -c Release
```

## Useful Commands

```bash
dotnet clean
dotnet --info
```
