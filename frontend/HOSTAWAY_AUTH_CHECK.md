# How to Check Hostaway API Authentication

This guide shows you how to verify that your Hostaway API authentication is working correctly.

## Method 1: Browser Console (Easiest)

1. Open your browser's Developer Console (F12 or Right-click → Inspect → Console tab)
2. Type one of these commands:

### Check Authentication Status (Quick Check)
```javascript
getHostawayAuthStatus()
```
This shows:
- Whether credentials are configured
- If you have a valid cached token
- When the token expires

### Verify Authentication (Full Test)
```javascript
checkHostawayAuth()
```
This will:
- Check if credentials are configured
- Get/verify your access token
- Make a test API request to verify authentication works
- Show detailed results

## Method 2: Programmatic Check

You can also check authentication programmatically in your code:

```typescript
import hostawayService from './services/hostawayService'

// Quick status check (no API call)
const status = hostawayService.getAuthStatus()
console.log('Auth Status:', status)

// Full verification (makes test API call)
const verification = await hostawayService.verifyAuthentication()
if (verification.isAuthenticated) {
  console.log('✅ Authentication working!')
} else {
  console.error('❌ Authentication failed:', verification.error)
}
```

## Method 3: Check Console Logs

When you make any API request, the console will show:

### Successful Authentication:
```
[Hostaway API] ✅ Authentication successful!
[Hostaway API] Request: GET /listings
[Hostaway API] Response status: 200
```

### Failed Authentication:
```
[Hostaway API] ❌ Authentication failed: 401 Unauthorized
[Hostaway API] Please check your OAuth credentials in .env file
```

## What to Look For

### ✅ Success Indicators:
- `✅ Authentication successful!` in console
- Response status: `200`
- Token expires in: `X seconds` (shows valid token)
- `testRequestSuccess: true` in verification result

### ❌ Failure Indicators:
- `❌ Authentication failed: 401 Unauthorized`
- `❌ Authentication failed: 403 Forbidden`
- `testRequestSuccess: false` in verification result
- Error messages about invalid credentials

## Common Issues

### 1. "OAuth credentials not configured"
- **Fix**: Make sure `.env` file has `VITE_HOSTAWAY_CLIENT_ID` and `VITE_HOSTAWAY_CLIENT_SECRET`
- **Note**: Restart dev server after changing `.env`

### 2. "401 Unauthorized"
- **Fix**: Check that Client ID and Client Secret are correct
- **Fix**: Verify credentials in Hostaway dashboard

### 3. "403 Forbidden"
- **Fix**: Your token may not have required permissions
- **Fix**: Check API scope in Hostaway dashboard

### 4. "Token expired"
- **Fix**: Token will auto-refresh, but you can manually refresh:
  ```javascript
  await hostawayService.refreshToken()
  ```

## Example Output

### Successful Verification:
```
🔍 Checking Hostaway API Authentication...
==================================================
[Hostaway API] ✅ Valid token found
[Hostaway API] Token expires in: 3540 seconds
[Hostaway API] ✅ Successfully obtained access token
[Hostaway API] Testing authentication with a small listings request...
[Hostaway API] ✅ Authentication verified! API request successful
[Hostaway API] Response status: 200
==================================================
📊 Authentication Status: {
  isAuthenticated: true,
  hasCredentials: true,
  hasValidToken: true,
  tokenExpiresIn: 3540,
  testRequestSuccess: true
}
✅ Authentication is working correctly!
```

### Failed Verification:
```
🔍 Checking Hostaway API Authentication...
==================================================
[Hostaway API] ❌ Failed to get access token: Unauthorized - Invalid Client ID or Client Secret
==================================================
📊 Authentication Status: {
  isAuthenticated: false,
  hasCredentials: true,
  hasValidToken: false,
  testRequestSuccess: false,
  error: "Unauthorized - Invalid Client ID or Client Secret"
}
❌ Authentication failed: Unauthorized - Invalid Client ID or Client Secret
```

## Tips

1. **Always check console logs** - They provide detailed information about authentication
2. **Use `checkHostawayAuth()`** - This is the most comprehensive check
3. **Restart dev server** - After changing `.env` file, restart to load new values
4. **Check token expiration** - Tokens expire after 1 hour, but auto-refresh
5. **Network tab** - Check browser Network tab to see actual HTTP requests and headers


