# Fix Vercel 404 Error - Quick Guide

## The Problem
You're seeing: `404: NOT_FOUND` - This means Vercel can't find your built app.

## Solution 1: Set Root Directory (Most Common Fix)

### Via Vercel Dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** (top navigation)
3. Click **General** (left sidebar)
4. Scroll down to **Build & Development Settings**
5. Find **Root Directory**
6. Enter: `frontend`
7. Click **Save**
8. Go to **Deployments** tab
9. Click **...** (three dots) on latest deployment
10. Click **Redeploy**

**Wait 2-3 minutes for rebuild!**

---

## Solution 2: Redeploy from Scratch

If setting Root Directory doesn't work:

### Delete and Redeploy:

1. In Vercel Dashboard, go to **Settings**
2. Scroll to bottom
3. Click **Delete Project**
4. Confirm deletion
5. Go back to Vercel home
6. Click **Add New Project**
7. Import your GitHub repo again
8. **IMPORTANT**: Set these settings:

```
Framework Preset: Vite
Root Directory: frontend    ← CRITICAL!
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

9. Click **Deploy**

---

## Solution 3: Manual Build Check

Test the build locally first:

```bash
cd frontend
npm install
npm run build
```

**If this works**, your app is fine and it's just a Vercel configuration issue.

**If this fails**, there's a build error. Share the error message.

---

## Solution 4: Use Root-Level vercel.json

A root-level `vercel.json` has been created that should help Vercel understand the project structure.

Commit and push:

```bash
git add vercel.json
git commit -m "Add root vercel.json for proper deployment"
git push
```

This should trigger automatic redeployment.

---

## Verify Build Settings

After deployment, check these in Vercel:

**Go to Deployments → Latest Deployment → View Build Logs**

You should see:
```
✓ Installing dependencies
✓ Building application
✓ Build completed
✓ Deployment ready
```

If you see errors, share them!

---

## Common Mistakes

❌ **Wrong**: Root Directory = `/`
✅ **Right**: Root Directory = `frontend`

❌ **Wrong**: Output Directory = `/dist`
✅ **Right**: Output Directory = `dist`

❌ **Wrong**: Build Command = `cd frontend && npm run build`
✅ **Right**: Build Command = `npm run build` (after setting Root Directory)

---

## Still Not Working?

Share:
1. Screenshot of your Vercel Build Settings
2. Build logs from Vercel (Deployments → Latest → Logs)
3. Any error messages

---

## Quick Test

After deployment, your app should be at:
`https://your-project-name.vercel.app`

You should see the Profit-Locking System homepage with:
- "Connect Wallet" button
- "Profit-Locking System" title
- Retro-futuristic design

If you see this, it's working! 🎉
