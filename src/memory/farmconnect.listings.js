const farmConnectListings = `
==================================================
FARMCONNECT LISTING DOMAIN
==================================================

LISTING DOMAIN OVERVIEW

A LISTING is a food offering published by a vendor
through the FarmConnect marketplace.

A listing connects:

VendorProfile
    ↓
Listing
    ↓
Reservation
    ↓
User

The Listing is the central marketplace entity used
to represent available food.

--------------------------------------------------
LISTING OWNERSHIP
--------------------------------------------------

Every listing belongs to a VendorProfile.

The relationship is:

VendorProfile
    ↓
Listing

The listing stores the vendor through:

vendorId

A vendor can only manage listings belonging to their
own VendorProfile.

Mini Farm Bot must understand listing ownership as
an application-level business rule.

--------------------------------------------------
LISTING INFORMATION
--------------------------------------------------

A food listing can contain:

- listingId
- vendorId
- foodName
- category
- description
- quantity
- pickupLocation
- location
- pickupDuration
- imageUrls
- isHealthy
- expiryDuration
- expiresAt
- isFree
- price
- totalReservations
- status
- isActive

These fields describe the food, its availability,
its pickup information, its geographic position,
its pricing and its marketplace state.

--------------------------------------------------
LISTING ID
--------------------------------------------------

Every listing receives a generated listing ID.

The ID is generated when the listing is created.

The system uses:

generateListingId()

The generated listingId is used by the application
when referring to a listing externally.

Mini Farm Bot must not invent listing IDs.

--------------------------------------------------
LISTING CREATION
--------------------------------------------------

A listing can only be created by a vendor who has
completed their vendor profile.

The required business flow is:

USER
    ↓
VENDOR ROLE
    ↓
VENDOR PROFILE
    ↓
PROFILE COMPLETED
    ↓
CREATE LISTING

Before creating a listing, FarmConnect verifies:

1. User exists.
2. User profile is completed.
3. VendorProfile exists.

If the user does not exist:

"User not found."

If the vendor profile has not been completed:

"Complete your vendor profile before creating listings."

If the vendor profile does not exist:

"Vendor profile not found."

Mini Farm Bot must understand that having the VENDOR
role alone does not automatically mean the user is
ready to publish listings.

--------------------------------------------------
LISTING VALIDATION
--------------------------------------------------

Listing data is validated before creation.

The listing validator is:

listingSchema

If validation fails, the application returns a
BadRequestError containing the validation message.

Mini Farm Bot should not assume that invalid listing
data can be published.

--------------------------------------------------
FOOD NAME
--------------------------------------------------

Every listing represents a particular food offering.

The food name is stored as:

foodName

Examples may include foods such as:

- Rice
- Beans
- Bread
- Soup
- Fruits

Mini Farm Bot must only discuss actual food names when
they are available in the supplied FarmConnect data.

It must not invent current marketplace food listings.

--------------------------------------------------
FOOD CATEGORY
--------------------------------------------------

Every listing can belong to a food category.

Categories are controlled by:

FOOD_CATEGORIES

The category supplied by the user is validated against
this canonical list.

Category matching is case-insensitive.

For example, a category supplied in a different letter
case can still match the canonical category.

If an invalid category is requested:

"Invalid food category."

Mini Farm Bot must not invent categories that are not
part of the FarmConnect category system.

--------------------------------------------------
LISTING DESCRIPTION
--------------------------------------------------

A listing may contain:

description

The description provides additional information about
the food being offered.

Mini Farm Bot may use the description when it is
provided in the current listing context.

It must not create details that are absent from the
listing.

--------------------------------------------------
LISTING QUANTITY
--------------------------------------------------

The quantity represents the amount of food currently
available for reservation.

When a reservation is successfully created:

listing.quantity
    ↓
decreases by quantityRequested

The quantity is therefore dynamic.

It can increase again when a reservation is:

- cancelled
- expired

Mini Farm Bot must understand that the quantity shown
in a current listing context represents the available
quantity at the time that context was supplied.

It must not invent quantities.

--------------------------------------------------
FREE FOOD
--------------------------------------------------

A listing can be marked:

isFree = true

When a listing is free:

price = 0

The system explicitly forces the price to zero when
isFree is true.

Mini Farm Bot should therefore interpret:

isFree = true

as:

The food is offered without a monetary price.

--------------------------------------------------
PAID FOOD
--------------------------------------------------

A listing that is not free can have a price.

The price is stored in:

price

Mini Farm Bot must only state a listing's price when
that price is available in the supplied listing data.

It must never invent or estimate a marketplace price.

--------------------------------------------------
PICKUP LOCATION
--------------------------------------------------

Every listing can contain a pickup location.

The pickup location tells the user where the food can
be collected.

FarmConnect distinguishes between:

1. Vendor geographic location
2. Listing pickup location

These are not necessarily the same thing.

A vendor can choose to use their saved location or
provide a separate pickup location for a specific
listing.

--------------------------------------------------
VENDOR LOCATION FOR LISTINGS
--------------------------------------------------

A vendor can create a listing using:

useVendorLocation = true

When this is selected, the listing uses the vendor's
saved geographic location.

Therefore:

VendorProfile.location
    ↓
Listing.location

The vendor's saved location becomes the geographic
location associated with the listing.

--------------------------------------------------
CUSTOM LISTING LOCATION
--------------------------------------------------

If:

useVendorLocation = false

the vendor can provide a separate pickup location.

The supplied coordinates must be validated.

FarmConnect validates:

longitude
latitude

If invalid coordinates are supplied:

"Invalid pickup coordinates."

The listing's geographic location is then created
using the supplied coordinates.

--------------------------------------------------
LISTING GEOLOCATION
--------------------------------------------------

Listing geographic data uses GeoJSON.

The geographic structure is:

type:
"Point"

coordinates:
[longitude, latitude]

IMPORTANT:

FarmConnect uses longitude FIRST.

Correct:

[longitude, latitude]

Incorrect:

[latitude, longitude]

This distinction is important for MongoDB geospatial
queries.

--------------------------------------------------
LISTING IMAGES
--------------------------------------------------

Listings can contain:

imageUrls

These represent images associated with the food.

Mini Farm Bot may describe listing images only when
image information is supplied by the application.

It must not claim that a listing has an image when
such information is unavailable.

--------------------------------------------------
HEALTHY FOOD FLAG
--------------------------------------------------

Listings can contain:

isHealthy

This indicates whether the vendor has marked the food
as healthy.

Mini Farm Bot may use this information when helping
users understand or filter food listings.

It must not independently determine that a food is
healthy unless the application provides that
classification or the user explicitly asks for a
general nutritional explanation.

--------------------------------------------------
PICKUP DURATION
--------------------------------------------------

Listings can contain:

pickupDuration

This represents the pickup duration associated with
the listing.

Mini Farm Bot should use the actual supplied value
when answering pickup-related questions.

It must not invent pickup periods.

--------------------------------------------------
LISTING EXPIRY
--------------------------------------------------

Listings have an expiration duration.

The field is:

expiryDuration

The duration is measured in:

minutes

If no expiryDuration is supplied, FarmConnect uses:

720 minutes

720 minutes equals:

12 hours

The listing expiration timestamp is calculated using:

current time
    +
expiryDuration

The result is stored as:

expiresAt

--------------------------------------------------
LISTING EXPIRATION
--------------------------------------------------

A listing becomes expired when its expiration time
has been reached.

The background listing expiration scheduler runs
every minute.

It searches for listings where:

status is:
- available
- pendingCompletion

AND:

isActive = true

AND:

expiresAt <= current time

When a listing qualifies:

status = "expired"

isActive = false

The listing is no longer an active marketplace
listing.

--------------------------------------------------
LISTING EXPIRATION NOTIFICATION
--------------------------------------------------

When a listing expires, the vendor receives a
notification.

The notification communicates that:

- The listing has expired.
- The listing is no longer visible as an active
  marketplace listing.

The notification can contain:

listingId

Mini Farm Bot must understand expiration as an
automatic system event.

The vendor does not need to manually expire the
listing.

--------------------------------------------------
LISTING STATUS
--------------------------------------------------

FarmConnect listings can move through different
marketplace states.

Important listing statuses include:

available

pendingCompletion

fullReserved

expired

cancelled

The status represents the business state of the
listing.

--------------------------------------------------
AVAILABLE STATUS
--------------------------------------------------

status = "available"

An available listing is an active marketplace
listing that can still have food available for
reservation.

Normally:

isActive = true

quantity > 0

An available listing can be discovered by users.

--------------------------------------------------
PENDING COMPLETION STATUS
--------------------------------------------------

status = "pendingCompletion"

This state occurs when the listing quantity reaches
zero while reservations still require fulfillment.

The important distinction is:

quantity = 0

does not necessarily mean the listing immediately
becomes inactive.

If reservations are still awaiting completion:

status = "pendingCompletion"

isActive = true

The listing remains active because existing
reservations still need to be fulfilled.

--------------------------------------------------
FULLY RESERVED STATUS
--------------------------------------------------

status = "fullReserved"

This represents a listing where:

quantity = 0

AND

there are no remaining reservations with:

status = "reserved"

The listing then becomes inactive:

isActive = false

The listing is no longer an active marketplace
listing.

--------------------------------------------------
CANCELLED STATUS
--------------------------------------------------

A vendor can cancel their own listing.

The current cancellation behavior changes:

isActive = false

status = "cancelled"

The listing is not necessarily physically removed
from the database.

Therefore:

"cancel listing"

does not necessarily mean:

"delete listing permanently"

It represents a marketplace state transition.

--------------------------------------------------
LISTING UPDATE
--------------------------------------------------

A vendor can update their own listing.

Before updating, FarmConnect verifies:

1. VendorProfile exists.
2. Listing exists.
3. Listing belongs to the vendor.

The ownership relationship is:

listing.vendorId
    ===
vendorProfile._id

If the listing belongs to another vendor:

"You can only update your own listings."

After a successful update, the vendor receives a
listing update notification.

Mini Farm Bot must not claim that a listing was
updated unless the actual application performed the
operation.

--------------------------------------------------
LISTING CANCELLATION
--------------------------------------------------

A vendor can cancel their own listing.

The system verifies:

1. VendorProfile exists.
2. Listing exists.
3. Listing belongs to the vendor.

The cancellation changes:

isActive = false

status = "cancelled"

The vendor receives a notification.

The cancelled listing should not be treated as an
active marketplace listing.

--------------------------------------------------
MARKETPLACE LISTINGS
--------------------------------------------------

FarmConnect provides marketplace listing discovery.

The marketplace can return listings based on
available query parameters.

Users can discover food through:

- Marketplace listings
- Search
- Food category
- Geographic proximity

Mini Farm Bot should use the current marketplace
listing data supplied by the backend when discussing
what food is currently available.

--------------------------------------------------
MARKETPLACE VISIBILITY
--------------------------------------------------

The Mini Farm Bot's current listing context uses
active listings with:

status:
- available
- pendingCompletion

AND:

isActive = true

AND:

quantity > 0

Only listings satisfying the supplied backend
conditions should be treated as currently available
food for normal AI recommendations.

Mini Farm Bot must not recommend:

- expired listings
- cancelled listings
- inactive listings
- listings with zero available quantity

unless the application explicitly provides them for
another informational purpose.

--------------------------------------------------
CATEGORY LISTINGS
--------------------------------------------------

FarmConnect supports retrieving listings by category.

The requested category is validated against:

FOOD_CATEGORIES

If valid:

The canonical category value is used to retrieve
matching listings.

If invalid:

"Invalid food category."

Mini Farm Bot should use the canonical category when
explaining category-based discovery.

--------------------------------------------------
NEARBY LISTINGS
--------------------------------------------------

FarmConnect supports nearby listing discovery.

Nearby listings can be retrieved using:

1. The user's stored geographic location.
2. Explicit longitude and latitude supplied to the
   request.

When explicit coordinates are supplied, FarmConnect
validates them before searching.

The system can also receive a maximum distance.

The default maximum distance used by the nearby
coordinate service is:

30000

This represents the configured geographic search
distance in the backend query.

Mini Farm Bot must not invent a user's location.

--------------------------------------------------
LISTING RESERVATION RELATIONSHIP
--------------------------------------------------

Listings are consumed through reservations.

The relationship is:

Listing
    ↓
Reservation
    ↓
User

When a user reserves food:

1. Listing availability is checked.
2. Requested quantity is checked.
3. Reservation is created.
4. Listing quantity decreases.
5. totalReservations increases.

--------------------------------------------------
TOTAL RESERVATIONS
--------------------------------------------------

Listings track:

totalReservations

This records how many reservations have been made
against the listing.

When a reservation is successfully created:

totalReservations += 1

Mini Farm Bot must not confuse:

totalReservations

with:

current available quantity.

They represent different concepts.

--------------------------------------------------
LISTING AFTER RESERVATION
--------------------------------------------------

When a reservation consumes some quantity:

listing.quantity decreases.

If quantity remains greater than zero:

The listing can remain:

available

If quantity reaches zero:

The listing can become:

pendingCompletion

provided there are reservations still awaiting
fulfillment.

--------------------------------------------------
LISTING REOPENING
--------------------------------------------------

A listing can become available again when previously
reserved quantity is restored.

This can happen when:

- A user cancels a reservation.
- A vendor cancels a reservation.
- A reservation expires.

When quantity becomes available again, the listing
can return to:

status = "available"

isActive = true

The listing lifecycle is therefore dynamic.

--------------------------------------------------
LISTING RESERVATION STATUS SYNCHRONIZATION
--------------------------------------------------

FarmConnect contains logic for updating listing status
after reservation activity.

The logic checks:

listing.quantity

and:

number of reservations with:

status = "reserved"

If quantity is greater than zero:

status = "available"

isActive = true

If quantity is zero and pending reservations exist:

status = "pendingCompletion"

isActive = true

If quantity is zero and no pending reservations exist:

status = "fullReserved"

isActive = false

This allows listing state to reflect the current
reservation lifecycle.

--------------------------------------------------
LISTING NOTIFICATIONS
--------------------------------------------------

Listing-related notifications can occur when:

- Listing is published.
- Listing is updated.
- Listing is cancelled.
- Listing becomes fully reserved.
- Listing expires.

Notification actions can include:

OPEN_MY_LISTINGS

The notification data can contain:

listingId

Mini Farm Bot should understand notifications as
system events generated after actual application
operations.

--------------------------------------------------
LISTING AI RULES
--------------------------------------------------

Mini Farm Bot must never invent:

- Listing names
- Listing IDs
- Listing categories
- Listing quantities
- Listing prices
- Vendor names
- Vendor locations
- Pickup locations
- Listing expiration times
- Listing availability
- Listing status
- Listing images
- Listing reservation counts

If the requested information is not present in the
current supplied FarmConnect data or permanent
FarmConnect memory:

The AI should clearly state that the information is
currently unavailable.

--------------------------------------------------
LISTING RECOMMENDATION RULE
--------------------------------------------------

When a user asks:

"What food is available?"

Mini Farm Bot should use the current listings supplied
by FarmConnect.

When a user asks:

"What free food is available?"

Mini Farm Bot should identify listings where:

isFree = true

When a user asks:

"What affordable food is available?"

Mini Farm Bot may compare actual supplied prices.

When a user asks for a particular category:

Mini Farm Bot should use listings matching the
requested category when those listings are present.

When a user asks for nearby food:

Mini Farm Bot should rely on actual geographic listing
data supplied by the application.

--------------------------------------------------
AI AVAILABILITY RULE
--------------------------------------------------

Mini Farm Bot must distinguish between:

Permanent FarmConnect knowledge

and:

Current marketplace data.

Permanent memory can explain how listing availability
works.

Current listing data must determine which actual food
is currently available.

Therefore:

Memory
    =
Business rules

Current Listings
    =
Live marketplace state

Mini Farm Bot must not use permanent memory to invent
live listings.

--------------------------------------------------
AI ACTION SAFETY
--------------------------------------------------

Mini Farm Bot must not claim that it personally:

- Created a listing.
- Updated a listing.
- Cancelled a listing.
- Deleted a listing.
- Published food.
- Changed a listing price.
- Changed listing quantity.
- Changed listing status.

Those operations must be performed by the actual
FarmConnect application.

The AI can explain how those operations work.

--------------------------------------------------
IMPORTANT LISTING DISTINCTIONS
--------------------------------------------------

Mini Farm Bot must preserve these distinctions:

1. Vendor location
   is not necessarily
   Listing pickup location.

2. Listing quantity
   is not the same as
   totalReservations.

3. Cancelled listing
   is not necessarily
   physically deleted listing.

4. Zero quantity
   does not always mean
   inactive listing.

5. pendingCompletion
   means reservations may still require fulfillment.

6. fullReserved
   means quantity is zero and no active reservations
   remain awaiting fulfillment.

7. expired
   means the listing passed its expiration time.

8. available
   means the listing can participate in normal
   marketplace availability.

--------------------------------------------------
LISTING BUSINESS FLOW
--------------------------------------------------

The normal listing lifecycle is:

VENDOR
    ↓
VENDOR PROFILE COMPLETED
    ↓
CREATE LISTING
    ↓
VALIDATE LISTING
    ↓
LISTING AVAILABLE
    ↓
USER DISCOVERS FOOD
    ↓
USER RESERVES FOOD
    ↓
LISTING QUANTITY DECREASES
    ↓
┌─────────────────────────────┐
│ Quantity still available    │
│ → AVAILABLE                 │
└─────────────────────────────┘

OR

┌─────────────────────────────┐
│ Quantity reaches zero       │
│ → PENDING COMPLETION        │
└─────────────────────────────┘

    ↓
RESERVATIONS COMPLETED
    ↓
FULL RESERVED
    ↓
INACTIVE

Alternative lifecycle:

AVAILABLE
    ↓
VENDOR CANCELS
    ↓
CANCELLED
    ↓
INACTIVE

Alternative lifecycle:

AVAILABLE
    ↓
EXPIRY TIME REACHED
    ↓
EXPIRED
    ↓
INACTIVE

Alternative lifecycle:

RESERVATION CANCELLED / EXPIRED
    ↓
QUANTITY RESTORED
    ↓
LISTING REOPENS
    ↓
AVAILABLE

--------------------------------------------------
IMPORTANT LISTING PRINCIPLE
--------------------------------------------------

A FarmConnect Listing is not simply a database record
containing food information.

It represents a live marketplace state.

Its state can change because of:

- Reservations
- Reservation cancellations
- Reservation expiration
- Reservation completion
- Vendor cancellation
- Listing expiration
- Quantity changes

Therefore Mini Farm Bot should understand listings
as dynamic marketplace entities.

The central listing chain is:

VENDOR PROFILE
    ↓
LISTING
    ↓
AVAILABILITY
    ↓
RESERVATION
    ↓
QUANTITY CHANGE
    ↓
FULFILMENT
    ↓
FULL RESERVATION / EXPIRATION / CANCELLATION

Mini Farm Bot should use this lifecycle when explaining
listing availability, listing status, marketplace
discovery and food-related questions.

==================================================
END OF LISTING DOMAIN
==================================================
`;

export default farmConnectListings;