import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import hostawayService from '../services/hostawayService'
import type { HostawayListing } from '../types/hostaway'
import ListingCard from '../components/ListingCard'
import { IconLoader2, IconAlertCircle, IconFilter, IconSortAscending } from '@tabler/icons-react'

type FilterType = 'all' | 'rating' | 'category' | 'channel' | 'time'
type SortType = 'default' | 'rating-high' | 'rating-low' | 'price-high' | 'price-low' | 'newest' | 'oldest'

const Listings = () => {
  const [searchParams] = useSearchParams()
  const [allListings, setAllListings] = useState<HostawayListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('default')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('all')
  const itemsPerPage = 12

  useEffect(() => {
    fetchAllListings()
  }, [])

  // Read URL parameters and apply filters on mount
  useEffect(() => {
    const filterType = searchParams.get('filter')
    const filterValue = searchParams.get('value')

    if (filterType && filterValue) {
      if (filterType === 'rating') {
        setActiveFilter('rating')
        setRatingFilter(filterValue)
      } else if (filterType === 'category') {
        setActiveFilter('category')
        setCategoryFilter(filterValue)
      } else if (filterType === 'channel') {
        setActiveFilter('channel')
        setChannelFilter(filterValue)
      } else if (filterType === 'time') {
        setActiveFilter('time')
        setTimeFilter(filterValue)
      }
    }
  }, [searchParams])

  const fetchAllListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('[Listings] Fetching all listings...')
      
      // First verify authentication before making the request
      const authStatus = hostawayService.getAuthStatus()
      console.log('[Listings] Auth status before request:', authStatus)
      
      if (!authStatus.hasCredentials) {
        throw new Error('Hostaway API credentials not configured. Please set VITE_HOSTAWAY_CLIENT_ID and VITE_HOSTAWAY_CLIENT_SECRET in .env file and restart the dev server.')
      }
      
      // Fetch all listings (use a large limit to get all)
      const response = await hostawayService.getProperties({
        limit: 1000, // Large limit to get all listings
        offset: 0,
      })
      
      console.log('[Listings] Response received:', response)
      
      // Hostaway API returns { result: [...], count: ... }
      if (response && response.result && Array.isArray(response.result)) {
        console.log(`Found ${response.result.length} listings`)
        setAllListings(response.result)
      } else if (Array.isArray(response)) {
        // Fallback if response is directly an array
        console.log(`Found ${response.length} listings (array format)`)
        setAllListings(response)
      } else {
        console.warn('Unexpected response format:', response)
        setAllListings([])
        if (response && Object.keys(response).length === 0) {
          setError('No listings found. Please check your Hostaway account has active listings.')
        }
      }
    } catch (err) {
      console.error('[Listings] Error fetching listings:', err)
      let errorMessage = 'Failed to load listings'
      
      if (err instanceof Error) {
        errorMessage = err.message
        // Provide more helpful error messages
        if (err.message.includes('401') || err.message.includes('authentication') || err.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed. Please check your Hostaway API credentials in .env file and restart the dev server.'
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'Access forbidden. Your API token may not have the required permissions.'
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          errorMessage = 'API endpoint not found. Please check the Hostaway API URL in .env file.'
        } else if (err.message.includes('network') || err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
          errorMessage = 'Network error. Please check your internet connection and API endpoint.'
        } else if (err.message.includes('credentials not configured')) {
          errorMessage = err.message
        }
      }
      
      // Try to get more details from axios error
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any
        if (axiosError.response) {
          console.error('[Listings] API Error Details:', {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
            headers: axiosError.response.headers,
          })
          
          if (axiosError.response.status === 401) {
            errorMessage = 'Authentication failed (401). Please verify your Client ID and Client Secret in .env file are correct.'
          } else if (axiosError.response.status === 403) {
            errorMessage = 'Access forbidden (403). Your API credentials may not have the required permissions.'
          }
        }
      }
      
      setError(errorMessage)
      setAllListings([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get channel from listing
  const getListingChannel = (listing: HostawayListing): string => {
    if (listing.airbnbListingUrl) return 'airbnb'
    if (listing.vrboListingUrl) return 'vrbo'
    if (listing.bookingEngineUrls && listing.bookingEngineUrls.length > 0) return 'booking-engine'
    if (listing.bookingcomPropertyName) return 'booking.com'
    return 'other'
  }

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...allListings]

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter)
      filtered = filtered.filter((listing) => {
        const rating = listing.averageReviewRating || listing.starRating
        if (!rating) return false
        // Convert starRating (0-5) to match averageReviewRating scale if needed
        const normalizedRating = listing.averageReviewRating || (listing.starRating ? listing.starRating * 2 : 0)
        return normalizedRating >= minRating
      })
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((listing) => {
        if (categoryFilter === 'entire_home') return listing.roomType === 'entire_home'
        if (categoryFilter === 'private_room') return listing.roomType === 'private_room'
        if (categoryFilter === 'shared_room') return listing.roomType === 'shared_room'
        return true
      })
    }

    // Apply channel filter
    if (channelFilter !== 'all') {
      filtered = filtered.filter((listing) => getListingChannel(listing) === channelFilter)
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter((listing) => {
        if (!listing.latestActivityOn) return false
        const activityDate = new Date(listing.latestActivityOn)
        const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (timeFilter === 'today') return daysDiff === 0
        if (timeFilter === 'week') return daysDiff <= 7
        if (timeFilter === 'month') return daysDiff <= 30
        if (timeFilter === 'year') return daysDiff <= 365
        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating-high':
          const ratingA = a.averageReviewRating || (a.starRating ? a.starRating * 2 : 0)
          const ratingB = b.averageReviewRating || (b.starRating ? b.starRating * 2 : 0)
          return ratingB - ratingA
        case 'rating-low':
          const ratingALow = a.averageReviewRating || (a.starRating ? a.starRating * 2 : 0)
          const ratingBLow = b.averageReviewRating || (b.starRating ? b.starRating * 2 : 0)
          return ratingALow - ratingBLow
        case 'price-high':
          return b.price - a.price
        case 'price-low':
          return a.price - b.price
        case 'newest':
          const dateA = a.latestActivityOn ? new Date(a.latestActivityOn).getTime() : 0
          const dateB = b.latestActivityOn ? new Date(b.latestActivityOn).getTime() : 0
          return dateB - dateA
        case 'oldest':
          const dateAOld = a.latestActivityOn ? new Date(a.latestActivityOn).getTime() : 0
          const dateBOld = b.latestActivityOn ? new Date(b.latestActivityOn).getTime() : 0
          return dateAOld - dateBOld
        default:
          return 0
      }
    })

    return filtered
  }, [allListings, ratingFilter, categoryFilter, channelFilter, timeFilter, sortBy])

  // Paginate filtered results
  const paginatedListings = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage
    return filteredAndSortedListings.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedListings, page])

  const totalPages = Math.ceil(filteredAndSortedListings.length / itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [ratingFilter, categoryFilter, channelFilter, timeFilter, sortBy])

  const handleVerifyAuth = async () => {
    try {
      console.log('[Listings] Verifying authentication...')
      const verification = await hostawayService.verifyAuthentication()
      console.log('[Listings] Verification result:', verification)
      
      if (verification.isAuthenticated) {
        alert('✅ Authentication is working! Try refreshing the listings.')
        fetchAllListings()
      } else {
        alert(`❌ Authentication failed: ${verification.error}\n\nCheck the browser console for more details.`)
      }
    } catch (err) {
      console.error('[Listings] Verification error:', err)
      alert('Error verifying authentication. Check the browser console for details.')
    }
  }

  if (loading && allListings.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error && allListings.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <IconAlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Listings</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={fetchAllListings}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleVerifyAuth}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Verify Authentication
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                💡 <strong>Tip:</strong> Open the browser console (F12) to see detailed error messages and authentication logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Property Listings</h1>
          <p className="text-gray-600">
            {filteredAndSortedListings.length > 0 
              ? `Showing ${paginatedListings.length} of ${filteredAndSortedListings.length} properties` 
              : 'No properties found'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 space-y-4">
          {/* Filter Type Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setActiveFilter('rating')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeFilter === 'rating'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconFilter size={18} className="inline mr-1" />
              Rating
            </button>
            <button
              onClick={() => setActiveFilter('category')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeFilter === 'category'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconFilter size={18} className="inline mr-1" />
              Category
            </button>
            <button
              onClick={() => setActiveFilter('channel')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeFilter === 'channel'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconFilter size={18} className="inline mr-1" />
              Channel
            </button>
            <button
              onClick={() => setActiveFilter('time')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeFilter === 'time'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconFilter size={18} className="inline mr-1" />
              Time
            </button>
          </div>

          {/* Filter Options */}
          {activeFilter === 'rating' && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => setRatingFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ratingFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Ratings
              </button>
              <button
                onClick={() => setRatingFilter('8')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ratingFilter === '8'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                8.0+
              </button>
              <button
                onClick={() => setRatingFilter('7')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ratingFilter === '7'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                7.0+
              </button>
              <button
                onClick={() => setRatingFilter('6')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ratingFilter === '6'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                6.0+
              </button>
              <button
                onClick={() => setRatingFilter('5')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ratingFilter === '5'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                5.0+
              </button>
            </div>
          )}

          {activeFilter === 'category' && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setCategoryFilter('entire_home')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categoryFilter === 'entire_home'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Entire Home
              </button>
              <button
                onClick={() => setCategoryFilter('private_room')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categoryFilter === 'private_room'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Private Room
              </button>
              <button
                onClick={() => setCategoryFilter('shared_room')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categoryFilter === 'shared_room'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Shared Room
              </button>
            </div>
          )}

          {activeFilter === 'channel' && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  channelFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Channels
              </button>
              <button
                onClick={() => setChannelFilter('airbnb')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  channelFilter === 'airbnb'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Airbnb
              </button>
              <button
                onClick={() => setChannelFilter('vrbo')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  channelFilter === 'vrbo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                VRBO
              </button>
              <button
                onClick={() => setChannelFilter('booking-engine')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  channelFilter === 'booking-engine'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Booking Engine
              </button>
              <button
                onClick={() => setChannelFilter('booking.com')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  channelFilter === 'booking.com'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Booking.com
              </button>
            </div>
          )}

          {activeFilter === 'time' && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeFilter('today')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter('year')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Year
              </button>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <IconSortAscending size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {filteredAndSortedListings.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No listings available at the moment.</p>
            <p className="text-gray-500 text-sm mb-4">
              This could mean:
            </p>
            <ul className="text-gray-500 text-sm text-left max-w-md mx-auto space-y-2">
              <li>• Your Hostaway account has no active listings</li>
              <li>• Listings are archived or inactive</li>
              <li>• API credentials need to be configured in .env file</li>
            </ul>
            <button
              onClick={fetchAllListings}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Listings
