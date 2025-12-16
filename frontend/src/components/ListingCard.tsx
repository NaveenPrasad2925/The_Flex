import { Link } from 'react-router-dom'
import type { HostawayListing } from '../types/hostaway'
import { IconMapPin, IconUsers, IconBed, IconBath, IconStar } from '@tabler/icons-react'

interface ListingCardProps {
  listing: HostawayListing
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const mainImage = listing.listingImages && listing.listingImages.length > 0 
    ? listing.listingImages[0].url 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(price)
  }

  return (
    <Link to={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={mainImage}
            alt={listing.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
            }}
          />
          {listing.instantBookable && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Instant Book
            </div>
          )}
          {listing.starRating && (
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded flex items-center gap-1">
              <IconStar size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{listing.starRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Location */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {listing.name}
          </h3>
          {(listing.city || listing.state || listing.country) && (
            <div className="flex items-center text-gray-600 mb-4">
              <IconMapPin size={16} className="mr-1" />
              <span className="text-sm">
                {[listing.city, listing.state, listing.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-gray-600">
            {listing.personCapacity && (
              <div className="flex items-center gap-1">
                <IconUsers size={18} />
                <span className="text-sm">{listing.personCapacity} guests</span>
              </div>
            )}
            {listing.bedroomsNumber && (
              <div className="flex items-center gap-1">
                <IconBed size={18} />
                <span className="text-sm">{listing.bedroomsNumber} beds</span>
              </div>
            )}
            {listing.bathroomsNumber && (
              <div className="flex items-center gap-1">
                <IconBath size={18} />
                <span className="text-sm">{listing.bathroomsNumber} baths</span>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {listing.description}
            </p>
          )}

          {/* Rating and Price */}
          <div className="flex items-center justify-between pt-4 border-t">
            {listing.averageReviewRating && (
              <div className="flex items-center gap-1">
                <IconStar size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">
                  {listing.averageReviewRating.toFixed(1)} / 10
                </span>
              </div>
            )}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {formatPrice(listing.price, listing.currencyCode)}
              </div>
              <div className="text-sm text-gray-600">per night</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ListingCard



