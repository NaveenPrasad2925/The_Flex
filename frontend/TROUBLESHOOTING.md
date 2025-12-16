# Hostaway API Authentication Troubleshooting

If you're getting "Failed to authenticate with Hostaway API" errors, follow these steps:

## 1. Check Your .env File

Make sure your `.env` file in the `frontend` directory has the correct values:

```env
VITE_HOSTAWAY_CLIENT_ID=12345
VITE_HOSTAWAY_CLIENT_SECRET=your_secret_here
VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
```

**Important:**
- `VITE_HOSTAWAY_CLIENT_ID` should be a **number** (your Hostaway account ID)
- `VITE_HOSTAWAY_CLIENT_SECRET` should be a **string** (from your Hostaway dashboard)
- No quotes around the values
- No spaces around the `=` sign
- Restart your dev server after changing `.env`

## 2. Verify Your Credentials

1. Log in to your Hostaway dashboard
2. Go to **Settings** → **API** or **Integrations** → **API**
3. Verify:
   - Your **Client ID** (Account ID) - should be a number
   - Your **Client Secret** - should be a long string
4. Make sure the API access is enabled for your account

## 3. Check Browser Console

Open your browser's developer console (F12) and look for:

- `[Hostaway API] Configuration:` - Shows if credentials are loaded
- `[Hostaway API] Requesting new access token...` - Shows token request
- Error messages with status codes and details

## 4. Common Error Codes

### 400 Bad Request
- **Cause:** Invalid request format or Client ID is not a number
- **Fix:** Ensure Client ID is a valid integer (no quotes, no letters)

### 401 Unauthorized
- **Cause:** Invalid Client ID or Client Secret
- **Fix:** 
  - Double-check your credentials in `.env`
  - Make sure there are no extra spaces
  - Verify credentials in Hostaway dashboard
  - Regenerate Client Secret if needed

### 403 Forbidden
- **Cause:** Credentials don't have API access permissions
- **Fix:** Contact Hostaway support to enable API access

### 404 Not Found
- **Cause:** Wrong token URL
- **Fix:** Verify `VITE_HOSTAWAY_TOKEN_URL` is correct:
  - Should be: `https://api.hostaway.com/v1/accessTokens`

### Network Errors (ECONNREFUSED, ENOTFOUND)
- **Cause:** Cannot reach Hostaway API
- **Fix:**
  - Check your internet connection
  - Verify the API URL is correct
  - Check if there's a firewall blocking the request
  - Try accessing the API URL directly in a browser

## 5. Test Your Credentials

You can test the authentication manually using curl:

```bash
curl -X POST https://api.hostaway.com/v1/accessTokens \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": YOUR_CLIENT_ID,
    "client_secret": "YOUR_CLIENT_SECRET",
    "scope": "general"
  }'
```

Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your actual credentials.

## 6. CORS Issues

If you see CORS errors in the console:
- The Hostaway API might require requests from a backend server
- Consider using a backend proxy instead of direct frontend calls
- Or contact Hostaway support about CORS configuration

## 7. Still Having Issues?

1. Check the browser console for detailed error messages
2. Check the Network tab to see the actual request/response
3. Verify your Hostaway account has API access enabled
4. Contact Hostaway support with:
   - Your Client ID (Account ID)
   - The error message you're seeing
   - The request details from the Network tab



