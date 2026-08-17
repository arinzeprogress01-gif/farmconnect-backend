const farmConnectGeolocation = `

# FARMCONNECT — GEOLOCATION MEMORY

## 1. GEOLOCATION DOMAIN

FarmConnect uses geographic location data to connect users, vendors, food listings, and marketplace discovery.

Geolocation is primarily used to support:

- vendor location
- user location
- listing location
- pickup locations
- nearby food discovery
- distance-based marketplace searches

The system uses geographic coordinates as part of the marketplace experience.

---

# 2. GEOJSON STANDARD

FarmConnect stores geographic locations using GeoJSON.

The standard geographic structure is:

type: "Point"

coordinates: [
    longitude,
    latitude
]

The coordinate order is extremely important.

FarmConnect uses:

[longitude, latitude]

NOT:

[latitude, longitude]

---

# 3. POINT GEOMETRY

The primary geographic object used by FarmConnect is:

Point

A point represents a specific geographic position.

Examples include:

- user's current location
- vendor's current location
- listing geographic location

A typical FarmConnect geographic object is conceptually:

{
    type: "Point",
    coordinates: [
        longitude,
        latitude
    ]
}

---

# 4. USER LOCATION

The user profile can contain geographic location information.

The user location is used to support location-aware marketplace features.

The user profile may contain:

- address
- city
- state
- location

The geographic location is stored separately from human-readable address information.

Therefore:

ADDRESS INFORMATION

and:

GEOGRAPHIC COORDINATES

represent different pieces of information.

---

# 5. USER LOCATION PURPOSE

A user's location can be used to determine nearby food listings.

Conceptually:

USER LOCATION
    ↓
GEOSPATIAL SEARCH
    ↓
NEARBY LISTINGS
    ↓
FOOD DISCOVERY

The system can therefore personalize marketplace discovery based on geographic proximity.

---

# 6. VENDOR LOCATION

Vendor profiles contain geographic location information.

Vendor location can include:

- permanent address
- current location
- city
- state
- geographic coordinates

The vendor's geographic location allows FarmConnect to associate a business with a physical location.

---

# 7. VENDOR CURRENT LOCATION

Vendors can update their current geographic location.

The service receives:

userId

longitude

latitude

The coordinates are validated before being saved.

Conceptually:

VENDOR
    ↓
longitude + latitude
    ↓
coordinate validation
    ↓
GeoJSON Point
    ↓
VendorProfile.currentLocation

---

# 8. VENDOR LOCATION VALIDATION

FarmConnect validates geographic coordinates before storing them.

The location utility provides:

isValidCoordinates()

The service rejects invalid coordinates with:

"Invalid location coordinates."

The validation occurs before updating the vendor's location.

This prevents invalid geographic data from entering the database.

---

# 9. LOCATION CREATION

FarmConnect provides a utility:

createGeoPoint()

This converts valid longitude and latitude values into the GeoJSON Point structure used by the system.

Conceptually:

longitude
+
latitude
    ↓
createGeoPoint()
    ↓
{
    type: "Point",
    coordinates: [
        longitude,
        latitude
    ]
}

---

# 10. COORDINATE CONVERSION

Incoming longitude and latitude values may arrive as strings.

Before being stored in geographic coordinate arrays, they are converted to numbers.

Conceptually:

Number(longitude)

Number(latitude)

This ensures the GeoJSON coordinates contain numeric values.

---

# 11. LISTING LOCATION

Food listings also contain geographic location information.

A listing may have a geographic:

location

and a separate:

pickupLocation

These represent related but distinct concepts.

---

# 12. LISTING PICKUP LOCATION

A listing's pickup location tells the user where the food should be collected.

The pickup location can come from two sources.

### Vendor location

If:

useVendorLocation = true

then:

listing pickup location
    ↓
vendor's saved location

The vendor's saved geographic location is also used as the listing's geographic location.

---

# 13. CUSTOM LISTING LOCATION

If:

useVendorLocation = false

the vendor provides a separate pickup location.

The listing receives:

pickupLocation

longitude

latitude

The coordinates are validated.

Then the geographic location is created using:

createGeoPoint(
    longitude,
    latitude
)

This allows a vendor to publish a listing at a location different from their normal vendor location.

---

# 14. LISTING GEOLOCATION FLOW

The listing creation process can therefore be understood as:

VENDOR CREATES LISTING
    ↓
USE VENDOR LOCATION?
    ↓
YES ---------------- NO
 ↓                    ↓
Vendor location       Custom pickup location
 ↓                    ↓
Vendor coordinates    Validate coordinates
 ↓                    ↓
Listing location      createGeoPoint()
                       ↓
                 Listing location

---

# 15. COORDINATE ORDER RULE

This is one of the most important geolocation rules in FarmConnect.

Coordinates must always be stored as:

[
    longitude,
    latitude
]

Example structure:

[
    7.4951,
    9.0579
]

where the first value represents longitude and the second represents latitude.

Mini Farm AI must never reverse the order when reasoning about FarmConnect coordinates.

---

# 16. MONGODB GEOSPATIAL SUPPORT

FarmConnect uses MongoDB geospatial functionality for location-aware queries.

Geographic fields use a:

2dsphere

index.

This allows MongoDB to perform geographic proximity queries against Earth's spherical coordinate system.

---

# 17. NEARBY LISTINGS

FarmConnect supports nearby listing discovery.

The nearby listing service can work in two ways.

### Method 1 — User's saved location

If no explicit coordinates are supplied:

userId
    ↓
user's stored location
    ↓
findNearbyListings(userId)
    ↓
nearby listings

If the user's profile/location cannot be found, the service returns:

"User profile not found."

---

# 18. NEARBY LISTINGS BY EXPLICIT COORDINATES

The user can also provide:

longitude

latitude

and optionally:

maxDistance

The system validates the coordinates.

Then:

findNearbyListingsByCoordinates(
    longitude,
    latitude,
    maxDistance
)

is used.

The longitude and latitude are converted to numbers before the repository call.

---

# 19. DEFAULT MAXIMUM DISTANCE

The nearby listing service currently uses:

maxDistance = 30000

when no maximum distance is supplied.

The value represents the geospatial search distance used by the repository.

Mini Farm AI should treat this as the current FarmConnect default rather than inventing a different distance.

---

# 20. EXPLICIT LOCATION SEARCH FLOW

The geographic search flow is:

USER PROVIDES LOCATION
    ↓
VALIDATE LONGITUDE
    ↓
VALIDATE LATITUDE
    ↓
CONVERT TO NUMBERS
    ↓
APPLY MAX DISTANCE
    ↓
GEOSPATIAL QUERY
    ↓
RETURN NEARBY LISTINGS

---

# 21. USER-BASED LOCATION SEARCH FLOW

When coordinates are not explicitly supplied:

USER ID
    ↓
USER PROFILE LOCATION
    ↓
findNearbyListings(userId)
    ↓
NEARBY LISTINGS

If the user profile cannot be found:

NotFoundError

"User profile not found."

---

# 22. LOCATION VALIDATION RULE

Any location received from a request must be validated before being used for geographic operations.

The primary validation utility is:

isValidCoordinates(
    longitude,
    latitude
)

Invalid coordinates result in:

BadRequestError

"Invalid location coordinates."

---

# 23. LISTING LOCATION VS PICKUP LOCATION

Mini Farm AI must distinguish between:

listing.location

and:

listing.pickupLocation

The geographic:

location

is used for geographic marketplace operations.

The:

pickupLocation

represents the human-readable location where the user should collect the food.

A listing may therefore contain both:

GEOGRAPHIC LOCATION
+
PICKUP INFORMATION

---

# 24. VENDOR LOCATION VS LISTING LOCATION

A vendor has their own geographic location.

A listing may either:

1. use that vendor location, or
2. define its own location.

Therefore:

VENDOR LOCATION

does not always equal:

LISTING LOCATION

The equality only occurs when:

useVendorLocation = true

---

# 25. GEOLOCATION AND MARKETPLACE DISCOVERY

Geolocation is directly connected to food discovery.

The broader marketplace flow is:

USER LOCATION
    ↓
GEOSPATIAL SEARCH
    ↓
LISTINGS WITHIN DISTANCE
    ↓
FILTER / DISCOVERY
    ↓
USER CHOOSES FOOD
    ↓
RESERVATION

Geolocation therefore helps users discover food that is physically accessible to them.

---

# 26. GEOLOCATION AND RESERVATIONS

The reservation stores the listing's:

pickupLocation

This means the reservation retains the pickup information associated with the food listing.

Conceptually:

LISTING
    ↓
pickupLocation
    ↓
RESERVATION
    ↓
USER KNOWS WHERE TO PICK UP FOOD

The reservation therefore carries pickup context from the listing.

---

# 27. GEOLOCATION AND MINI FARM AI

Mini Farm AI should understand location-related questions such as:

"Find food near me."

"Show me nearby food."

"What food is available around my location?"

"Which listings are close to me?"

"Where can I pick up this food?"

"Where is this vendor located?"

The AI must distinguish between:

- geographic proximity
- human-readable pickup location
- vendor location
- user location

---

# 28. LOCATION-BASED AI RESPONSES

Mini Farm AI should use actual supplied location data when making location-based recommendations.

For example, if current listing data contains:

foodName

pickupLocation

location

vendor

quantity

then the AI can use those values to help the user understand available food.

It must not invent geographic distances or locations that are not supplied by the backend.

---

# 29. NO INVENTED LOCATION DATA

Mini Farm AI must never fabricate:

- vendor locations
- pickup locations
- longitude
- latitude
- distances
- nearby listings
- cities
- states
- geographic availability

If the required location information is not available, the AI should clearly state that it does not have the information.

---

# 30. GEOLOCATION DATA AUTHORITY

The backend database is the authoritative source for FarmConnect geographic information.

The AI should rely on:

User profile location

Vendor profile location

Listing location

Listing pickupLocation

and actual geospatial query results.

The AI should not assume that a vendor or listing is nearby simply because their city or state appears similar.

---

# 31. LOCATION PRIVACY

Location information is associated with users, vendors and listings.

Mini Farm AI should only use location information available through the authenticated user's permitted application context.

It should not expose another user's private location information merely because it exists in the database.

---

# 32. GEOLOCATION ERROR HANDLING

Known location-related errors include:

"Invalid location coordinates."

"User profile not found."

"Vendor profile not found."

These errors indicate that the geographic operation cannot safely proceed.

---

# 33. GEOLOCATION SERVICE RESPONSIBILITIES

The geolocation functionality is responsible for:

- validating coordinates
- creating GeoJSON points
- storing geographic positions
- updating vendor current location
- supporting user location
- supporting listing location
- supporting nearby listing discovery
- supporting coordinate-based listing searches

---

# 34. GEOLOCATION UTILITIES

The core utility functions include:

isValidCoordinates()

createGeoPoint()

These utilities centralize geographic handling.

This prevents different parts of FarmConnect from creating inconsistent coordinate structures.

---

# 35. GEOLOCATION REPOSITORY RESPONSIBILITIES

Geospatial repository operations include:

findNearbyListings()

findNearbyListingsByCoordinates()

The repository is responsible for performing the database-level geographic query.

The service layer is responsible for:

- validating input
- determining which search method to use
- applying defaults
- handling errors

---

# 36. GEOLOCATION BUSINESS FLOW

The general FarmConnect geographic lifecycle is:

LOCATION INPUT
    ↓
VALIDATION
    ↓
CONVERSION
    ↓
GEOJSON POINT
    ↓
DATABASE
    ↓
GEOSPATIAL INDEX
    ↓
NEARBY SEARCH
    ↓
LISTING DISCOVERY

---

# 37. GEOLOCATION PRINCIPLE

FarmConnect treats geographic coordinates as structured data.

The system does not rely only on:

city

state

address

for proximity searches.

Actual geographic coordinates are used for location-aware operations.

---

# 38. IMPORTANT AI RULES

Mini Farm AI should remember:

1. FarmConnect uses GeoJSON Point objects.

2. Coordinates are stored as:

[longitude, latitude]

3. Coordinates must be validated.

4. Vendor locations can be updated.

5. Listings can use vendor location.

6. Listings can also have custom pickup locations.

7. Nearby listings can use the authenticated user's stored location.

8. Nearby listings can also use explicitly supplied coordinates.

9. The current default maximum search distance is 30000.

10. MongoDB geospatial functionality and 2dsphere indexes support geographic queries.

11. Listing pickupLocation is distinct from geographic listing.location.

12. Reservation records retain pickupLocation information from the listing.

13. Mini Farm AI must not invent geographic information.

14. Backend geospatial query results are authoritative for nearby-food questions.

15. Geographic coordinates should never be reversed.

`;

export default farmConnectGeolocation;