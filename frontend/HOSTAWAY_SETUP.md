# Hostaway API Integration Setup

This guide will help you set up the Hostaway API integration for the Flex Living application.

## Prerequisites

1. A Hostaway account with API access
2. OAuth credentials (Client ID and Client Secret)

## Getting Your Hostaway OAuth Credentials

1. Log in to your Hostaway account
2. Navigate to **Settings** → **API** or **Integrations** → **API**
3. Generate or copy your:
   - **Client ID** (Your Hostaway account ID - integer)
   - **Client Secret** (Can be obtained in your Hostaway dashboard)

## Environment Variables Setup

1. Open the `.env` file in the `frontend` directory
2. Replace the placeholder values with your actual Hostaway OAuth credentials:

```env
VITE_HOSTAWAY_CLIENT_ID=your_hostaway_client_id_here
VITE_HOSTAWAY_CLIENT_SECRET=your_hostaway_client_secret_here
VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
VITE_API_BASE_URL=http://localhost:3000/api
```

**Important:**
- `VITE_HOSTAWAY_CLIENT_ID` should be an integer (your Hostaway account ID)
- `VITE_HOSTAWAY_CLIENT_SECRET` is a string (your client secret from the dashboard)

## OAuth 2.0 Authentication

The Hostaway API uses OAuth 2.0 client credentials flow:

1. **Token Request**: The service automatically requests an access token using:
   - `grant_type`: `client_credentials`
   - `client_id`: Your Hostaway account ID (integer)
   - `client_secret`: Your client secret (string)
   - `scope`: `general`

2. **Token Caching**: Access tokens are automatically cached and refreshed when expired

3. **Automatic Refresh**: If a request fails with 401, the service will automatically refresh the token and retry

## Important Notes

- **Never commit the `.env` file** to version control (it's already in `.gitignore`)
- The `.env` file should be in the `frontend` directory
- After updating `.env`, restart your development server for changes to take effect
- All environment variables in Vite must be prefixed with `VITE_` to be accessible in the browser
- Access tokens are automatically managed - you don't need to handle token refresh manually

## API Endpoints Available

The `hostawayService` provides the following methods:

- `getProperties()` - Get all listings/properties
- `getProperty(id)` - Get a specific property by ID
- `getReviews()` - Get reviews
- `getReservations(params)` - Get reservations/bookings
- `getCalendar(listingId, startDate, endDate)` - Get calendar availability

## Testing the Integration

1. Make sure your `.env` file has valid credentials
2. Restart the dev server: `npm run dev`
3. Check the browser console for any authentication errors
4. The service will automatically fall back to the backend API if Hostaway credentials are not configured

## Troubleshooting

### Authentication Errors (401)
- Verify your Client ID and Client Secret are correct
- Check that the credentials are properly set in `.env`
- Ensure there are no extra spaces or quotes in the `.env` file
- Make sure `VITE_HOSTAWAY_CLIENT_ID` is a valid integer (your Hostaway account ID)
- Verify that `VITE_HOSTAWAY_CLIENT_SECRET` matches the secret from your Hostaway dashboard

### CORS Errors
- Hostaway API may require CORS configuration
- Consider using a backend proxy if direct API calls fail

### Environment Variables Not Loading
- Make sure variable names start with `VITE_`
- Restart the dev server after changing `.env`
- Check that the `.env` file is in the `frontend` directory

## Hostaway API Documentation

For more information, refer to the [Hostaway API Documentation](https://support.hostaway.com/hc/en-us/articles/360000000533-API-Documentation)

