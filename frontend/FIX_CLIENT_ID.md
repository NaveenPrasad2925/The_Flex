# Fixing "Client ID should be a number" Error

If you're seeing the error: **"Bad Request - Check your Client ID and Client Secret format. Client ID should be a number."**

## Quick Fix:

1. **Open your `.env` file** in the `frontend` directory

2. **Make sure your Client ID is a number WITHOUT quotes:**
   ```env
   # ✅ CORRECT
   VITE_HOSTAWAY_CLIENT_ID=61148
   
   # ❌ WRONG - Don't use quotes
   VITE_HOSTAWAY_CLIENT_ID="61148"
   VITE_HOSTAWAY_CLIENT_ID='61148'
   
   # ❌ WRONG - No spaces
   VITE_HOSTAWAY_CLIENT_ID = 61148
   VITE_HOSTAWAY_CLIENT_ID= 61148
   VITE_HOSTAWAY_CLIENT_ID=61148 
   ```

3. **Your `.env` file should look like this:**
   ```env
   VITE_HOSTAWAY_CLIENT_ID=61148
   VITE_HOSTAWAY_CLIENT_SECRET=your_secret_here
   VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
   VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
   ```

4. **Restart your dev server:**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Verify It's Working:

1. Open browser console (F12)
2. Look for: `[Hostaway API] Client ID (parsed): 61148 (type: number)`
3. If you see `(type: string)`, there's still an issue with the .env file

## Common Issues:

- **Quotes around the number** - Remove them
- **Spaces before/after the = sign** - Remove them
- **Spaces at the end of the value** - Remove them
- **Not restarting dev server** - Always restart after changing .env


