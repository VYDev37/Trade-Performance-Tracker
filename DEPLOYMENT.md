# Deployment Guide

This repository operates as a **True Monorepo**. Thanks to the root `vercel.json` configuration, you can deploy both the Next.js frontend and the Go/Fiber backend simultaneously as a single, unified Vercel project with zero friction.

## Quick Deploy ("Zero-Config" True Monorepo)

Deploying the entire infrastructure is designed to require almost no setup:

1. **Import the Repository**: In your Vercel dashboard, import the root repository directly.
2. **Leave Root Directory Blank**: Do **NOT** select a specific root directory. By leaving it at the root, Vercel will natively process the `vercel.json` file. All `/api/(.*)` traffic is automatically routed to the Go serverless functions, while everything else serves the Next.js application.
3. **Framework Preset**: Vercel will automatically detect the core framework (Next.js).

---

## Database Setup (Supabase)

Before deploying, ensure your database is ready to handle serverless connections.

*   **Connection String**: You must use the **Transaction Mode** connection string provided by Supabase. Ensure the port is set to `6543` (e.g., `postgresql://...:6543/postgres`). This is critical for Vercel's serverless environment.
*   **Migrations**: Populate your database schema by running the following command locally from the root folder:
    ```bash
    cd backend
    go run core/script/auto-migrate.go
    ```

---

## Unified Environment Variables (Bulk-Paste)

Vercel allows you to instantly populate your entire environment via its **bulk-paste** feature. 

Simply combine the key-value pairs from both `frontend/.env.example` and `backend/.env.example`, copy the entire merged list, and paste it directly into the first Environment Variable slot in your Vercel project settings.

**Critical Variables Required for Production:**
For more information, refer to [🛠️Environment Variables Setup](README.md#🛠️-environment-variables-setup).
*   `DB_CONNECTION`: Your Supabase Transaction Mode string (must use port `6543`).
*   `JWT_SECRET`: A secure, random string used for generating authentication tokens.
*   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name identifier.
*   `PRODUCTION_MODE`: Must be set to `true`.

---

## Technical Requirements

When operating in production under this unified Vercel domain architecture, be mindful of the following parameters:

*   **Cookie Security**: Because authentication seamlessly relies on HTTP-only cookies, you must ensure your production cookie generation is strictly configured with `Secure: true` and `SameSite: None` to comply with transmission standards over HTTPS.
*   **Cold Starts**: If deployed to the Vercel Hobby Tier, the underlying Go serverless functions are configured to scale down to zero during periods of inactivity. You should anticipate a temporary "Cold Start" delay of approximately 2-3 seconds on the very first subsequent `/api` request.
