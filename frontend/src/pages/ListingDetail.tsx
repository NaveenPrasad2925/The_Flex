import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import hostawayService from '../services/hostawayService'
import type { HostawayListing } from '../types/hostaway'
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconUsers, 
  IconBed, 
  IconBath, 
  IconStar,
  IconLoader2,
  IconAlertCircle,
  IconWifi,
  IconHome,
  IconCalendar,
  IconShield
} from '@tabler/icons-react'

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<HostawayListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchListing()
    }
  }, [id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await hostawayService.getProperty(id!)
      setListing(data)
    } catch (err) {
      console.error('Error fetching listing:', err)
      setError(err instanceof Error ? err.message : 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/listings" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <IconArrowLeft size={20} className="mr-2" />
            Back to Listings
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <IconAlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Listing</h2>
              <p className="text-red-600">{error || 'Listing not found'}</p>
              <button
                onClick={fetchListing}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const images = listing.listingImages && listing.listingImages.length > 0
    ? listing.listingImages
    : [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', id: 0 }]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/listings" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <IconArrowLeft size={20} className="mr-2" />
          Back to Listings
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{listing.name}</h1>
          {(listing.city || listing.state || listing.country) && (
            <div className="flex items-center text-gray-600">
              <IconMapPin size={18} className="mr-2" />
              <span>{[listing.city, listing.state, listing.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2">
              <img
                src={images[selectedImageIndex]?.url || images[0].url}
                alt={listing.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'
                }}
              />
            </div>
            {images.slice(0, 4).map((image, index) => (
              <div
                key={image.id || index}
                className={`cursor-pointer ${index === selectedImageIndex ? 'ring-4 ring-blue-500' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={`${listing.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About this place</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.personCapacity && (
                  <div className="flex items-center gap-2">
                    <IconUsers size={20} className="text-gray-600" />
                    <span className="text-gray-700">{listing.personCapacity} guests</span>
                  </div>
                )}
                {listing.bedroomsNumber && (
                  <div className="flex items-center gap-2">
                    <IconBed size={20} className="text-gray-600" />
                    <span className="text-gray-700">{listing.bedroomsNumber} bedrooms</span>
                  </div>
                )}
                {listing.bedsNumber && (
                  <div className="flex items-center gap-2">
                    <IconBed size={20} className="text-gray-600" />
                    <span className="text-gray-700">{listing.bedsNumber} beds</span>
                  </div>
                )}
                {listing.bathroomsNumber && (
                  <div className="flex items-center gap-2">
                    <IconBath size={20} className="text-gray-600" />
                    <span className="text-gray-700">{listing.bathroomsNumber} bathrooms</span>
                  </div>
                )}
                {listing.roomType && (
                  <div className="flex items-center gap-2">
                    <IconHome size={20} className="text-gray-600" />
                    <span className="text-gray-700 capitalize">{listing.roomType.replace('_', ' ')}</span>
                  </div>
                )}
                {listing.squareMeters && (
                  <div className="flex items-center gap-2">
                    <IconHome size={20} className="text-gray-600" />
                    <span className="text-gray-700">{listing.squareMeters} m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {listing.listingAmenities && listing.listingAmenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.listingAmenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <IconWifi size={18} className="text-gray-600" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {listing.houseRules && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">House Rules</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.houseRules}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {formatPrice(listing.price, listing.currencyCode)}
                  <span className="text-lg font-normal text-gray-600"> / night</span>
                </div>
                {listing.averageReviewRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <IconStar size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{listing.averageReviewRating.toFixed(1)}</span>
                    <span className="text-gray-600">/ 10</span>
                  </div>
                )}
              </div>

              {/* Booking Info */}
              <div className="space-y-4 mb-6">
                {listing.checkInTimeStart !== undefined && listing.checkInTimeEnd !== undefined && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <IconCalendar size={18} />
                    <span>Check-in: {listing.checkInTimeStart}:00 - {listing.checkInTimeEnd}:00</span>
                  </div>
                )}
                {listing.checkOutTime !== undefined && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <IconCalendar size={18} />
                    <span>Check-out: {listing.checkOutTime}:00</span>
                  </div>
                )}
                {listing.minNights && (
                  <div className="text-gray-700">
                    <strong>Minimum stay:</strong> {listing.minNights} nights
                  </div>
                )}
                {listing.maxNights && (
                  <div className="text-gray-700">
                    <strong>Maximum stay:</strong> {listing.maxNights} nights
                  </div>
                )}
              </div>

              {/* Instant Book Badge */}
              {listing.instantBookable && (
                <div className="mb-6 flex items-center gap-2 text-green-600">
                  <IconShield size={20} />
                  <span className="font-semibold">Instant Book Available</span>
                </div>
              )}

              {/* Contact Info */}
              {(listing.contactEmail || listing.contactPhone1) && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
                  {listing.contactEmail && (
                    <p className="text-gray-600 text-sm">{listing.contactEmail}</p>
                  )}
                  {listing.contactPhone1 && (
                    <p className="text-gray-600 text-sm">{listing.contactPhone1}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
