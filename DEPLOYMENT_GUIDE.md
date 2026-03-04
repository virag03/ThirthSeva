# TirthSeva Deployment Guide

This guide covers deploying the **backend (ASP.NET Core 8)** on **Render** and the **frontend (React + Vite)** on **Netlify**. It also includes notes for other easy backend options (.NET or Spring).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend: Deploy on Render (.NET 8)](#backend-deploy-on-render-net-8)
3. [Database: SQL Server in the Cloud](#database-sql-server-in-the-cloud)
4. [Frontend: Deploy on Netlify](#frontend-deploy-on-netlify)
5. [Connect Frontend to Backend](#connect-frontend-to-backend)
6. [Post-Deploy Checklist](#post-deploy-checklist)
7. [Alternative: Easier Backend Hosts](#alternative-easier-backend-hosts)

---

## Prerequisites

- **Git**: Project in a Git repo (GitHub, GitLab, or Bitbucket).
- **Accounts**: [Render](https://render.com), [Netlify](https://netlify.com), and (for DB) [Azure](https://azure.microsoft.com) or another SQL Server host.
- **Local**: .NET 8 SDK and Node.js 18+ installed for testing builds.

---

## Backend: Deploy on Render (.NET 8)

Your backend is **ASP.NET Core 8** with SQL Server. Render can run the API; the database must be hosted separately (e.g. Azure SQL). Steps below.

### Step 1: Push code to GitHub/GitLab

Ensure the repo is pushed and the backend lives under `backend/TirthSeva.API/`.

```bash
cd c:\Users\virag\Desktop\AMEYDROP\working_tirthseva
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create a Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**.
2. Connect your Git provider and select the **working_tirthseva** (or your repo) repository.
3. Use these settings:

| Setting | Value |
|--------|--------|
| **Name** | `tirthseva-api` (or any name) |
| **Region** | Choose nearest to users |
| **Branch** | `main` (or your default branch) |
| **Runtime** | **Docker** (recommended) or **Native** |

#### Option A: Deploy with Docker (recommended)

Create a `Dockerfile` in the **backend** folder (same level as `TirthSeva.API`):

**File: `backend/Dockerfile`**

```dockerfile
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
```

Then in Render:

- **Build Command:** (leave empty; Docker build is used)
- **Start Command:** (leave empty; Dockerfile `ENTRYPOINT` is used)
- **Root Directory:** `backend`

#### Option B: Deploy without Docker (Native .NET)

In Render, set:

- **Runtime:** **Native**
- **Root Directory:** `backend/TirthSeva.API`
- **Build Command:**
  ```bash
  dotnet restore && dotnet publish -c Release -o out
  ```
- **Start Command:**
  ```bash
  dotnet out/TirthSeva.API.dll
  ```

Render expects the app to listen on `PORT` (e.g. 10000). Add this in `Program.cs` so it works on Render (optional if you use Docker with 8080):

```csharp
// At the top of Program.cs, after var builder = ...
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}
```

### Step 3: Set environment variables on Render

In your Render Web Service → **Environment** tab, add:

| Key | Value | Notes |
|-----|--------|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Required |
| `ConnectionStrings__DefaultConnection` | *Your SQL connection string* | See [Database](#database-sql-server-in-the-cloud) below |
| `JwtSettings__Secret` | *Long random secret (e.g. 64 chars)* | Generate a strong key |
| `JwtSettings__Issuer` | `TirthSevaAPI` | Or your preferred issuer |
| `JwtSettings__Audience` | `TirthSevaClient` | Or your preferred audience |
| `AppSettings__FrontendUrl` | `https://your-netlify-site.netlify.app` | Your Netlify URL (no trailing slash) |
| `EmailSettings__SmtpHost` | `smtp.gmail.com` | If you use email |
| `EmailSettings__SmtpPort` | `587` | |
| `EmailSettings__SenderEmail` | *your-email@gmail.com* | |
| `EmailSettings__Username` | *your-email@gmail.com* | |
| `EmailSettings__Password` | *App password* | Gmail app password, not normal password |
| `EmailSettings__EnableSsl` | `true` | |

Use **double underscore** `__` for nested config (e.g. `ConnectionStrings__DefaultConnection`).

### Step 4: Deploy

Click **Create Web Service**. Render will build and deploy. Note the service URL, e.g. `https://tirthseva-api.onrender.com`.

---

## Database: SQL Server in the Cloud

Your app uses **SQL Server** (Entity Framework Core). Render does not provide SQL Server; use one of these.

### Option 1: Azure SQL Database (free tier)

1. Go to [portal.azure.com](https://portal.azure.com) → Create **SQL Database**.
2. Create a new server, set admin login and password.
3. In firewall, allow **Azure services** and add **0.0.0.0–255.255.255.255** (or restrict to Render IPs if you have them).
4. Copy the **ADO.NET** connection string from the database overview and use it in Render as `ConnectionStrings__DefaultConnection`.

Format (replace placeholders):

```text
Server=tcp:YOUR_SERVER.database.windows.net,1433;Database=TirthSevaDb;User ID=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;
```

### Option 2: Free SQL Server elsewhere

You can use any hosted SQL Server (e.g. some free tiers or your own VPS). Put that connection string in `ConnectionStrings__DefaultConnection` on Render.

### Option 3: Switch to PostgreSQL (optional)

If you prefer a free DB on Render:

1. In Render dashboard: **New** → **PostgreSQL**. Create a DB and copy **Internal Database URL**.
2. In your .NET project: add `Npgsql.EntityFrameworkCore.PostgreSQL`, change `UseSqlServer` to `UseNpgsql`, and run migrations for PostgreSQL. Then set `ConnectionStrings__DefaultConnection` to the Postgres URL on Render.

---

## Frontend: Deploy on Netlify

### Step 1: Push frontend to Git

Frontend should be in the same repo under `frontend/` (already is). Ensure latest code is pushed.

### Step 2: Create site on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Connect GitHub/GitLab and select the **working_tirthseva** repo.
3. Use these settings:

| Setting | Value |
|--------|--------|
| **Branch to deploy** | `main` |
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |
| **Node version** | 18 or 20 (optional: set in UI or `.nvmrc`) |

4. Before deploying, add environment variables (Step 3).
5. Click **Deploy site**.

### Step 3: Environment variables on Netlify

In **Site settings** → **Environment variables** → **Add variable** / **Add from .env**:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://tirthseva-api.onrender.com/api` |
| `VITE_BASE_URL` | `https://tirthseva-api.onrender.com` |

Use your real Render URL. Redeploy after changing env vars (Netlify → **Deploys** → **Trigger deploy**).

### Commands reference (local)

```bash
# From repo root
cd frontend
npm install
npm run build
# Output is in frontend/dist
```

---

## Connect Frontend to Backend

1. **CORS**: Backend already uses `AppSettings__FrontendUrl`. Set it on Render to your Netlify URL, e.g. `https://your-site-name.netlify.app` (no trailing slash).
2. **Frontend**: `VITE_API_URL` and `VITE_BASE_URL` must point to the Render API URL (as above). Rebuild/redeploy frontend after changing them.
3. **HTTPS**: Use `https://` for both API and frontend in production.

---

## Post-Deploy Checklist

- [ ] Backend health: open `https://your-api.onrender.com/swagger` (if Swagger is enabled in Production) or a simple API route.
- [ ] Frontend loads and login/register hit the API (check browser Network tab).
- [ ] Database: migrations run on startup; if not, run them manually or via a release command.
- [ ] Admin user: your app seeds `admin@tirthseva.com` / `Admin@123` on first run; change password after first login.
- [ ] Emails: if you use SMTP, ensure app password and firewall allow outbound 587.

---

## Alternative: Easier Backend Hosts

If you want the **easiest** backend deploy (still .NET or Spring):

| Platform | Ease | Notes |
|----------|------|--------|
| **Render** | Easy | Good for .NET; DB must be external (e.g. Azure SQL). |
| **Railway** | Easy | One-click deploy from GitHub; can add PostgreSQL; .NET supported. |
| **Fly.io** | Medium | Good for .NET; you can attach Postgres; CLI-based. |
| **Azure App Service** | Easy | Fits .NET + Azure SQL in one ecosystem; free tier available. |
| **Heroku** | Medium | .NET buildpacks; add-on for Postgres (no SQL Server). |

### Quick Railway (alternative to Render)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select repo.
2. Set **Root Directory** to `backend/TirthSeva.API` (or use Dockerfile in `backend`).
3. Add **PostgreSQL** in Railway; for .NET you’d need to switch the app to PostgreSQL (Npgsql) to use this DB.
4. Add the same env vars as in the Render section (connection string, JWT, frontend URL, etc.).
5. Railway gives you a URL; use that for `VITE_API_URL` and `VITE_BASE_URL` on Netlify.

### If you were using Spring Boot instead

- **Render**: Same idea—connect repo, set root to the Spring app, build `./mvnw clean package` (or Gradle equivalent), start `java -jar target/your-app.jar`. Add env vars for DB and JWT.
- **Railway / Fly.io / Heroku**: All support JAR deploy; add database and env vars similarly.

---

## Summary of Commands

```bash
# Backend (local test)
cd backend/TirthSeva.API
dotnet restore
dotnet run

# Backend publish (for native Render)
dotnet publish -c Release -o out

# Frontend (local test)
cd frontend
npm install
npm run build
npm run preview

# Git (before connecting to Render/Netlify)
git add .
git commit -m "Deploy backend and frontend"
git push origin main
```

Use this doc as a single reference for deploying the backend on Render (or an alternative) and the frontend on Netlify, with all commands and steps in one place.
