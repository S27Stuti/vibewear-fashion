# 🚀 VibeWear Full-Stack Deployment Guide

This guide walks you through deploying the **VibeWear Full-Stack Platform** (React Vite + Node.js Express + Cloud MySQL) completely free with top-tier global performance.

---

## 🏛️ Architecture Overview
* **Frontend:** [Vercel](https://vercel.com/) (Free Edge CDN, automatic HTTPS, continuous deployment from GitHub)
* **Backend:** [Render.com](https://render.com/) (Free Node.js Web Service)
* **Database:** Free Managed Cloud MySQL via [Aiven.io](https://aiven.io/) or [TiDB Cloud](https://tidb.cloud/) or [Clever Cloud](https://www.clever-cloud.com/)

---

## Step 1: Push Your Code to GitHub (2 Minutes)

Git is already initialized on branch `main` and your initial commit is created!

1. Open your browser and go to [github.com/new](https://github.com/new).
2. Enter Repository name: `vibewear-fashion` (keep it Public or Private).
3. Do **NOT** check "Add a README" or ".gitignore" (these are already created).
4. Click **Create repository**.
5. Copy the commands shown on GitHub under **"push an existing repository from the command line"** and run them in your terminal:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/vibewear-fashion.git
   git push -u origin main
   ```

---

## Step 2: Get a Free Cloud MySQL Database (3 Minutes)

Pick any of these recommended free cloud MySQL providers (No credit card required):

### Option A: Aiven for MySQL (Recommended)
1. Sign up for free at [aiven.io](https://aiven.io/).
2. Click **Create Service** → Select **MySQL** → Choose the **Free Plan**.
3. Choose a region closest to you (e.g., India / Mumbai, Singapore, or Frankfurt).
4. Click **Create Service**.
5. Once active (approx. 1-2 minutes), copy the **Service URI** (it looks like `mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED`).

### Option B: TiDB Serverless (MySQL Compatible)
1. Sign up for free at [tidbcloud.com](https://tidb.cloud/).
2. Click **Create Cluster** → Choose **Serverless (Free Tier)**.
3. Click **Connect** → Choose **Node.js / Sequelize** and copy the connection string.

---

## Step 3: Deploy Backend on Render.com (3 Minutes)

1. Sign up or log in at [render.com](https://render.com/).
2. On your Dashboard, click **New +** → select **Web Service**.
3. Connect your GitHub account and select your `vibewear-fashion` repository.
4. Configure the settings:
   * **Name:** `vibewear-backend`
   * **Region:** Select the same region or closest to your database (e.g., Singapore or Frankfurt).
   * **Branch:** `main`
   * **Root Directory:** `backend` ⚠️ *(Important: type `backend`)*
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`
5. Click **Advanced** → **Add Environment Variable** and add:
   * `NODE_ENV` = `production`
   * `DATABASE_URL` = `your_cloud_mysql_connection_string_from_step_2`
   * `DB_SSL` = `true`
   * `JWT_SECRET` = `super_secure_jwt_secret_key_vibewear_2026`
   * `CLIENT_URL` = `*` (Update this with your Vercel URL after Step 4)
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public URL:
   `https://vibewear-backend.onrender.com`

> **Note:** On startup, the backend automatically runs `sequelize.sync({ alter: true })`, which creates all 6 tables (`users`, `products`, `categories`, `orders`, `orderitems`, `reviews`) inside your cloud MySQL database automatically!
> To seed the initial 120 products into cloud MySQL, you can run the seeder command from Render's **Shell** tab:
> ```bash
> npm run seed
> ```

---

## Step 4: Deploy Frontend on Vercel (2 Minutes)

1. Sign up or log in at [vercel.com](https://vercel.com/).
2. On your Dashboard, click **Add New...** → **Project**.
3. Import your `vibewear-fashion` GitHub repository.
4. In the Project Configuration:
   * **Framework Preset:** `Vite` (automatically detected)
   * **Root Directory:** Click **Edit** and select `frontend` ⚠️ *(Important: select `frontend`)*
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Expand the **Environment Variables** section and add:
   * **Key:** `VITE_API_URL`
   * **Value:** `https://vibewear-backend.onrender.com/api/v1` *(Use your actual Render backend URL from Step 3)*
6. Click **Deploy**.
7. In ~30 seconds, Vercel will finish building and give you your live domain:
   🎉 **`https://vibewear-fashion.vercel.app`**

---

## Step 5: Final Handshake (Connect CORS)
1. Go back to your [Render.com](https://render.com/) backend dashboard.
2. In the **Environment** tab, update:
   * `CLIENT_URL` = `https://vibewear-fashion.vercel.app`
3. Click **Save Changes** (Render will automatically redeploy with the updated CORS rule in 20 seconds).

---

## ✅ Deployment Complete Checklist
- [x] Cloud MySQL database active and synchronized
- [x] Backend API live with health check at `https://your-backend.onrender.com/api/health`
- [x] Database inspector live at `https://your-backend.onrender.com/database`
- [x] Frontend shopping store live with global HTTPS at `https://your-app.vercel.app`
- [x] UPI QR code scanner & Cash on Delivery functioning live
