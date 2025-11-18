# 🚀 Quick Deploy - 10 Minute Setup

## Step 1: Supabase (3 minutes)

```bash
1. Go to https://supabase.com
2. Create new project: "dsa-roadmap-tracker"
3. Copy Project URL and anon key
4. Go to SQL Editor → Paste schema → Run
```

## Step 2: Local Setup (2 minutes)

```bash
# Install dependency
npm install @supabase/supabase-js

# Create .env file
echo "VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here" > .env

# Test locally
npm run dev
```

## Step 3: Deploy to Vercel (3 minutes)

```bash
# Option 1: CLI
npm i -g vercel
vercel login
vercel

# Option 2: Dashboard
1. Go to vercel.com
2. Import Git repo
3. Add environment variables
4. Deploy
```

## Step 4: Configure (2 minutes)

```bash
1. Copy Vercel URL
2. Go to Supabase → Authentication → URL Configuration
3. Add Site URL and Redirect URLs
4. Test signup and login
```

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

---

## Files to Create/Update

### New Files:
- `src/lib/supabaseClient.js`
- `src/services/api.js`
- `.env`
- `vercel.json` (optional)

### Update Files:
- `src/hooks/useAuth.js`
- `src/hooks/useProgress.js`
- `src/components/Auth/AuthModal.jsx`

### Add to .gitignore:
```
.env
.env.local
.env.production
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Set these in:
- **Local**: `.env` file
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables

---

## Test Checklist

- [ ] Signup works
- [ ] Email verification received
- [ ] Login works
- [ ] Complete task saves
- [ ] Notes save
- [ ] Data persists after logout
- [ ] Stats update correctly

---

## Common Issues

**"Invalid API Key"**
→ Check environment variables

**"Email not confirmed"**
→ Check spam folder, resend from Supabase

**"Network Error"**
→ Resume paused Supabase project

**Tasks not saving**
→ Check browser console for errors

---

## Free Tier Limits

**Supabase:**
- 500 MB database
- 50K MAU
- 2 GB bandwidth

**Vercel:**
- 100 GB bandwidth
- Unlimited projects
- Automatic HTTPS

**Result:** Can support ~1000 active users for FREE! 🎉