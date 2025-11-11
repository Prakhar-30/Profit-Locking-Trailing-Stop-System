# Deploying to Vercel - Simple Guide

## 🚀 Super Simple Deployment (No Environment Variables Needed!)

All configuration is hardcoded in the app, so deployment is incredibly easy.

## Prerequisites

- GitHub account
- Vercel account (free tier works fine)
- Your code pushed to GitHub repository

---

## Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add -A
git commit -m "Ready for Vercel deployment"
git push origin your-branch-name
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"Add New Project"**
4. Import your repository: `Prakhar-30/Profit-Locking-Trailing-Stop-System`

### Step 3: Configure Build Settings

When importing, set these settings:

**Framework Preset:** Vite (auto-detected)
**Root Directory:** `frontend` ← **IMPORTANT!**
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `dist` (auto-detected)
**Install Command:** `npm install` (auto-detected)

### Step 4: Deploy

Click **"Deploy"** and wait 2-3 minutes!

✅ **That's it!** No environment variables needed.

Your app will be live at: `https://your-project-name.vercel.app`

---

## Deploy via Vercel CLI (Alternative)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? (default is fine)
- Directory? `./` (you're already in frontend/)
- Override settings? **N**

For production deployment:
```bash
vercel --prod
```

---

## Verifying Deployment

After deployment:

1. Visit your Vercel URL
2. You should see the Profit-Locking System homepage
3. Click "Connect Wallet" to test
4. MetaMask should prompt for connection
5. Switch to Sepolia network when prompted

---

## Configuration Values (Already Built-In)

The following are hardcoded in `frontend/src/lib/config.ts`:

```typescript
// RPC Endpoints
SEPOLIA_RPC: 'https://ethereum-sepolia-rpc.publicnode.com'
REACTIVE_RPC: 'https://lasna-rpc.rnk.dev/'

// Chain IDs
SEPOLIA_CHAIN_ID: 11155111
REACTIVE_CHAIN_ID: 5318007

// Contract Addresses
SEPOLIA_ROUTER: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008'
SEPOLIA_CALLBACK_SENDER: '0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA'
```

✅ No `.env` file needed
✅ No environment variables to set on Vercel
✅ Works out of the box

---

## Common Issues & Solutions

### Issue 1: "App shows blank screen"

**Solution:**
- Check browser console for errors
- Verify `Root Directory` is set to `frontend` in Vercel settings
- Redeploy

### Issue 2: "MetaMask not connecting"

**Solution:**
- This is expected - user needs to approve connection
- Make sure MetaMask is installed and unlocked
- Switch to Sepolia network when prompted

### Issue 3: "Build fails"

**Solution:**
```bash
# Test build locally first
cd frontend
npm install
npm run build

# If it works locally, check Vercel build logs
```

### Issue 4: "404 on page refresh"

**Solution:**
- Should already be fixed with `vercel.json`
- If still happening, check that `vercel.json` exists in frontend directory

---

## Updating Your Deployment

Every time you push to GitHub, Vercel automatically rebuilds and deploys:

- **Push to main branch** → Production deployment
- **Push to feature branch** → Preview deployment

Manual redeploy:
```bash
cd frontend
vercel --prod
```

---

## Custom Domain (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `profit-locker.com`)
4. Click **Add**

### Step 2: Configure DNS

Add these DNS records at your domain registrar:

**For apex domain (example.com):**
```
A Record: @ → 76.76.21.21
```

**For subdomain (www.example.com):**
```
CNAME Record: www → cname.vercel-dns.com
```

### Step 3: Wait for Propagation

- DNS changes take 24-48 hours
- Vercel auto-provisions SSL certificate
- Your app will be live at your custom domain

---

## Automatic Deployments

Vercel automatically deploys on every push:

- ✅ Push to main → Production
- ✅ Push to any branch → Preview
- ✅ Pull requests → Preview with comment

### Configure in Vercel:

1. **Settings** → **Git**
2. **Production Branch**: Set to `main` (or your primary branch)
3. **Preview Deployments**: Enable for all branches

---

## Monitoring

### View Deployment Logs:

1. Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click any deployment to view logs

### Check Build Status:

- Green checkmark = Success ✅
- Red X = Failed ❌
- Click to see detailed logs

---

## Cost (Free Tier)

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Preview deployments
- ✅ Custom domains

Your app will stay within free tier limits for testing and moderate usage.

---

## Production Checklist

Before sharing your deployed app:

- [ ] Deployment successful (green checkmark)
- [ ] App loads without errors
- [ ] MetaMask connects properly
- [ ] Wallet switches to Sepolia correctly
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)
- [ ] All pages accessible

---

## Using Your Own RPC (Optional)

For better performance and rate limits, consider using:

### Alchemy (Recommended)

1. Sign up at [alchemy.com](https://alchemy.com)
2. Create Sepolia app
3. Get API key
4. Update in `frontend/src/lib/config.ts`:
   ```typescript
   const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY';
   ```

### Infura

1. Sign up at [infura.io](https://infura.io)
2. Create project
3. Get API key
4. Update in `frontend/src/lib/config.ts`:
   ```typescript
   const SEPOLIA_RPC = 'https://sepolia.infura.io/v3/YOUR_API_KEY';
   ```

---

## Quick Command Reference

```bash
# Deploy to Vercel
cd frontend
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel --prod --open
```

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Root Directory is set to `frontend`
4. Test build locally: `npm run build && npm run preview`
5. Check Vercel status: [vercel-status.com](https://www.vercel-status.com/)

---

## Summary

**Deployment is now super simple:**

1. ✅ Push code to GitHub
2. ✅ Import to Vercel
3. ✅ Set Root Directory to `frontend`
4. ✅ Click Deploy
5. ✅ Done!

**No environment variables needed!** Everything is hardcoded for easy testnet deployment.

---

**Ready to deploy! 🚀**

Choose Dashboard method if you prefer GUI.
Choose CLI method if you prefer command line.

Both work perfectly - pick what you're comfortable with!
