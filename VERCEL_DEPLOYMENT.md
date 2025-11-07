# Deploying to Vercel - Complete Guide

This guide will walk you through deploying your Profit-Locking Trailing Stop System frontend to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works fine)
- Your code pushed to GitHub repository

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add -A
git commit -m "Add Vercel configuration"
git push origin claude/profit-locking-trailing-stop-011CUt5JekwzNeQ7Z94Aw7m5
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"Add New Project"**
4. Import your repository: `Prakhar-30/Profit-Locking-Trailing-Stop-System`

### Step 3: Configure Build Settings

When importing, Vercel will auto-detect Vite. Verify these settings:

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 4: Add Environment Variables

⚠️ **CRITICAL STEP** - Your app won't work without these!

Click on **"Environment Variables"** and add each of these:

#### Required Environment Variables

| Name | Value | Description |
|------|-------|-------------|
| `VITE_SEPOLIA_RPC` | `https://ethereum-sepolia-rpc.publicnode.com` | Sepolia RPC endpoint |
| `VITE_REACTIVE_RPC` | `https://lasna-rpc.rnk.dev/` | Reactive Network RPC |
| `VITE_SEPOLIA_CHAIN_ID` | `11155111` | Sepolia Chain ID |
| `VITE_REACTIVE_CHAIN_ID` | `5318007` | Reactive Chain ID |
| `VITE_SEPOLIA_ROUTER` | `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008` | Uniswap V2 Router |
| `VITE_SEPOLIA_CALLBACK_SENDER` | `0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA` | Callback Sender |

**How to add each variable:**

1. Click **"Add Environment Variable"**
2. Enter the **Name** (e.g., `VITE_SEPOLIA_RPC`)
3. Enter the **Value** (e.g., `https://ethereum-sepolia-rpc.publicnode.com`)
4. Select **All** environments (Production, Preview, Development)
5. Click **"Add"**
6. Repeat for each variable

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## Method 2: Deploy via Vercel CLI (Advanced)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 4: Set Environment Variables Locally

Create `.env.production`:

```bash
cat > .env.production << 'EOF'
VITE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
VITE_REACTIVE_RPC=https://lasna-rpc.rnk.dev/
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_REACTIVE_CHAIN_ID=5318007
VITE_SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
VITE_SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
EOF
```

### Step 5: Deploy

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

### Step 6: Add Environment Variables via CLI

```bash
# Add each environment variable
vercel env add VITE_SEPOLIA_RPC production
# When prompted, enter: https://ethereum-sepolia-rpc.publicnode.com

vercel env add VITE_REACTIVE_RPC production
# When prompted, enter: https://lasna-rpc.rnk.dev/

vercel env add VITE_SEPOLIA_CHAIN_ID production
# When prompted, enter: 11155111

vercel env add VITE_REACTIVE_CHAIN_ID production
# When prompted, enter: 5318007

vercel env add VITE_SEPOLIA_ROUTER production
# When prompted, enter: 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008

vercel env add VITE_SEPOLIA_CALLBACK_SENDER production
# When prompted, enter: 0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
```

### Step 7: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Verifying Environment Variables

After deployment, you can verify environment variables are set:

### Via Vercel Dashboard:

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. You should see all 6 variables listed

### Via Browser Console:

1. Visit your deployed site
2. Open browser console (F12)
3. Type: `import.meta.env`
4. You should see your variables (without the VITE_ prefix in production)

---

## Updating Environment Variables

### Via Dashboard:

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Find the variable you want to update
4. Click **Edit** (pencil icon)
5. Update the value
6. Click **Save**
7. **Redeploy** your project for changes to take effect

### Via CLI:

```bash
# Remove old variable
vercel env rm VITE_SEPOLIA_RPC production

# Add new variable
vercel env add VITE_SEPOLIA_RPC production
# Enter new value when prompted

# Redeploy
vercel --prod
```

---

## Common Issues & Solutions

### Issue 1: "Environment variables not working"

**Solution:**
- Make sure all variable names start with `VITE_`
- Vite only exposes environment variables that start with `VITE_`
- Redeploy after adding variables

### Issue 2: "App shows blank screen"

**Solution:**
- Check browser console for errors
- Verify environment variables are set
- Make sure `Root Directory` is set to `frontend` in Vercel settings

### Issue 3: "MetaMask not connecting"

**Solution:**
- This is expected on first load
- Environment variables are correctly set
- User needs to approve MetaMask connection

### Issue 4: "404 on refresh"

**Solution:**
- Add `vercel.json` with rewrites (already included)
- This ensures SPA routing works properly

### Issue 5: "Build fails"

**Solution:**
```bash
# Locally test build first
cd frontend
npm run build

# If it works locally, check Vercel build logs
# Make sure Node.js version matches (16+)
```

---

## Production Checklist

Before deploying to production:

- [ ] All environment variables set on Vercel
- [ ] Test deployment works (visit the URL)
- [ ] MetaMask connects successfully
- [ ] Wallet connection works on correct networks
- [ ] All pages load without errors
- [ ] Browser console shows no errors
- [ ] Mobile responsive design works
- [ ] Custom domain configured (optional)

---

## Custom Domain Setup (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `profit-locker.com`)
4. Click **Add**

### Step 2: Configure DNS

Vercel will provide DNS records. Add these to your domain registrar:

**For apex domain (example.com):**
```
A Record: @ → 76.76.21.21
```

**For subdomain (www.example.com):**
```
CNAME Record: www → cname.vercel-dns.com
```

### Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours
- Vercel will auto-provision SSL certificate
- Your app will be live at your custom domain

---

## Automatic Deployments

Vercel automatically deploys on every push to GitHub:

- **Push to main branch** → Production deployment
- **Push to feature branch** → Preview deployment
- Each preview gets unique URL for testing

### Configure Auto-Deploy:

1. Go to **Settings** → **Git**
2. Enable **Production Branch**: `main` or your primary branch
3. Enable **Preview Deployments**: All branches

---

## Monitoring & Analytics

### View Deployment Logs:

1. Go to your project on Vercel
2. Click **Deployments**
3. Click on any deployment
4. View **Build Logs** and **Function Logs**

### Analytics (Optional):

1. Go to **Analytics** tab
2. View page views, performance metrics
3. Monitor user traffic

---

## Cost & Limits

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Serverless Functions
- ✅ Preview deployments

**Limits:**
- Build time: 45 minutes
- Serverless Functions: 10 second execution
- Edge Functions: 50 milliseconds (not used in this project)

Your app will likely stay within free tier limits unless you get massive traffic.

---

## Security Best Practices

### 1. Environment Variables

✅ **DO:**
- Use environment variables for all config
- Keep `.env` files in `.gitignore`
- Use `VITE_` prefix for public variables

❌ **DON'T:**
- Commit `.env` files to Git
- Store private keys in environment variables
- Use environment variables for secrets in frontend

### 2. RPC Endpoints

⚠️ **Important:**
- Public RPC endpoints are exposed in frontend code
- Anyone can see them in browser
- This is normal and expected
- Rate-limited by the RPC provider
- For production, consider using your own RPC endpoint (Alchemy, Infura)

### 3. Contract Addresses

✅ All contract addresses are public on blockchain anyway
✅ No security risk exposing them in frontend

---

## Alternative: Using Your Own RPC

For better reliability and rate limits:

### Alchemy (Recommended)

1. Sign up at [alchemy.com](https://alchemy.com)
2. Create a new app (Sepolia)
3. Get your API key
4. Update environment variable:
   ```
   VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

### Infura

1. Sign up at [infura.io](https://infura.io)
2. Create a new project
3. Get your API key
4. Update environment variable:
   ```
   VITE_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_API_KEY
   ```

---

## Support

If you run into issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test locally with `npm run build && npm run preview`
5. Check Vercel status page: [vercel-status.com](https://www.vercel-status.com/)

---

## Quick Reference

**Deployment URL:** `https://your-project-name.vercel.app`

**Environment Variables:**
```bash
VITE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
VITE_REACTIVE_RPC=https://lasna-rpc.rnk.dev/
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_REACTIVE_CHAIN_ID=5318007
VITE_SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
VITE_SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
```

**Build Settings:**
```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x (auto-detected)
```

---

**Ready to deploy!** 🚀

Choose Method 1 (Dashboard) if you prefer GUI.
Choose Method 2 (CLI) if you prefer command line.

Both methods work perfectly - pick what you're comfortable with!
