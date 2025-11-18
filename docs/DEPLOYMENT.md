# DSA Roadmap Tracker - Production Deployment Guide

## 📋 Prerequisites

- Node.js 16+ installed
- Git installed
- A Supabase account (free)
- A Vercel/Netlify account (free)

---

## Part 1: Supabase Setup (Database)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `dsa-roadmap-tracker`
   - **Database password**: (create a strong password and save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire SQL schema from `supabase-schema.sql` artifact
4. Paste it into the editor
5. Click **"Run"** (green play button)
6. You should see: "Success. No rows returned"

### Step 3: Configure Authentication

1. Go to **Authentication** → **Providers** in sidebar
2. Enable **Email** provider (should be enabled by default)
3. Go to **Authentication** → **Email Templates**
4. Customize the confirmation email if desired
5. Go to **Authentication** → **URL Configuration**
6. Set **Site URL**: `http://localhost:5173` (for development)
7. Add **Redirect URLs**: 
   - `http://localhost:5173/**`
   - `https://your-domain.vercel.app/**` (add after deployment)

### Step 4: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

---

## Part 2: Project Setup

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Environment File

Create `.env` in your project root:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

⚠️ **Important**: Add `.env` to your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

### Step 3: Update Your Files

Replace these files with the new versions:

1. **Create new files:**
   - `src/lib/supabaseClient.js`
   - `src/services/api.js`

2. **Replace existing files:**
   - `src/hooks/useAuth.js`
   - `src/hooks/useProgress.js`
   - `src/components/Auth/AuthModal.jsx`

3. **Update App.jsx** to use the new hooks (same interface, no changes needed!)

---

## Part 3: Testing Locally

```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:5173

# Test signup flow:
# 1. Click "Login / Sign Up"
# 2. Create account with email
# 3. Check email for verification link
# 4. Click verification link
# 5. Login with credentials
# 6. Test task completion, notes, etc.
```

---

## Part 4: Deploy to Vercel (Free)

### Step 1: Prepare for Deployment

1. Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

2. Update `package.json` build script:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: dsa-roadmap-tracker
# - Which directory: ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your Git repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**

### Step 3: Add Environment Variables to Vercel

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Click **"Save"**
5. Redeploy: Go to **Deployments** → Click ⋯ → **Redeploy**

### Step 4: Update Supabase URLs

1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Go to Supabase → **Authentication** → **URL Configuration**
3. Update **Site URL** to your Vercel URL
4. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Alternative: Deploy to Netlify (Free)

### Step 1: Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to your Git repository
5. Netlify auto-detects settings
6. Add environment variables in **Site settings** → **Environment variables**
7. Click **"Deploy"**

---

## Part 5: Post-Deployment Checklist

### ✅ Test Everything

- [ ] Sign up with new email
- [ ] Verify email (check spam folder)
- [ ] Login
- [ ] Complete a task
- [ ] Add a note
- [ ] Skip a day
- [ ] Logout and login again
- [ ] Verify data persists
- [ ] Check stats update correctly

### ✅ Security

- [ ] Environment variables NOT in git
- [ ] RLS policies active in Supabase
- [ ] Only using anon key (not service_role key)

### ✅ Production Ready

- [ ] Custom domain configured (optional)
- [ ] Email templates customized
- [ ] Error tracking added (Sentry, LogRocket)
- [ ] Analytics added (Google Analytics, Plausible)

---

## 📊 Database Backup (Recommended)

### Auto Backups (Supabase)

1. Go to **Database** → **Backups**
2. Supabase automatically backs up daily (free tier: 7 days retention)
3. For longer retention, upgrade to Pro ($25/month)

### Manual Backup

```bash
# In Supabase dashboard
# Go to Database → Backups → Download backup
```

---

## 🔧 Troubleshooting

### "Invalid API Key"
- Check environment variables are set correctly
- Verify `.env` file exists locally
- On Vercel: Check **Settings** → **Environment Variables**

### "Email not confirmed"
- Check spam folder for verification email
- Resend confirmation: Supabase Dashboard → **Authentication** → **Users** → Click user → **Send confirmation email**

### "Network Error"
- Check Supabase project is not paused (auto-pauses after 1 week of inactivity on free tier)
- Go to Supabase dashboard → Click **"Resume project"**

### Tasks not persisting
- Check browser console for errors
- Verify RLS policies are active
- Test in Supabase SQL Editor:
  ```sql
  SELECT * FROM user_progress;
  ```

---

## 📈 Monitoring & Maintenance

### Supabase Dashboard

- **Database**: Monitor table sizes, queries
- **Authentication**: View users, manage sessions
- **Logs**: Check for errors
- **API**: Monitor request count

### Usage Limits (Free Tier)

- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB
- **API requests**: 50,000/month
- **Authentication**: 50,000 MAU

Upgrade to Pro when you exceed these limits.

---

## 🎉 Your App is Live!

Your production-ready DSA Roadmap Tracker is now:
- ✅ Deployed with secure authentication
- ✅ Using PostgreSQL database
- ✅ Automatically scaling
- ✅ Free to use (within limits)
- ✅ Backed up daily

**Share your app**: `https://your-app.vercel.app`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong passwords** for Supabase
3. **Enable 2FA** on Vercel/Netlify
4. **Regular security updates**: `npm audit fix`
5. **Monitor Supabase logs** for suspicious activity

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

Need help? Check these:
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Stack Overflow: Tag with `supabase` and `react`