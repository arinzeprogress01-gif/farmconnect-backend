const farmConnectVendors = `
==================================================
FARMCONNECT VENDOR DOMAIN
==================================================

VENDOR DOMAIN OVERVIEW

A VENDOR is a FarmConnect user who provides food through
the FarmConnect marketplace.

The vendor has two connected entities:

1. User
2. VendorProfile

The User entity represents the vendor's account and
authentication identity.

The VendorProfile represents the vendor's business and
marketplace information.

The vendor's marketplace activity is primarily performed
through the VendorProfile.

--------------------------------------------------
VENDOR ROLE
--------------------------------------------------

The FarmConnect vendor role is:

VENDOR

Only users with the VENDOR role can create a vendor profile.

A normal USER cannot create a VendorProfile.

If a non-vendor attempts to create a vendor profile,
the operation must be rejected.

The vendor profile is therefore role-specific.

--------------------------------------------------
VENDOR PROFILE
--------------------------------------------------

The VendorProfile represents the business identity of
a vendor inside FarmConnect.

Vendor profile information can include:

- userId
- businessName
- businessType
- description
- email
- state
- city
- phone
- permanentAddress
- currentLocation
- profileImage
- operatingHours
- isVerified
- location

The VendorProfile is associated with the vendor's User
account through userId.

The vendor profile is separate from the authentication
account.

--------------------------------------------------
VENDOR PROFILE CREATION
--------------------------------------------------

A vendor must satisfy the following conditions before
creating a vendor profile:

1. The authenticated User must exist.
2. The User must have the VENDOR role.
3. The User must not already have a VendorProfile.

The process is:

Authenticated User
→ Verify User exists
→ Verify role = VENDOR
→ Check existing VendorProfile
→ Create VendorProfile
→ Mark profileCompleted = true
→ Notify vendor

If the user does not exist:

"User not found."

If the user is not a vendor:

"Only vendors can create a vendor profile."

If a vendor profile already exists:

"Vendor profile already exists."

--------------------------------------------------
PROFILE COMPLETION
--------------------------------------------------

After successful vendor profile creation:

user.profileCompleted = true

This is important because listing creation requires
the vendor to have completed their vendor profile.

Therefore:

VENDOR ACCOUNT
    ↓
VENDOR ROLE
    ↓
VENDOR PROFILE
    ↓
PROFILE COMPLETED
    ↓
CAN CREATE LISTINGS

A vendor account that has not completed the vendor profile
should not be treated as ready to publish food listings.

--------------------------------------------------
VENDOR PROFILE NOTIFICATION
--------------------------------------------------

After successful vendor profile creation, the vendor
receives a notification.

The notification communicates that:

- Their vendor profile was created.
- They can now start publishing food listings.

The notification can contain the vendor profile ID
and an action such as:

OPEN_VENDOR_PROFILE

--------------------------------------------------
VENDOR PROFILE RETRIEVAL
--------------------------------------------------

A vendor can retrieve their own vendor profile.

The system searches for the VendorProfile associated
with the authenticated user.

If the vendor profile does not exist:

"Vendor profile not found."

Mini Farm Bot must not assume that every VENDOR account
has already created a vendor profile.

--------------------------------------------------
VENDOR PROFILE UPDATE
--------------------------------------------------

A vendor can update their own vendor profile.

The system first checks that the vendor profile exists.

If it does not exist:

"Vendor profile not found."

After a successful update:

- Vendor profile information is updated.
- The vendor receives an update notification.

The notification communicates that the vendor profile
was updated successfully.

--------------------------------------------------
VENDOR LOCATION
--------------------------------------------------

Vendors can store geographic location information.

Vendor geographic location uses GeoJSON:

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

Coordinates are validated before being stored.

If invalid coordinates are supplied:

"Invalid location coordinates."

If the vendor profile does not exist:

"Vendor profile not found."

--------------------------------------------------
CURRENT VENDOR LOCATION
--------------------------------------------------

The vendor can update their current geographic location.

The location is stored as:

{
    type: "Point",
    coordinates: [
        longitude,
        latitude
    ]
}

The current vendor location can be used by the marketplace
for geographic discovery and for creating listings using
the vendor's saved location.

--------------------------------------------------
VENDOR LOCATION VS PICKUP LOCATION
--------------------------------------------------

FarmConnect distinguishes between a vendor's geographic
location and a listing's pickup location.

A vendor may create a listing using:

useVendorLocation = true

In that situation, the listing uses the vendor's saved
location.

Alternatively, a vendor may provide a separate pickup
location for a specific listing.

Therefore:

Vendor location
does not necessarily mean
Listing pickup location.

Mini Farm Bot must preserve this distinction.

--------------------------------------------------
VENDOR LISTINGS
--------------------------------------------------

A vendor can create food listings after completing
their vendor profile.

The relationship is:

Vendor User
    ↓
VendorProfile
    ↓
Listing

Each listing belongs to a VendorProfile.

A vendor can manage listings associated with their own
vendor profile.

--------------------------------------------------
LISTING CREATION REQUIREMENT
--------------------------------------------------

Before creating a listing, FarmConnect verifies:

1. User exists.
2. User profile is completed.
3. VendorProfile exists.

If the vendor profile is incomplete:

"Complete your vendor profile before creating listings."

If the vendor profile does not exist:

"Vendor profile not found."

Mini Farm Bot should understand that having the VENDOR
role alone does not automatically mean the vendor can
publish listings.

The vendor profile must also be completed.

--------------------------------------------------
VENDOR LISTING OWNERSHIP
--------------------------------------------------

A vendor can only modify listings belonging to their
VendorProfile.

When updating a listing, FarmConnect verifies:

listing.vendorId === authenticated vendor's VendorProfile ID

If ownership does not match:

"You can only update your own listings."

The same ownership principle applies when deleting or
cancelling listings.

--------------------------------------------------
VENDOR LISTING UPDATE
--------------------------------------------------

A vendor can update their own listing.

The system verifies:

1. VendorProfile exists.
2. Listing exists.
3. Listing belongs to that VendorProfile.

After a successful update:

- Listing information changes.
- Vendor receives a listing update notification.

Mini Farm Bot must not claim that a listing was updated
unless the application actually performed the operation.

--------------------------------------------------
VENDOR LISTING CANCELLATION
--------------------------------------------------

A vendor can cancel/remove their own listing.

The operation verifies:

1. VendorProfile exists.
2. Listing exists.
3. Listing belongs to the vendor.

The listing is not necessarily physically deleted.

The current cancellation behavior changes the listing state:

isActive = false

status = "cancelled"

The vendor receives a notification.

The listing is no longer presented as an active marketplace
listing.

IMPORTANT:

Mini Farm Bot should understand that "cancel listing"
does not necessarily mean permanent database deletion.

It represents a marketplace state transition.

--------------------------------------------------
VENDOR RESERVATIONS
--------------------------------------------------

Vendors receive reservations for their food listings.

A reservation connects:

User
    ↓
Reservation
    ↓
Listing
    ↓
VendorProfile

A vendor can view reservations belonging to their
VendorProfile.

Vendor reservation information can include:

- User
- Listing
- Food name
- Pickup location
- Quantity requested
- Reservation status
- Reservation ID
- Pickup code
- Reservation timestamps

--------------------------------------------------
VENDOR RESERVATION OWNERSHIP
--------------------------------------------------

A vendor can only operate on reservations belonging
to their vendor profile.

Before cancelling or completing a reservation,
FarmConnect verifies:

reservation.vendor === vendorProfile._id

If the reservation belongs to another vendor:

"You are not allowed to [perform the operation]."

Mini Farm Bot must never imply that a vendor can modify
another vendor's reservation.

--------------------------------------------------
VENDOR RESERVATION CANCELLATION
--------------------------------------------------

A vendor can cancel a reservation belonging to their
vendor profile.

A cancellation reason is required.

The cancellation reason cannot be empty.

Completed reservations cannot be cancelled.

Already-cancelled reservations cannot be cancelled again.

When a vendor cancels a reservation:

1. Listing quantity is restored.
2. The listing can be reopened when appropriate.
3. Reservation status becomes cancelled.
4. Cancellation reason is recorded.
5. User is notified.

The user receives the cancellation reason as part
of the notification.

--------------------------------------------------
VENDOR RESERVATION COMPLETION
--------------------------------------------------

A vendor can complete a reservation belonging to their
vendor profile.

The system verifies:

1. Reservation exists.
2. Vendor owns the reservation.
3. Reservation is not already completed.
4. Reservation is not cancelled.

On successful completion:

status = "completed"

completedAt = current time

The user receives a completion notification.

--------------------------------------------------
LISTING AFTER RESERVATION COMPLETION
--------------------------------------------------

After a vendor completes a reservation, FarmConnect checks
whether the listing still has pending reservations.

If:

listing.quantity === 0

AND

there are no remaining reservations with:

status = "reserved"

then:

listing.status = "fullReserved"

listing.isActive = false

This means all available quantity has been allocated and
there are no remaining active reservations awaiting
fulfilment.

--------------------------------------------------
VENDOR RESERVATION EXPIRATION
--------------------------------------------------

Reservations can expire automatically.

When a reservation expires:

- Reservation status becomes expired.
- Requested quantity is restored.
- Listing can become available again.
- User is notified.
- Vendor is notified.

The vendor does not manually have to expire the reservation.

A background scheduler handles this lifecycle.

--------------------------------------------------
VENDOR LISTING EXPIRATION
--------------------------------------------------

Food listings have an expiration time.

When an active listing reaches its expiration time,
the background expiration job can change it to:

status = "expired"

isActive = false

The vendor receives a listing expiration notification.

An expired listing should not be treated as an active
marketplace listing.

--------------------------------------------------
VENDOR DASHBOARD
--------------------------------------------------

Vendor dashboard analytics are based on actual
marketplace activity.

Vendor analytics can relate to:

- Listings
- Reservations
- Food quantities
- Listing activity
- Reservation completion
- Other vendor marketplace activity

Mini Farm Bot must use actual supplied analytics data
when discussing vendor statistics.

It must not invent vendor performance figures.

--------------------------------------------------
VENDOR NOTIFICATIONS
--------------------------------------------------

Vendors can receive notifications for events including:

- Vendor profile creation
- Vendor profile updates
- New reservations
- Reservation cancellations
- Reservation completions
- Reservation expirations
- Listing publication
- Listing updates
- Listing cancellation
- Listing expiration
- Listing lifecycle events
- Security/system events

Notifications may contain action metadata such as:

OPEN_VENDOR_PROFILE

OPEN_MY_LISTINGS

OPEN_VENDOR_RESERVATIONS

--------------------------------------------------
VENDOR BUSINESS FLOW
--------------------------------------------------

The normal vendor lifecycle is:

REGISTER
    ↓
LOGIN
    ↓
VENDOR ROLE
    ↓
CREATE VENDOR PROFILE
    ↓
PROFILE COMPLETED
    ↓
CREATE FOOD LISTING
    ↓
LISTING AVAILABLE
    ↓
USERS RESERVE FOOD
    ↓
VENDOR RECEIVES RESERVATIONS
    ↓
PICKUP / FULFILMENT
    ↓
VENDOR COMPLETES RESERVATIONS
    ↓
LISTING EVENTUALLY BECOMES FULLY RESERVED,
EXPIRED OR CANCELLED

--------------------------------------------------
VENDOR AI INTERPRETATION
--------------------------------------------------

Mini Farm Bot should understand vendor questions in
the context of the vendor's role.

Examples:

"What can I do as a vendor?"

The AI should explain vendor capabilities such as:

- Create vendor profile
- Publish food listings
- Manage listings
- View reservations
- Cancel reservations
- Complete reservations
- Update vendor information
- Manage location
- Receive notifications
- View analytics

"Why can't I create a listing?"

Possible system-level reasons include:

- Account does not have VENDOR role.
- Vendor profile has not been completed.
- Vendor profile does not exist.

Mini Farm Bot should not claim the exact reason unless
the supplied live application context establishes it.

"Can I cancel a reservation?"

A vendor can cancel a reservation belonging to their
vendor profile, provided the reservation is not already
completed or cancelled and a cancellation reason is supplied.

"Can I complete a cancelled reservation?"

No.

Cancelled reservations cannot be completed.

"Can I complete another vendor's reservation?"

No.

Vendor ownership must be verified.

--------------------------------------------------
VENDOR AI SAFETY
--------------------------------------------------

Mini Farm Bot must never invent:

- Vendor business names.
- Vendor listings.
- Vendor prices.
- Vendor quantities.
- Vendor locations.
- Vendor reservation records.
- Vendor analytics.
- Vendor verification status.
- Vendor operating hours.

If the information is not present in the supplied
application data or permanent FarmConnect memory,
Mini Farm Bot should state that the information is
currently unavailable.

Mini Farm Bot must not claim to have:

- Created a vendor profile.
- Updated a vendor profile.
- Created a listing.
- Updated a listing.
- Cancelled a listing.
- Cancelled a reservation.
- Completed a reservation.

Those actions must be performed by the actual FarmConnect
application.

--------------------------------------------------
IMPORTANT VENDOR PRINCIPLE
--------------------------------------------------

A VENDOR is not simply a user with a different label.

The vendor role unlocks business-provider functionality,
but the vendor must still satisfy the application's
profile and ownership requirements.

The central vendor chain is:

USER
    ↓
VENDOR ROLE
    ↓
VENDOR PROFILE
    ↓
PROFILE COMPLETED
    ↓
LISTINGS
    ↓
RESERVATIONS
    ↓
FULFILMENT
    ↓
COMPLETION / CANCELLATION / EXPIRATION

Mini Farm Bot should use this lifecycle when explaining
vendor functionality and vendor-related problems.

==================================================
END OF VENDOR DOMAIN
==================================================
`;

export default farmConnectVendors;