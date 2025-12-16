import axios from 'axios'
import type { HostawayListing, HostawayListingsResponse } from '../types/hostaway'

// Get environment variables with proper TypeScript typing
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`)
  }
  return value || defaultValue || ''
}

const HOSTAWAY_CLIENT_ID = getEnvVar('VITE_HOSTAWAY_CLIENT_ID')
const HOSTAWAY_CLIENT_SECRET = getEnvVar('VITE_HOSTAWAY_CLIENT_SECRET')

const HOSTAWAY_API_BASE_URL = 'https://api.hostaway.com/v1'
const HOSTAWAY_TOKEN_URL = `${HOSTAWAY_API_BASE_URL}/accessTokens`
const HOSTAWAY_BASE_URL = HOSTAWAY_API_BASE_URL

// Log configuration on module load (for debugging) - only in development
if (import.meta.env.DEV) {
  console.log('[Hostaway API] Configuration:')
  console.log('  Client ID:', HOSTAWAY_CLIENT_ID ? `${HOSTAWAY_CLIENT_ID.substring(0, 5)}...` : 'NOT SET')
  console.log('  Client Secret:', HOSTAWAY_CLIENT_SECRET ? 'SET' : 'NOT SET')
  console.log('  Token URL:', HOSTAWAY_TOKEN_URL)
  console.log('  Base URL:', HOSTAWAY_BASE_URL)
}

// Token storage
interface TokenData {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
}

let cachedToken: TokenData | null = null

// Create axios instance for Hostaway API
const hostawayApi = axios.create({
  baseURL: HOSTAWAY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * Get OAuth access token directly from Hostaway API
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    console.log('[Hostaway API] Using cached access token')
    return cachedToken.access_token
  }
  
  if (cachedToken) {
    console.log('[Hostaway API] Cached token expired, requesting new token from Hostaway...')
  }

  if (!HOSTAWAY_CLIENT_ID || !HOSTAWAY_CLIENT_SECRET) {
    throw new Error('Hostaway Client ID/Secret missing. Set VITE_HOSTAWAY_CLIENT_ID and VITE_HOSTAWAY_CLIENT_SECRET.')
  }

  try {
    console.log('[Hostaway API] Requesting new access token directly from Hostaway...')
    console.log('[Hostaway API] Token URL:', HOSTAWAY_TOKEN_URL)
    
    // Hostaway OAuth token endpoint (Client Credentials Grant)
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: HOSTAWAY_CLIENT_ID,
      client_secret: HOSTAWAY_CLIENT_SECRET,
      scope: 'general',
    })

    const response = await axios.post(
      HOSTAWAY_TOKEN_URL,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    )
    
    
    console.log('[Hostaway API] Access token received successfully')
    console.log('[Hostaway API] Response status:', response.status)
    console.log('[Hostaway API] Response data:', {
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
      has_access_token: !!response.data.access_token,
    })

    // Validate response structure matches Hostaway API specification
    // Response should contain:
    // - token_type: string (always "Bearer")
    // - expires_in: int (TTL of the access token in seconds)
    // - access_token: string (JWT signed with Authorization server's private key)
    if (!response.data.access_token) {
      throw new Error('Invalid response from Hostaway API: missing access_token')
    }
    
    if (!response.data.expires_in || typeof response.data.expires_in !== 'number') {
      console.warn('[Hostaway API] expires_in not provided or invalid, defaulting to 3600 seconds')
    }

    const expiresIn = response.data.expires_in || 3600 // Default to 1 hour if not provided
    const tokenData: TokenData = {
      access_token: response.data.access_token, // Required: string - JWT signed with Authorization server's private key
      token_type: response.data.token_type || 'Bearer', // string - Always "Bearer" according to Hostaway API spec
      expires_in: expiresIn, // int - TTL of the access token in seconds
      expires_at: Date.now() + expiresIn * 1000 - 60000, // Subtract 1 minute for safety margin
    }
    
    console.log('[Hostaway API] Token data parsed:', {
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      access_token_length: tokenData.access_token.length,
      expires_at: new Date(tokenData.expires_at).toISOString(),
    })

    cachedToken = tokenData
    return tokenData.access_token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      const responseData = error.response?.data
      const requestUrl = error.config?.url
      
      console.error('[Hostaway API] Authentication Error Details:')
      console.error('  Status:', status)
      console.error('  Status Text:', statusText)
      console.error('  URL:', requestUrl)
      console.error('  Response Data:', responseData)
      console.error('  Request Headers:', error.config?.headers)
      
      let errorMessage = 'Failed to authenticate with Hostaway API'
      
      if (status === 400) {
        // Provide more specific error message for 400 errors
        if (responseData?.error_description) {
          errorMessage = `Bad Request (400): ${responseData.error_description}`
        } else if (responseData?.error) {
          errorMessage = `Bad Request (400): ${responseData.error}. Check your Client ID and Client Secret format.`
        } else {
          errorMessage = 'Bad Request (400) - Check your Client ID and Client Secret format. Client ID should be a number (integer), not a string. Make sure there are no quotes or spaces in your .env file.'
        }
        console.error('[Hostaway API] Request that failed:')
        console.error('  URL:', requestUrl)
        console.error('  Method:', error.config?.method)
        console.error('  Base URL:', error.config?.baseURL)
        console.error('  Full URL:', error.config?.url ? `${error.config.baseURL || ''}${error.config.url}` : 'N/A')
        try {
          const requestData = error.config?.data 
            ? (typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data)
            : 'N/A'
          console.error('  Request Body:', requestData)
        } catch (e) {
          console.error('  Request Body (raw):', error.config?.data)
        }
        console.error('  Request Headers:', error.config?.headers)
      } else if (status === 401) {
        errorMessage = 'Unauthorized - Invalid Client ID or Client Secret. Please verify your credentials in .env file.'
      } else if (status === 403) {
        errorMessage = 'Forbidden - Your credentials do not have permission to access the API.'
      } else if (status === 404) {
        errorMessage = `Not Found - Token endpoint not found. Check if the URL is correct: ${HOSTAWAY_TOKEN_URL}`
      } else if (status === 500) {
        errorMessage = 'Server Error - Hostaway API server error. Please try again later.'
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage = `Network Error - Cannot reach Hostaway API. Check your internet connection and the API URL: ${HOSTAWAY_TOKEN_URL}`
      } else if (responseData?.error) {
        errorMessage = `Hostaway API Error: ${responseData.error}${responseData.error_description ? ` - ${responseData.error_description}` : ''}`
      } else if (error.message) {
        errorMessage = `Authentication Error: ${error.message}`
      }
      
      throw new Error(errorMessage)
    }
    throw error
  }
}

// Add request interceptor - we cache and attach token when available
hostawayApi.interceptors.request.use(
  async (config) => {
    // Attach cached token if available
    if (cachedToken && cachedToken.expires_at > Date.now()) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `${cachedToken.token_type} ${cachedToken.access_token}`
      console.log(`[Hostaway API] Using cached token for ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
hostawayApi.interceptors.response.use(
  (response) => {
    // Log successful authentication on first successful request
    if (response.config && !response.config.headers?.['X-Auth-Logged']) {
      response.config.headers = response.config.headers || {}
      response.config.headers['X-Auth-Logged'] = 'true'
      console.log('[Hostaway API] ✅ Authentication successful!')
      console.log(`[Hostaway API] Request: ${response.config.method?.toUpperCase()} ${response.config.url}`)
      console.log(`[Hostaway API] Response status: ${response.status}`)
      if (response.headers['authorization'] || response.config.headers['Authorization']) {
        const authHeader = response.config.headers['Authorization'] as string
        console.log(`[Hostaway API] Token used: ${authHeader.substring(0, 30)}...`)
      }
    }
    return response
  },
  async (error) => {
    // If we get a 401, try to refresh the token once
    if (error.response?.status === 401 && HOSTAWAY_CLIENT_ID && HOSTAWAY_CLIENT_SECRET) {
      console.warn('[Hostaway API] ⚠️ Received 401 Unauthorized, attempting token refresh...')
      // Clear cached token and retry
      cachedToken = null
      const originalRequest = error.config
      
      if (!originalRequest._retry && originalRequest) {
        originalRequest._retry = true
        try {
          const accessToken = await getAccessToken()
          // After getAccessToken(), cachedToken should be set
          const tokenType = (cachedToken as TokenData | null)?.token_type || 'Bearer'
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['Authorization'] = `${tokenType} ${accessToken}`
          console.log('[Hostaway API] 🔄 Retrying request with new token...')
          return hostawayApi(originalRequest)
        } catch (tokenError) {
          console.error('[Hostaway API] ❌ Failed to refresh token:', tokenError)
          return Promise.reject(error)
        }
      }
    }
    
    if (error.response?.status === 401) {
      console.error('[Hostaway API] ❌ Authentication failed: 401 Unauthorized')
      console.error('[Hostaway API] Please check your OAuth credentials in .env file')
      console.error('[Hostaway API] Response data:', error.response?.data)
    } else if (error.response?.status === 403) {
      console.error('[Hostaway API] ❌ Authentication failed: 403 Forbidden')
      console.error('[Hostaway API] Your token may not have the required permissions')
      console.error('[Hostaway API] Response data:', error.response?.data)
    }
    
    return Promise.reject(error)
  }
)

const hostawayService = {
  /**
   * Get all listings/properties from Hostaway
   * @param params Optional query parameters (limit, offset, etc.)
   */
  async getProperties(params?: { limit?: number; offset?: number; [key: string]: any }): Promise<HostawayListingsResponse> {
    try {
      console.log(`[Hostaway API] Fetching listings from Hostaway`, params)
      console.log(`[Hostaway API] Base URL: ${HOSTAWAY_BASE_URL}/listings`)
      
      const response = await hostawayApi.get('/listings', { params })
      console.log('[Hostaway API] Listings response received:', response.data)
      console.log('[Hostaway API] Response status:', response.status)
      
      // Handle different response structures
      const data = response.data
      
      // If response has 'result' property (standard Hostaway format)
      if (data && data.result && Array.isArray(data.result)) {
        return {
          result: data.result,
          count: data.count,
          limit: data.limit,
          offset: data.offset,
        }
      }
      
      // If response is directly an array
      if (Array.isArray(data)) {
        return {
          result: data,
          count: data.length,
        }
      }
      
      // If response has listings in a different structure
      if (data && data.listings && Array.isArray(data.listings)) {
        return {
          result: data.listings,
          count: data.count || data.listings.length,
        }
      }
      
      // Empty result
      return {
        result: [],
        count: 0,
      }
    } catch (error) {
      console.error('[Hostaway API] Error fetching properties:', error)
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const statusText = error.response?.statusText
        const responseData = error.response?.data
        
        console.error('[Hostaway API] Error Details:')
        console.error('  Status:', status)
        console.error('  Status Text:', statusText)
        console.error('  Response Data:', responseData)
        console.error('  Request URL:', error.config?.url)
        console.error('  Request Method:', error.config?.method)
        console.error('  Request Headers:', error.config?.headers)
        
        // Provide more specific error messages
        if (status === 401) {
          throw new Error('Authentication failed (401 Unauthorized). Please verify your Hostaway Client ID and Client Secret in .env file are correct and restart the dev server.')
        } else if (status === 403) {
          throw new Error('Access forbidden (403). Your API credentials may not have the required permissions. Please check your Hostaway account settings.')
        } else if (status === 404) {
          throw new Error(`API endpoint not found (404). Check if the URL is correct: ${error.config?.url}`)
        } else if (status === 500) {
          throw new Error('Hostaway API server error (500). Please try again later.')
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new Error(`Network error: Cannot reach Hostaway API. Check your internet connection and the API URL: ${HOSTAWAY_BASE_URL}`)
        } else if (responseData?.error) {
          throw new Error(`Hostaway API Error: ${responseData.error}${responseData.error_description ? ` - ${responseData.error_description}` : ''}`)
        } else {
          throw new Error(`Failed to fetch properties: ${statusText || error.message || 'Unknown error'}`)
        }
      }
      throw error
    }
  },

  /**
   * Get a specific property/listing by ID from Hostaway
   */
  async getProperty(id: string | number): Promise<HostawayListing> {
    try {
      if (!HOSTAWAY_CLIENT_ID || !HOSTAWAY_CLIENT_SECRET) {
        throw new Error('Hostaway OAuth credentials not configured')
      }
      console.log(`[Hostaway API] Fetching property ${id} with access token`)
      const response = await hostawayApi.get<{ result: HostawayListing }>(`/listings/${id}`)
      return response.data.result
    } catch (error) {
      console.error('Error fetching property:', error)
      throw error
    }
  },

  /**
   * Get reviews from Hostaway
   */
  async getReviews() {
    try {
      if (!HOSTAWAY_CLIENT_ID || !HOSTAWAY_CLIENT_SECRET) {
        throw new Error('Hostaway OAuth credentials not configured')
      }
      console.log('[Hostaway API] Fetching reviews with access token')
      const response = await hostawayApi.get('/reviews')
      return response.data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },

  /**
   * Get reservations/bookings from Hostaway
   */
  async getReservations(params?: { limit?: number; offset?: number; listingId?: number }) {
    try {
      if (HOSTAWAY_CLIENT_ID && HOSTAWAY_CLIENT_SECRET) {
        console.log('[Hostaway API] Fetching reservations with access token', params)
        const response = await hostawayApi.get('/reservations', { params })
        return response.data
      }
      throw new Error('Hostaway OAuth credentials not configured')
    } catch (error) {
      console.error('Error fetching reservations:', error)
      throw error
    }
  },

  /**
   * Get calendar availability from Hostaway
   */
  async getCalendar(listingId: string, startDate?: string, endDate?: string) {
    try {
      if (HOSTAWAY_CLIENT_ID && HOSTAWAY_CLIENT_SECRET) {
        const params: Record<string, string> = {}
        if (startDate) params.startDate = startDate
        if (endDate) params.endDate = endDate
        console.log(`[Hostaway API] Fetching calendar for listing ${listingId} with access token`, params)
        const response = await hostawayApi.get(`/listings/${listingId}/calendar`, { params })
        return response.data
      }
      throw new Error('Hostaway OAuth credentials not configured')
    } catch (error) {
      console.error('Error fetching calendar:', error)
      throw error
    }
  },

  /**
   * Manually refresh the access token (useful for testing)
   */
  async refreshToken(): Promise<string> {
    cachedToken = null
    return await getAccessToken()
  },

  /**
   * Verify authentication status by checking token and making a test request
   * @returns Object with authentication status and details
   */
  async verifyAuthentication(): Promise<{
    isAuthenticated: boolean
    hasCredentials: boolean
    hasValidToken: boolean
    tokenExpiresAt?: number
    tokenExpiresIn?: number
    testRequestSuccess?: boolean
    error?: string
  }> {
    const result = {
      isAuthenticated: false,
      hasCredentials: !!(HOSTAWAY_CLIENT_ID && HOSTAWAY_CLIENT_SECRET),
      hasValidToken: false,
      tokenExpiresAt: undefined as number | undefined,
      tokenExpiresIn: undefined as number | undefined,
      testRequestSuccess: undefined as boolean | undefined,
      error: undefined as string | undefined,
    }

    try {
      // Check if credentials are configured
      if (!result.hasCredentials) {
        result.error = 'OAuth credentials not configured in .env file'
        return result
      }

      // Check if we have a valid token
      if (cachedToken && cachedToken.expires_at > Date.now()) {
        result.hasValidToken = true
        result.tokenExpiresAt = cachedToken.expires_at
        result.tokenExpiresIn = Math.floor((cachedToken.expires_at - Date.now()) / 1000)
        console.log('[Hostaway API] ✅ Valid token found')
        console.log(`[Hostaway API] Token expires in: ${result.tokenExpiresIn} seconds`)
      } else {
        console.log('[Hostaway API] ⚠️ No valid token cached, will request new token')
      }

      // Try to get a token (will use cached if valid, or request new one)
      try {
        const token = await getAccessToken()
        if (token) {
          result.hasValidToken = true
          if (cachedToken) {
            result.tokenExpiresAt = cachedToken.expires_at
            result.tokenExpiresIn = Math.floor((cachedToken.expires_at - Date.now()) / 1000)
          }
          console.log('[Hostaway API] ✅ Successfully obtained access token')
        }
      } catch (tokenError) {
        result.error = tokenError instanceof Error ? tokenError.message : 'Failed to get access token'
        console.error('[Hostaway API] ❌ Failed to get access token:', tokenError)
        return result
      }

      // Make a test request to verify the token works
      try {
        console.log('[Hostaway API] Testing authentication with a small listings request...')
        const testResponse = await hostawayApi.get('/listings', { 
          params: { limit: 1 },
          validateStatus: (status) => status < 500, // Don't throw on 401/403
        })
        
        if (testResponse.status === 200) {
          result.testRequestSuccess = true
          result.isAuthenticated = true
          console.log('[Hostaway API] ✅ Authentication verified! API request successful')
          console.log(`[Hostaway API] Response status: ${testResponse.status}`)
          console.log(`[Hostaway API] Response headers:`, testResponse.headers)
        } else if (testResponse.status === 401) {
          result.testRequestSuccess = false
          result.error = 'Unauthorized - Token is invalid or expired'
          console.error('[Hostaway API] ❌ Authentication failed: 401 Unauthorized')
          console.error('[Hostaway API] Response:', testResponse.data)
        } else if (testResponse.status === 403) {
          result.testRequestSuccess = false
          result.error = 'Forbidden - Token does not have required permissions'
          console.error('[Hostaway API] ❌ Authentication failed: 403 Forbidden')
          console.error('[Hostaway API] Response:', testResponse.data)
        } else {
          result.testRequestSuccess = false
          result.error = `Unexpected status code: ${testResponse.status}`
          console.warn('[Hostaway API] ⚠️ Unexpected response status:', testResponse.status)
        }
      } catch (testError) {
        if (axios.isAxiosError(testError)) {
          const status = testError.response?.status
          if (status === 401) {
            result.testRequestSuccess = false
            result.error = 'Unauthorized - Token is invalid or expired'
            console.error('[Hostaway API] ❌ Authentication failed: 401 Unauthorized')
          } else if (status === 403) {
            result.testRequestSuccess = false
            result.error = 'Forbidden - Token does not have required permissions'
            console.error('[Hostaway API] ❌ Authentication failed: 403 Forbidden')
          } else {
            result.testRequestSuccess = false
            result.error = `Test request failed: ${testError.message}`
            console.error('[Hostaway API] ❌ Test request failed:', testError)
          }
        } else {
          result.testRequestSuccess = false
          result.error = `Test request error: ${testError instanceof Error ? testError.message : 'Unknown error'}`
          console.error('[Hostaway API] ❌ Test request error:', testError)
        }
      }

      return result
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error during verification'
      console.error('[Hostaway API] ❌ Verification error:', error)
      return result
    }
  },

  /**
   * Get current authentication status (without making a test request)
   * @returns Object with current token status
   */
  getAuthStatus(): {
    hasCredentials: boolean
    hasValidToken: boolean
    tokenExpiresAt?: number
    tokenExpiresIn?: number
    tokenType?: string
  } {
    return {
      hasCredentials: !!(HOSTAWAY_CLIENT_ID && HOSTAWAY_CLIENT_SECRET),
      hasValidToken: !!(cachedToken && cachedToken.expires_at > Date.now()),
      tokenExpiresAt: cachedToken?.expires_at,
      tokenExpiresIn: cachedToken && cachedToken.expires_at > Date.now()
        ? Math.floor((cachedToken.expires_at - Date.now()) / 1000)
        : undefined,
      tokenType: cachedToken?.token_type,
    }
  },
}

export default hostawayService

// Expose verification function to window for easy testing in browser console
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).checkHostawayAuth = async () => {
    console.log('🔍 Checking Hostaway API Authentication...')
    console.log('='.repeat(50))
    const status = await hostawayService.verifyAuthentication()
    console.log('='.repeat(50))
    console.log('📊 Authentication Status:', status)
    console.log('')
    if (status.isAuthenticated) {
      console.log('✅ Authentication is working correctly!')
    } else {
      console.log('❌ Authentication failed:', status.error)
    }
    return status
  }
  
  (window as any).getHostawayAuthStatus = () => {
    const status = hostawayService.getAuthStatus()
    console.log('📊 Current Auth Status:', status)
    return status
  }
  
  console.log('💡 Hostaway API Debug Helpers:')
  console.log('   - checkHostawayAuth() - Verify authentication with a test request')
  console.log('   - getHostawayAuthStatus() - Get current token status (no API call)')
}
