// Hostaway API Types

export interface ListingAmenity {
  id: number
  name: string
  // Add other amenity properties as needed
}

export interface ListingBedType {
  id: number
  name: string
  quantity: number
  // Add other bed type properties as needed
}

export interface ListingImage {
  id: number
  url: string
  thumbnailUrl?: string
  // Add other image properties as needed
}

export interface CustomFieldValue {
  customFieldId: number
  value: string
  // Add other custom field properties as needed
}

export interface BookingEngineUrl {
  url: string
  // Add other booking engine URL properties as needed
}

export interface HostawayListing {
  id: number
  propertyTypeId?: number
  name: string
  externalListingName: string
  internalListingName?: string
  description?: string
  houseRules?: string
  keyPickup?: string
  specialInstruction?: string
  doorSecurityCode?: string
  country?: string
  countryCode?: string
  state?: string
  city?: string
  street?: string
  address: string
  publicAddress?: string
  zipcode?: string
  price: number
  starRating?: number // 0-5
  averageReviewRating?: number // 0-10
  weeklyDiscount?: number
  monthlyDiscount?: number
  propertyRentTax?: number
  guestPerPersonPerNightTax?: number
  guestStayTax?: number
  guestNightlyTax?: number
  guestBathroomsNumber?: number
  refundableDamageDeposit?: number
  personCapacity?: number
  maxChildrenAllowed?: number
  maxInfantsAllowed?: number
  maxPetsAllowed?: number
  lat?: number
  lng?: number
  checkInTimeStart?: number // 0-23
  checkInTimeEnd?: number // 0-23
  checkOutTime?: number // 0-23
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict'
  cancellationPolicyId?: number
  airBnbCancellationPolicyId?: number
  bookingCancellationPolicyId?: number
  marriottCancellationPolicyId?: number
  vrboCancellationPolicyId?: number
  squareMeters?: number
  specialStatus?: 'archived' | null
  roomType?: 'entire_home' | 'private_room' | 'shared_room'
  bathroomType?: 'private' | 'shared'
  bedroomsNumber?: number
  bedsNumber?: number
  bathroomsNumber?: number
  minNights?: number
  maxNights?: number
  guestsIncluded: number
  cleaningFee?: number
  priceForExtraPerson: number
  instantBookable?: boolean
  instantBookableLeadTime?: number
  airbnbBookingLeadTime?: number
  airbnbBookingLeadTimeAllowRequestToBook?: number
  allowSameDayBooking?: number
  sameDayBookingLeadTime?: number
  contactName?: string
  contactSurName?: string
  contactPhone1?: string
  contactPhone2?: string
  contactLanguage?: string
  contactEmail?: string
  contactAddress?: string
  language?: string
  currencyCode: string
  timeZoneName?: string
  wifiUsername?: string
  wifiPassword?: string
  cleannessStatus?: string
  cleaningInstruction?: string
  cleannessStatusUpdatedOn?: string
  homeawayPropertyName?: string
  homeawayPropertyHeadline?: string
  homeawayPropertyDescription?: string
  bookingcomPropertyName?: string
  bookingcomPropertyDescription?: string
  invoicingContactName?: string
  invoicingContactSurName?: string
  invoicingContactPhone1?: string
  invoicingContactPhone2?: string
  invoicingContactEmail?: string
  invoicingContactAddress?: string
  invoicingContactCity?: string
  invoicingContactZipcode?: string
  invoicingContactCountry?: string
  propertyLicenseNumber?: string
  propertyLicenseType?: string
  propertyLicenseIssueDate?: string // YYYY-MM-DD
  propertyLicenseExpirationDate?: string // YYYY-MM-DD
  partnersListingMarkup?: number
  airbnbOfficialListingMarkup?: number
  bookingEngineMarkup?: number
  homeawayApiMarkup?: number
  marriottListingMarkup?: number
  isRentalAgreementActive?: boolean
  listingAgreementText?: string
  listingAmenities?: ListingAmenity[]
  listingBedTypes?: ListingBedType[]
  listingImages?: ListingImage[]
  latestActivityOn?: string
  customFieldValues?: CustomFieldValue[]
  bookingcomPropertyRegisteredInVcs?: boolean
  bookingcomPropertyHasVat?: boolean
  bookingcomPropertyDeclaresRevenue?: boolean
  googleVrListingUrl?: string
  vrboListingUrl?: string
  airbnbListingUrl?: string
  airbnbName?: string
  airbnbSummary?: string
  airbnbSpace?: string
  airbnbAccess?: string
  airbnbInteraction?: string
  airbnbNeighborhoodOverview?: string
  airbnbTransit?: string
  airbnbNotes?: string
  bookingEngineUrls?: BookingEngineUrl[]
  insuranceEligibilityStatus?: boolean
}

export interface HostawayListingsResponse {
  result: HostawayListing[]
  count?: number
  limit?: number
  offset?: number
}



