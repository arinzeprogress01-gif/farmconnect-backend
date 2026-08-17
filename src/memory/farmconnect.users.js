const farmConnectUsers = `
==================================================
FARMCONNECT USER DOMAIN
==================================================

USER DOMAIN OVERVIEW

A USER is a normal consumer of the FarmConnect marketplace.

The User account handles authentication and account-level
information, while the AppUserProfile contains information
specific to the user's FarmConnect experience.

The User and AppUserProfile are separate but connected entities.

USER ACCOUNT

The User account can contain:

- fullName
- email
- password
- phone
- role
- profileCompleted
- isVerified
- isActive
- permissions
- devices
- passwordReset
- reservationRestriction
- isSuperAdmin

The USER role represents a consumer of FarmConnect.

A USER is different from a VENDOR.

USER CAPABILITIES

A normal FarmConnect user can:

- Register an account.
- Log in.
- Create a user profile.
- View their user profile.
- Update their user profile.
- Delete their user profile.
- Update their geographic location.
- Discover marketplace listings.
- Search marketplace listings.
- Filter listings by category.
- Find nearby listings.
- View food categories.
- Reserve available food.
- View their reservations.
- View reservation history.
- Cancel their own active reservations.
- Receive reservation notifications.
- Receive system notifications.
- Register a device for push notifications.
- Request password reset.
- Verify password-reset OTP.
- Reset their password.
- View user dashboard analytics.

--------------------------------------------------
USER PROFILE
--------------------------------------------------

The application-specific user profile is AppUserProfile.

The profile is associated with a User account through userId.

The profile can contain information including:

- userId
- fullName
- phone
- profileImage
- gender
- dateOfBirth
- address
- city
- state
- location
- preferredFoodCategories
- bio
- savedVendors

The user's account information and profile information should
not be treated as the same object.

The User entity handles account/authentication information.

The AppUserProfile handles user-specific FarmConnect information.

--------------------------------------------------
USER PROFILE CREATION
--------------------------------------------------

A user profile can only be created for a valid User account.

The system verifies:

1. The User exists.
2. The User has the USER role.
3. A profile does not already exist.

If the user does not exist:

"User not found."

If the authenticated account is not a USER:

"Only users can create a profile."

If a profile already exists:

"User profile already exists."

The profile receives account information such as:

- fullName
- phone

from the User account.

After successful profile creation:

profileCompleted = true

A notification is sent to the user confirming that
their profile was created successfully.

IMPORTANT:

Mini Farm Bot should understand that creating a USER
profile is different from registering a USER account.

Registration creates the account.

Profile creation completes the FarmConnect user profile.

--------------------------------------------------
USER PROFILE RETRIEVAL
--------------------------------------------------

A user can retrieve their own profile.

If the profile does not exist:

"User profile not found."

Mini Farm Bot should not assume that every registered
user has already completed their profile.

A registered account and a completed FarmConnect profile
are separate states.

--------------------------------------------------
USER PROFILE UPDATE
--------------------------------------------------

A user can update their own profile.

The system first checks that the profile exists.

If no profile exists:

"User profile not found."

The update operates on the authenticated user's profile.

--------------------------------------------------
USER PROFILE DELETION
--------------------------------------------------

A user can delete their own user profile.

The system first checks that the profile exists.

After deletion:

- The profile is removed.
- A notification is sent to the user confirming deletion.

Mini Farm Bot must not claim that deleting a profile
automatically deletes the user's entire authentication
account unless the application explicitly provides that behavior.

--------------------------------------------------
USER LOCATION
--------------------------------------------------

A user's location is represented using GeoJSON.

The location format is:

type: "Point"

coordinates:

[longitude, latitude]

IMPORTANT:

FarmConnect uses LONGITUDE FIRST.

Correct:

[longitude, latitude]

Incorrect:

[latitude, longitude]

Coordinates are validated before being stored.

If invalid coordinates are supplied:

"Invalid location coordinates."

If the user profile does not exist:

"User profile not found."

The user's location can be used to support geographic
food discovery and nearby listing searches.

--------------------------------------------------
NEARBY FOOD DISCOVERY
--------------------------------------------------

FarmConnect can use the user's stored location to find
nearby food listings.

Nearby discovery is based on geographic distance.

A user can also provide explicit longitude and latitude
coordinates when requesting nearby listings.

When explicit coordinates are supplied:

1. Coordinates are validated.
2. The geographic search uses the supplied coordinates.
3. A maximum search distance may be supplied.

The system's geographic coordinate convention remains:

[longitude, latitude]

Mini Farm Bot should use the user's known location when
available, but must not invent an exact geographic position.

If the system does not have enough location information,
Mini Farm Bot should say that location information is
unavailable rather than inventing a location.

--------------------------------------------------
USER RESERVATIONS
--------------------------------------------------

Users are consumers of food listings.

A user can reserve a listing when:

- The listing exists.
- The listing is available.
- The listing is active.
- The listing has available quantity.
- The requested quantity does not exceed the available quantity.
- The user is not temporarily restricted from reserving that listing.

When a reservation succeeds:

- A reservation is created.
- A reservation ID is generated.
- A pickup code is generated.
- Listing quantity decreases.
- Listing reservation count increases.
- The user receives a reservation confirmation notification.
- The vendor receives a new-reservation notification.

Mini Farm Bot must distinguish between:

"food exists"

and:

"food is currently available for reservation."

A listing can exist in the database without currently being
available for reservation.

--------------------------------------------------
USER RESERVATION OWNERSHIP
--------------------------------------------------

A user can only cancel their own reservation.

The system checks:

reservation.user === authenticated user

If another user's reservation is targeted:

"You can only cancel your own reservation."

Mini Farm Bot must never imply that one user can manage
another user's reservation.

--------------------------------------------------
USER RESERVATION CANCELLATION
--------------------------------------------------

A user can cancel an active reservation.

The reservation must have:

status = "reserved"

Only active reservations can be cancelled by the user.

When the user cancels:

1. Reservation becomes cancelled.
2. Listing quantity is restored.
3. The listing may become available again.
4. A temporary reservation restriction is created.
5. Vendor is notified.
6. User is notified.

The restored quantity is:

listing.quantity += reservation.quantityRequested

If the listing was waiting for completion because all
available quantity had been reserved, the listing can be
reopened when quantity becomes available again.

--------------------------------------------------
USER RE-RESERVATION RESTRICTION
--------------------------------------------------

FarmConnect temporarily prevents a user from immediately
reserving the same listing after cancelling it.

The restriction contains:

- listing
- blockedUntil

The current implementation blocks the user for:

1 hour

If the user attempts to reserve the same listing during
the restriction period, the reservation is rejected.

The user receives a message explaining that they must wait
until the restriction expires.

IMPORTANT:

This restriction applies to the recently cancelled listing.

It does not mean the user is permanently banned from
making reservations.

--------------------------------------------------
USER RESERVATION EXPIRATION
--------------------------------------------------

Reservations can expire automatically.

When a reservation expires:

- Reservation status becomes "expired".
- Requested quantity is restored to the listing.
- The listing can become available again.
- The user receives an expiration notification.
- The vendor receives an expiration notification.

Mini Farm Bot should explain reservation expiration as
an automatic system lifecycle event, not necessarily as
a manual cancellation by the user or vendor.

--------------------------------------------------
USER PICKUP CODE
--------------------------------------------------

A successful reservation receives a pickup code.

The pickup code is associated with the reservation.

The user receives the pickup code as part of reservation
confirmation.

Mini Farm Bot may explain that a reservation has a pickup
code when discussing the reservation process.

Mini Farm Bot must not invent a user's actual pickup code
unless that code is explicitly supplied in live application
data.

--------------------------------------------------
USER RESERVATION COMPLETION
--------------------------------------------------

Reservation completion is performed by the vendor.

A user does not mark their own reservation as completed
through the vendor completion workflow.

When the vendor completes a reservation:

status = "completed"

completedAt = current time

The user receives a completion notification.

Completed reservations contribute to the user's
"meals rescued" analytics.

--------------------------------------------------
USER DASHBOARD ANALYTICS
--------------------------------------------------

The user dashboard can provide:

- totalReservations
- activeReservations
- completedReservations
- cancelledReservations
- mealsRescued

Definitions:

TOTAL RESERVATIONS

The total number of reservations belonging to the user.

ACTIVE RESERVATIONS

Reservations whose status is:

"reserved"

COMPLETED RESERVATIONS

Reservations whose status is:

"completed"

CANCELLED RESERVATIONS

Reservations whose status is:

"cancelled"

MEALS RESCUED

The number of requested food portions associated with
completed reservations.

It is calculated by summing:

quantityRequested

for completed reservations.

Therefore:

mealsRescued does not simply mean the number of
completed reservations.

For example:

Reservation A = 2 portions
Reservation B = 5 portions

If both are completed:

mealsRescued = 7

--------------------------------------------------
USER NOTIFICATIONS
--------------------------------------------------

Users can receive notifications for events including:

- Profile creation
- Profile deletion
- Reservation creation
- Reservation confirmation
- Reservation cancellation
- Reservation completion
- Reservation expiration
- Password reset/security events
- System events
- Other FarmConnect events

Notifications are persistent application records.

Push notifications may also be delivered when a device
is registered.

--------------------------------------------------
USER DEVICE REGISTRATION
--------------------------------------------------

Users can register devices for push notifications.

The device information is associated with the User account.

Registered device information can include:

- device token
- platform
- browser
- lastSeen

Device registration requires:

1. Valid device data.
2. Existing authenticated User.

If the user does not exist:

"User not found."

Device registration allows FarmConnect to send push
notifications to the user's registered device.

--------------------------------------------------
USER PASSWORD RESET
--------------------------------------------------

Password reset is handled through the authentication
system.

The user:

1. Requests a password reset.
2. Receives an OTP.
3. Verifies the OTP.
4. Provides a new password.
5. Password is updated.
6. Reset state is cleared.

OTP rules:

- OTP expires after 5 minutes.
- Maximum verification attempts are 5.

Mini Farm Bot must never expose sensitive authentication
information.

--------------------------------------------------
USER VS VENDOR
--------------------------------------------------

Mini Farm Bot must correctly distinguish the USER role
from the VENDOR role.

A USER is primarily a food consumer.

A VENDOR is primarily a food provider.

USER:

Discover
→ Reserve
→ Pickup
→ Receive food
→ View reservation history

VENDOR:

Create listing
→ Receive reservation
→ Prepare food
→ Complete/cancel reservation

A user cannot be assumed to have vendor capabilities.

A vendor cannot be assumed to have user-profile capabilities
unless the actual application provides them.

--------------------------------------------------
USER AI GUIDANCE
--------------------------------------------------

When speaking to a user, Mini Farm Bot should:

- Explain food discovery clearly.
- Recommend available listings using live listing data.
- Explain reservation requirements.
- Explain cancellation consequences.
- Explain pickup codes.
- Explain reservation expiration.
- Explain nearby-food functionality.
- Help interpret user dashboard statistics.
- Explain FarmConnect features.

Mini Farm Bot must not:

- Invent food availability.
- Invent prices.
- Invent vendors.
- Invent pickup locations.
- Invent reservation records.
- Invent pickup codes.
- Claim that a reservation was created.
- Claim that a reservation was cancelled.
- Claim that a reservation was completed.
- Claim that a profile was changed.
- Claim that an application action was performed.

Mini Farm Bot provides guidance and information.

The FarmConnect application performs the actual operations.

--------------------------------------------------
IMPORTANT USER DOMAIN PRINCIPLE
--------------------------------------------------

A user's ability to perform an operation depends on:

- Their authenticated identity.
- Their role.
- Their profile state.
- Ownership of the relevant resource.
- The current state of the resource.
- Applicable FarmConnect business restrictions.

Mini Farm Bot should reason using these conditions rather
than assuming that every requested action is automatically
allowed.
`;

export default farmConnectUsers;