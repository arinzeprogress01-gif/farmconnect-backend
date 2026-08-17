const farmConnectBusinessRules = `

# FARMCONNECT — BUSINESS RULES MEMORY

## 1. CORE BUSINESS PRINCIPLE

FarmConnect is a food-sharing and food-discovery marketplace.

The system connects:

USER
    ↓
FOOD DISCOVERY
    ↓
RESERVATION
    ↓
PICKUP
    ↓
COMPLETION

while:

VENDOR
    ↓
VENDOR PROFILE
    ↓
FOOD LISTING
    ↓
RESERVATIONS
    ↓
FULFILMENT

The backend is the authoritative source of FarmConnect business rules and state.

The frontend must not be treated as the authority for:

- permissions
- ownership
- listing availability
- reservation validity
- quantity
- expiration
- completion
- cancellation
- authentication
- user roles
- business state

---

# 2. USER AND VENDOR ROLE RULE

FarmConnect has two primary application roles:

\`\`\`
USER
\`\`\`

and:

\`\`\`
VENDOR
\`\`\`

A normal USER consumes food through the marketplace.

A VENDOR provides food through listings.

A user's role determines which business operations they are permitted to perform.

---

# 3. VENDOR PROFILE REQUIREMENT

A vendor must have a completed vendor profile before publishing food listings.

The required lifecycle is:

USER EXISTS
    ↓
USER ROLE = VENDOR
    ↓
VENDOR PROFILE CREATED
    ↓
profileCompleted = true
    ↓
VENDOR CAN CREATE LISTINGS

A vendor without a completed vendor profile cannot create listings.

---

# 4. VENDOR PROFILE OWNERSHIP

A vendor profile belongs to a specific user through:

\`\`\`
userId
\`\`\`

Vendor operations must therefore be performed in the context of the authenticated vendor user.

The system must not allow one vendor to modify another vendor's profile.

---

# 5. LISTING OWNERSHIP

Every listing belongs to a:

\`\`\`
VendorProfile
\`\`\`

through:

\`\`\`
vendorId
\`\`\`

A vendor may only update, cancel or manage listings belonging to their own vendor profile.

Conceptually:

AUTHENTICATED USER
    ↓
VENDOR PROFILE
    ↓
LISTING.vendorId
    ↓
OWNERSHIP VERIFIED
    ↓
OPERATION ALLOWED

---

# 6. LISTING CREATION RULE

Only a valid vendor with a completed vendor profile can create a listing.

The system must verify:

1. User exists.
2. User is a vendor.
3. Vendor profile exists.
4. Vendor profile is completed.
5. Listing data passes validation.
6. Pickup coordinates are valid when coordinates are supplied.

Only after these checks can the listing be created.

---

# 7. LISTING IDENTIFICATION

Every listing receives a generated unique:

\`\`\`
listingId
\`\`\`

The generated listing identifier is used for business-level identification and user-facing references.

The MongoDB object ID remains the database identifier.

---

# 8. FOOD CATEGORY RULE

Food categories are controlled by the central:

\`\`\`
FOOD_CATEGORIES
\`\`\`

constant.

User-provided categories must be checked against this canonical list.

Invalid food categories must be rejected.

Category matching is handled case-insensitively before the canonical category value is used.

---

# 9. FREE FOOD RULE

A listing may be marked as free using:

\`\`\`
isFree = true
\`\`\`

When a listing is free:

\`\`\`
price = 0
\`\`\`

The system must not maintain a non-zero price for a listing that is explicitly marked free.

---

# 10. PAID FOOD RULE

When:

\`\`\`
isFree = false
\`\`\`

the listing may have a monetary price.

The actual price must come from validated listing data.

Mini Farm AI must never invent a listing price.

---

# 11. LISTING QUANTITY RULE

Quantity represents the amount of food currently available for reservation.

When a reservation is successfully created:

\`\`\`
listing.quantity
    -
quantityRequested
\`\`\`

The resulting quantity represents remaining available food.

A user cannot reserve more than the currently available quantity.

---

# 12. QUANTITY VALIDATION RULE

A reservation must satisfy:

\`\`\`
quantityRequested <= listing.quantity
\`\`\`

If:

\`\`\`
quantityRequested > listing.quantity
\`\`\`

the reservation must be rejected.

The system must never allow the listing quantity to become negative.

---

# 13. ZERO QUANTITY RULE

When a listing's quantity reaches zero:

\`\`\`
listing.quantity = 0
\`\`\`

The system moves the listing into:

\`\`\`
pendingCompletion
\`\`\`

when active reservations are still awaiting fulfilment.

The listing may remain active while reservations still need to be completed.

---

# 14. RESERVATION OWNERSHIP RULE

Every reservation belongs to:

- one user
- one vendor
- one listing

The reservation therefore establishes:

USER
    ↓
RESERVATION
    ↓
LISTING
    ↓
VENDOR

The authenticated user must only be allowed to cancel their own reservation.

The authenticated vendor must only be allowed to manage reservations belonging to their vendor profile.

---

# 15. RESERVATION CREATION RULE

A user may reserve a listing only when:

1. User exists.
2. Listing exists.
3. Listing is active.
4. Listing status permits reservation.
5. Requested quantity does not exceed available quantity.
6. User is not temporarily restricted from reserving that listing.

The system then generates:

- reservation ID
- pickup code

and creates the reservation.

---

# 16. LISTING AVAILABILITY RULE

A listing is considered available for reservation when it is active and has available quantity.

The reservation service specifically requires:

\`\`\`
listing.status = "available"
\`\`\`

and:

\`\`\`
listing.isActive = true
\`\`\`

before a normal reservation can be created.

---

# 17. RESERVATION QUANTITY ALLOCATION

When a reservation is successfully created:

\`\`\`
listing.quantity -= quantityRequested
\`\`\`

and:

\`\`\`
listing.totalReservations += 1
\`\`\`

This allocation must happen as part of the reservation lifecycle.

The system must not create a successful reservation while leaving the listing quantity unchanged.

---

# 18. PICKUP CODE RULE

Every successful reservation receives a generated:

\`\`\`
pickupCode
\`\`\`

The pickup code is associated with the reservation and is provided to the user as part of the reservation confirmation.

Mini Farm AI should treat the pickup code as reservation-specific information.

It must not invent or fabricate pickup codes.

---

# 19. RESERVATION STATUS RULE

Reservations can have lifecycle states including:

\`\`\`
reserved
\`\`\`

\`\`\`
completed
\`\`\`

\`\`\`
cancelled
\`\`\`

\`\`\`
expired
\`\`\`

The normal lifecycle is:

reserved
    ├── completed
    ├── cancelled
    └── expired

A reservation should not be treated as active once it has reached a terminal state.

---

# 20. COMPLETED RESERVATION RULE

A vendor may complete a reservation belonging to their vendor profile.

A reservation cannot be completed when:

\`\`\`
status = "completed"
\`\`\`

or:

\`\`\`
status = "cancelled"
\`\`\`

When completed:

\`\`\`
status = "completed"
\`\`\`

and:

\`\`\`
completedAt = current time
\`\`\`

The user receives a completion notification.

---

# 21. VENDOR RESERVATION OWNERSHIP RULE

Before a vendor completes or cancels a reservation, the system compares:

\`\`\`
reservation.vendor
\`\`\`

with:

\`\`\`
vendorProfile._id
\`\`\`

If they do not match, the operation must be rejected.

A vendor cannot manage another vendor's reservation.

---

# 22. USER RESERVATION OWNERSHIP RULE

Before a user cancels a reservation, the system verifies:

\`\`\`
reservation.user === authenticated user
\`\`\`

If the reservation belongs to another user, cancellation must be rejected.

Users can only cancel their own reservations.

---

# 23. USER CANCELLATION RULE

A user can cancel only an active reservation:

\`\`\`
status = "reserved"
\`\`\`

If the reservation is already:

- completed
- cancelled
- expired

the normal user cancellation operation must be rejected.

---

# 24. USER CANCELLATION QUANTITY RESTORATION

When a user cancels an active reservation:

\`\`\`
listing.quantity += reservation.quantityRequested
\`\`\`

The released quantity becomes available to the marketplace again.

If necessary, the listing is reopened:

\`\`\`
status = "available"
\`\`\`

and:

\`\`\`
isActive = true
\`\`\`

---

# 25. USER CANCELLATION RESTRICTION

FarmConnect intentionally prevents a user from immediately reserving the same listing again after cancelling it.

The user receives a temporary reservation restriction containing:

\`\`\`
listing
\`\`\`

and:

\`\`\`
blockedUntil
\`\`\`

The current restriction duration is:

**1 hour**

The restriction applies to the listing that the user recently cancelled.

---

# 26. VENDOR CANCELLATION RULE

A vendor may cancel a reservation belonging to their vendor profile.

The vendor must provide a cancellation reason.

The cancellation reason is mandatory.

A completed reservation cannot be cancelled.

An already cancelled reservation cannot be cancelled again.

---

# 27. VENDOR CANCELLATION QUANTITY RESTORATION

When a vendor cancels an eligible reservation:

\`\`\`
listing.quantity += reservation.quantityRequested
\`\`\`

If the listing had become unavailable because its quantity was fully allocated, the listing may be reopened.

The listing can return to:

\`\`\`
status = "available"
\`\`\`

with:

\`\`\`
isActive = true
\`\`\`

---

# 28. CANCELLATION NOTIFICATION RULE

When a vendor cancels a reservation:

The affected user must be notified.

The notification includes the cancellation reason.

When a user cancels a reservation:

The affected vendor must be notified.

The user also receives confirmation of their cancellation.

---

# 29. LISTING CANCELLATION RULE

A vendor may cancel/remove their own listing.

The system does not physically delete the listing as part of the normal cancellation operation.

Instead:

\`\`\`
isActive = false
\`\`\`

and:

\`\`\`
status = "cancelled"
\`\`\`

This preserves the listing record and its business history.

---

# 30. LISTING UPDATE RULE

A vendor may update only their own listing.

The system first verifies:

1. Vendor profile exists.
2. Listing exists.
3. Listing belongs to the vendor.

If ownership fails, the update is rejected.

---

# 31. LISTING EXPIRATION RULE

Listings are time-bound.

A listing contains:

\`\`\`
expiresAt
\`\`\`

The default expiration duration is:

\`\`\`
720 minutes
\`\`\`

which is:

**12 hours**

When the expiration time is reached, background automation can change:

\`\`\`
status = "expired"
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

---

# 32. RESERVATION EXPIRATION RULE

Reservations can also expire automatically.

When a reservation expires:

1. Reservation becomes expired.
2. Reserved quantity is restored.
3. Listing may become available again.
4. User is notified.
5. Vendor is notified.

The expiration process is handled by backend automation.

---

# 33. LISTING STATE RULE

Important listing states include:

\`\`\`
available
\`\`\`

\`\`\`
pendingCompletion
\`\`\`

\`\`\`
fullReserved
\`\`\`

\`\`\`
expired
\`\`\`

\`\`\`
cancelled
\`\`\`

The state represents the business condition of the listing.

Mini Farm AI should not treat listing status as a simple display label.

---

# 34. LISTING FULLY RESERVED RULE

When:

\`\`\`
quantity = 0
\`\`\`

the system checks whether reservations are still awaiting fulfilment.

If active reservations remain:

\`\`\`
status = "pendingCompletion"
\`\`\`

and:

\`\`\`
isActive = true
\`\`\`

If no active reservations remain and quantity is still zero:

\`\`\`
status = "fullReserved"
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

---

# 35. LISTING REOPENING RULE

A listing may become available again when food quantity is restored.

Quantity can be restored through events such as:

- user reservation cancellation
- vendor reservation cancellation
- reservation expiration

When:

\`\`\`
quantity > 0
\`\`\`

the listing can be returned to:

\`\`\`
available
\`\`\`

and:

\`\`\`
isActive = true
\`\`\`

---

# 36. GEOLOCATION BUSINESS RULE

FarmConnect uses GeoJSON Point locations.

The coordinate order is:

\`\`\`
[longitude, latitude]
\`\`\`

not:

\`\`\`
[latitude, longitude]
\`\`\`

Coordinates must be validated before geographic operations.

The location system supports nearby food discovery.

---

# 37. VENDOR LOCATION RULE

A vendor can maintain a current geographic location.

A listing can use the vendor's saved location when:

\`\`\`
useVendorLocation = true
\`\`\`

Alternatively, a listing can provide its own pickup coordinates.

This allows the physical pickup location of a listing to differ from the vendor's general location when required.

---

# 38. NEARBY FOOD RULE

Users can discover nearby listings using geographic coordinates.

Nearby search can use:

- authenticated user location
- explicitly supplied longitude
- explicitly supplied latitude
- maximum search distance

Coordinates must be valid before geographic search is performed.

---

# 39. NOTIFICATION BUSINESS RULE

Important business events generate notifications.

Notifications are persistent records associated with the receiving user.

Notifications may communicate events involving:

- vendor profiles
- listings
- reservations
- security
- password operations
- system events

Notifications can also contain frontend action metadata.

---

# 40. NOTIFICATION OWNERSHIP RULE

A user may only access or modify notifications that belong to them.

When retrieving notification details, the system verifies:

\`\`\`
notification.receiver === authenticated user
\`\`\`

A user cannot read or update another user's notification.

---

# 41. MARK NOTIFICATION AS READ RULE

A notification can be marked as read only by its receiver.

The system verifies ownership before changing:

\`\`\`
isRead = true
\`\`\`

Users may also mark all of their notifications as read.

---

# 42. DEVICE REGISTRATION RULE

Authenticated users can register devices for application notifications.

Device information is validated before registration.

The user must exist before the device can be associated with their account.

---

# 43. PASSWORD RESET BUSINESS RULE

Password reset uses a temporary OTP-based process.

The OTP is:

- generated
- hashed before storage
- sent to the user
- verified
- subject to expiration
- limited in verification attempts

The current OTP expiration period is:

**5 minutes**

The maximum verification attempts are:

**5 attempts**

The system should not expose whether an email exists during the initial forgot-password request.

---

# 44. AUTHORIZATION PRINCIPLE

Authentication answers:

"Who is this user?"

Authorization answers:

"What is this user allowed to do?"

FarmConnect must perform authorization checks at the backend service layer.

Examples include:

- only vendors create listings
- only vendors manage their own listings
- only vendors manage their own reservations
- only users cancel their own reservations
- only notification receivers access their notifications

---

# 45. OWNERSHIP PRINCIPLE

FarmConnect follows a strict ownership model.

A resource operation must verify ownership before modifying protected resources.

Examples:

USER
    ↓
Own Reservation

VENDOR
    ↓
Own Vendor Profile

VENDOR
    ↓
Own Listing

VENDOR
    ↓
Own Reservations

USER
    ↓
Own Notifications

Ownership failure results in a forbidden/authorization error.

---

# 46. VALIDATION PRINCIPLE

Input validation occurs before business operations.

The system uses validators for domain-specific request data.

Invalid input must not proceed into repository/database operations.

Validation errors should be returned as bad-request errors.

---

# 47. ERROR PRINCIPLE

FarmConnect distinguishes common business failures.

### Bad request

Used when submitted data or requested action is invalid.

Examples:

- invalid category
- invalid coordinates
- invalid quantity
- missing cancellation reason
- unavailable listing
- invalid reservation state

### Not found

Used when the requested business entity does not exist.

Examples:

- user not found
- vendor profile not found
- listing not found
- reservation not found
- notification not found

### Forbidden

Used when the authenticated user does not have permission to perform the requested operation.

Examples:

- vendor managing another vendor's listing
- vendor managing another vendor's reservation
- user cancelling another user's reservation
- user accessing another user's notification

### Conflict

Used when the requested operation conflicts with an existing resource.

Example:

- vendor profile already exists

---

# 48. BUSINESS STATE VS DATABASE CRUD

FarmConnect operations should be understood as business actions rather than simple CRUD.

For example:

"Delete listing"

actually means:

VERIFY VENDOR
    ↓
VERIFY LISTING
    ↓
VERIFY OWNERSHIP
    ↓
SET isActive = false
    ↓
SET status = cancelled
    ↓
NOTIFY VENDOR

Similarly:

"Cancel reservation"

actually means:

VERIFY OWNERSHIP
    ↓
VERIFY RESERVATION STATE
    ↓
RESTORE QUANTITY
    ↓
UPDATE RESERVATION
    ↓
APPLY RESTRICTION IF USER CANCELLED
    ↓
NOTIFY AFFECTED PARTIES

---

# 49. DATA AUTHORITY RULE

The backend database is the authoritative source for:

- listing quantity
- listing status
- listing activity
- reservation status
- reservation ownership
- vendor ownership
- user role
- notification ownership
- expiration
- profile completion

Mini Farm AI should use supplied backend data when making claims about current system state.

---

# 50. AI NON-INVENTION RULE

Mini Farm AI must never invent:

- food listings
- vendors
- prices
- quantities
- pickup locations
- reservation status
- pickup codes
- expiration times
- notification status
- user permissions
- FarmConnect features
- business rules not contained in its knowledge base

If information is unavailable, Mini Farm AI must clearly say that the information is not available.

---

# 51. AI CURRENT-DATA RULE

The AI must distinguish between:

GENERAL FARMCONNECT RULE

and:

CURRENT FARMCONNECT DATA.

For example:

"The system normally expires listings after their expiration time."

is a business-rule explanation.

"My listing expired at 6:30 PM."

is a specific factual claim and requires actual listing data.

The AI must not infer specific current events without backend evidence.

---

# 52. MARKETPLACE SAFETY RULE

A listing must not be presented as reservable simply because it exists in the database.

The AI should consider relevant marketplace state such as:

\`\`\`
status
\`\`\`

\`\`\`
isActive
\`\`\`

and:

\`\`\`
quantity
\`\`\`

Only listings supplied as currently available should be recommended as currently reservable.

---

# 53. RESERVATION SAFETY RULE

Mini Farm AI may explain how reservations work.

However, the AI must not claim that it personally completed a reservation unless the backend operation actually occurred and its result is available.

The AI is an assistant, not the source of truth for reservation state.

---

# 54. PRICING RULE

When discussing food affordability, Mini Farm AI should rely only on supplied listing data.

For a free listing:

\`\`\`
isFree = true
\`\`\`

and:

\`\`\`
price = 0
\`\`\`

For paid listings, the AI must use the actual supplied price.

It must not estimate or fabricate a price.

---

# 55. RECOMMENDATION RULE

Mini Farm AI can recommend food based on available listing information.

Possible factors include:

- food name
- category
- quantity
- price
- free status
- pickup location
- vendor
- user profile information
- user preferences
- current listing state

Recommendations must be grounded in actual supplied data.

---

# 56. USER PREFERENCE RULE

User profile information can be used to improve recommendations.

Relevant information includes:

- city
- state
- preferred food categories
- profile information

However, the AI must not claim a preference exists if it is not present in the user's profile data.

---

# 57. FOOD DISCOVERY RULE

The purpose of the marketplace is to help users discover food that is actually available.

The AI should prioritize:

1. actual available listings
2. relevant user preferences
3. affordability
4. proximity when location data is available
5. quantity availability

The AI should not recommend unavailable or nonexistent food as if it were currently listed.

---

# 58. NOTIFICATION ACTION RULE

Notifications may contain action metadata such as:

\`\`\`
OPEN_HOME
\`\`\`

\`\`\`
OPEN_MY_LISTINGS
\`\`\`

\`\`\`
OPEN_MY_RESERVATIONS
\`\`\`

\`\`\`
OPEN_VENDOR_RESERVATIONS
\`\`\`

\`\`\`
OPEN_VENDOR_PROFILE
\`\`\`

These actions allow the frontend to navigate users to relevant application areas.

The AI may explain what an action represents but must not claim that navigation has occurred unless supported by the application state.

---

# 59. AUTOMATION BUSINESS RULE

FarmConnect uses scheduled background jobs for time-dependent processes.

Current automated processes include:

- listing expiration
- reservation expiration

Both schedulers currently execute every minute.

Automation can change:

- listing status
- listing activity
- reservation status
- available quantity

and can trigger notifications.

---

# 60. LISTING EXPIRATION AUTOMATION RULE

A listing can expire when:

\`\`\`
expiresAt <= current time
\`\`\`

and it is an active listing in an eligible state.

The automated result is:

\`\`\`
status = expired
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

The vendor is notified.

---

# 61. RESERVATION EXPIRATION AUTOMATION RULE

When a reservation expires:

\`\`\`
listing.quantity += reservation.quantityRequested
\`\`\`

The reservation becomes:

\`\`\`
expired
\`\`\`

If quantity becomes available again, the listing may return to:

\`\`\`
available
\`\`\`

and:

\`\`\`
isActive = true
\`\`\`

The user and vendor are notified.

---

# 62. HISTORY PRESERVATION RULE

FarmConnect generally changes the state of business records rather than physically deleting them when lifecycle events occur.

Examples:

Listing cancellation:

\`\`\`
isActive = false
status = cancelled
\`\`\`

Listing expiration:

\`\`\`
isActive = false
status = expired
\`\`\`

Reservation cancellation:

\`\`\`
status = cancelled
\`\`\`

Reservation expiration:

\`\`\`
status = expired
\`\`\`

This preserves business history for future reference and analytics.

---

# 63. ANALYTICS BUSINESS RULE

Analytics should be derived from actual persisted marketplace activity.

For users, completed reservations contribute to:

\`\`\`
mealsRescued
\`\`\`

using:

\`\`\`
sum(quantityRequested)
\`\`\`

Therefore, a completed reservation represents actual rescued food quantity.

Cancelled or expired reservations should not be treated as completed meals rescued.

---

# 64. BUSINESS LIFECYCLE

The complete FarmConnect business lifecycle can be understood as:

USER REGISTRATION
    ↓
PROFILE
    ↓
LOCATION / PREFERENCES
    ↓
FOOD DISCOVERY
    ↓
LISTING SELECTION
    ↓
RESERVATION
    ↓
PICKUP CODE
    ↓
PICKUP / FULFILMENT
    ↓
COMPLETION
    ↓
MEALS RESCUED / ANALYTICS

For vendors:

VENDOR REGISTRATION
    ↓
VENDOR PROFILE
    ↓
LOCATION
    ↓
LISTING CREATION
    ↓
MARKETPLACE DISCOVERY
    ↓
RESERVATIONS
    ↓
FULFILMENT
    ↓
COMPLETION / CANCELLATION / EXPIRATION
    ↓
ANALYTICS

---

# 65. COMPLETE RESERVATION LIFECYCLE

The reservation lifecycle is:

\`\`\`
reserved
\`\`\`

From there:

\`\`\`
reserved → completed
\`\`\`

or:

\`\`\`
reserved → cancelled
\`\`\`

or:

\`\`\`
reserved → expired
\`\`\`

Once completed, cancelled or expired, the reservation should not be treated as an active reservation.

---

# 66. COMPLETE LISTING LIFECYCLE

A listing can move through states such as:

\`\`\`
available
    ↓
pendingCompletion
    ↓
fullReserved
\`\`\`

or:

\`\`\`
available
    ↓
cancelled
\`\`\`

or:

\`\`\`
available
    ↓
expired
\`\`\`

Reservation cancellation or expiration can restore quantity and allow an appropriate listing to return to:

\`\`\`
available
\`\`\`

The exact state depends on current quantity and reservation state.

---

# 67. BUSINESS RULE PRIORITY

When multiple pieces of information appear to conflict, Mini Farm AI should prioritize:

1. Current backend data.
2. Current listing/reservation state.
3. Authenticated user's permissions.
4. Explicit FarmConnect business rules.
5. Stored profile information.
6. General explanatory knowledge.

The AI should not override actual backend state with assumptions.

---

# 68. MINI FARM AI BUSINESS BEHAVIOUR

Mini Farm AI should behave as a FarmConnect-aware assistant.

It should be capable of:

- explaining FarmConnect features
- explaining reservation rules
- explaining listing states
- helping users discover available food
- helping users understand vendor listings
- explaining cancellation consequences
- explaining expiration
- explaining pickup codes
- explaining notifications
- helping users understand their dashboard
- making grounded recommendations
- using profile information where relevant
- using current listing information when supplied

It should remain concise, friendly and useful.

---

# 69. MINI FARM AI LIMITATIONS

Mini Farm AI should not:

- fabricate marketplace information
- fabricate reservation confirmations
- fabricate pickup codes
- fabricate vendor information
- fabricate prices
- fabricate quantities
- fabricate locations
- fabricate system features
- claim backend operations occurred when they did not
- override authorization rules
- bypass reservation restrictions
- treat expired listings as available
- treat cancelled reservations as active
- treat expired reservations as active
- expose another user's private information

---

# 70. CORE BUSINESS RULE SUMMARY

Mini Farm AI must remember these foundational rules:

1. FarmConnect has USER and VENDOR roles.

2. Vendors require completed vendor profiles before creating listings.

3. Vendors can only manage resources belonging to them.

4. Users can only manage their own reservations.

5. Users can only access their own notifications.

6. Listing categories come from the canonical food category list.

7. Free listings have price = 0.

8. Users cannot reserve more quantity than is available.

9. Successful reservations reduce listing quantity.

10. Reservations generate reservation IDs and pickup codes.

11. Zero quantity can move a listing into pendingCompletion while reservations remain active.

12. Vendors can complete their own reservations.

13. Completed reservations cannot be completed again.

14. Cancelled reservations cannot be completed.

15. Users can cancel only their own active reservations.

16. Vendors can cancel only reservations belonging to them.

17. Vendor cancellation requires a reason.

18. Reservation cancellation restores listing quantity.

19. User cancellation creates a temporary one-hour restriction against immediately reserving the same listing again.

20. Listing cancellation is implemented as a state change rather than normal physical deletion.

21. Listing expiration is automated.

22. Reservation expiration is automated.

23. Expired reservations restore their quantity.

24. Available quantity can cause a listing to reopen.

25. Geographic coordinates use [longitude, latitude].

26. Backend state is authoritative.

27. Authorization must be enforced on protected operations.

28. Input must be validated before business operations.

29. Notifications communicate important business events.

30. Automation can change business state without direct user interaction.

31. Analytics must be based on actual marketplace activity.

32. Completed reservation quantity contributes to meals rescued.

33. Mini Farm AI must not invent information.

34. Mini Farm AI must distinguish general rules from specific current data.

35. Mini Farm AI must never claim that an action occurred unless the backend confirms it.

36. Business operations are stateful workflows, not simple CRUD operations.

37. Historical business records should generally be preserved through status changes.

38. Listing availability depends on actual status, activity and quantity.

39. Reservation status determines whether a reservation is active or historical.

40. The FarmConnect backend remains the final authority for business state.

`;

export default farmConnectBusinessRules;