# Troubleshooting Hostaway API Authentication Errors

If you're seeing "Authentication error" on the properties endpoint, follow these steps:

## Step 1: Check Your .env File

Make sure your `.env` file in the `frontend` directory has these variables:

```env
VITE_HOSTAWAY_CLIENT_ID=your_client_id_here
VITE_HOSTAWAY_CLIENT_SECRET=your_client_secret_here
VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
```

**Important:** 
- Client ID should be a **number** (e.g., `61148`)
- Client Secret should be a **string**
- No quotes around the values
- No spaces around the `=` sign

## Step 2: Restart Your Dev Server

After changing `.env` file, **you MUST restart the dev server**:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

Vite only reads `.env` files when the server starts.

## Step 3: Check Browser Console

Open your browser's Developer Console (F12) and look for:

### ✅ Success Indicators:
```
[Hostaway API] Configuration:
  Client ID: 61148...
  Client Secret: SET
[Hostaway API] ✅ Authentication successful!
[Hostaway API] Response status: 200
```

### ❌ Error Indicators:
```
[Hostaway API] ❌ Authentication failed: 401 Unauthorized
[Hostaway API] Error Details:
  Status: 401
  Response Data: {...}
```

## Step 4: Use the Verification Tool

On the Listings page, if you see an error, click the **"Verify Authentication"** button. This will:
- Check if credentials are configured
- Test token acquisition
- Make a test API request
- Show detailed results

Or in the browser console, type:
```javascript
checkHostawayAuth()
```

## Step 5: Common Error Messages and Fixes

### "OAuth credentials not configured"
- **Fix:** Check that `.env` file exists and has the correct variable names
- **Fix:** Make sure variable names start with `VITE_`
- **Fix:** Restart dev server after adding variables

### "401 Unauthorized - Invalid Client ID or Client Secret"
- **Fix:** Verify your Client ID and Client Secret in Hostaway dashboard
- **Fix:** Make sure Client ID is a number (not a string)
- **Fix:** Check for typos or extra spaces in `.env` file
- **Fix:** Regenerate Client Secret in Hostaway dashboard if needed

### "403 Forbidden"
- **Fix:** Your API credentials may not have the required permissions
- **Fix:** Check your Hostaway account settings and API access level
- **Fix:** Make sure the scope is set to `general` (this is automatic)

### "Network error" or "Cannot reach Hostaway API"
- **Fix:** Check your internet connection
- **Fix:** Verify the API URL is correct: `https://api.hostaway.com/v1`
- **Fix:** Check if there's a firewall blocking the connection

## Step 6: Verify Credentials in Hostaway Dashboard

1. Log into your Hostaway account
2. Go to Settings → API
3. Verify your Client ID and Client Secret match what's in your `.env` file
4. Make sure API access is enabled for your account

## Step 7: Check the Network Tab

1. Open browser DevTools (F12)
2. Go to the **Network** tab
3. Try loading the listings page
4. Look for the request to `/listings`
5. Check:
   - **Request Headers** - Should have `Authorization: Bearer <token>`
   - **Response Status** - Should be `200` (not `401` or `403`)
   - **Response** - Should contain listing data

## Step 8: Test Token Acquisition

In the browser console:
```javascript
// Check current status
getHostawayAuthStatus()

// Test token acquisition
hostawayService.refreshToken().then(token => {
  console.log('Token:', token.substring(0, 30) + '...')
})
```

## Still Having Issues?

1. **Check the full console output** - Look for all `[Hostaway API]` messages
2. **Share the error details** - Copy the error message and console logs
3. **Verify credentials** - Double-check in Hostaway dashboard
4. **Try a fresh token** - Use `hostawayService.refreshToken()` in console

## Quick Checklist

- [ ] `.env` file exists in `frontend` directory
- [ ] Variables start with `VITE_`
- [ ] Client ID is a number
- [ ] Client Secret is correct
- [ ] Dev server was restarted after changing `.env`
- [ ] Browser console shows credentials are loaded
- [ ] Network tab shows `Authorization` header in requests
- [ ] Hostaway dashboard shows API access is enabled


