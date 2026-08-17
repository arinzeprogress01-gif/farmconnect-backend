const farmConnectReservations = `

# FARMCONNECT — RESERVATIONS MEMORY

## 1. RESERVATION DOMAIN

Reservations are the bridge between:

USER
    ↓
RESERVATION
    ↓
LISTING
    ↓
VENDOR

A reservation represents a user's request to claim a specific quantity of food from an available FarmConnect listing.

Reservations are stateful business entities. They are not simple CRUD records.

The reservation lifecycle affects:

- listing quantity
- listing availability
- listing status
- vendor activity
- user activity
- pickup
- notifications
- expiration
- analytics

---

# 2. RESERVATION DATA

A reservation contains information including:

- reservationId
- pickupCode
- listing
- vendor
- user
- foodName
- category
- pickupLocation
- quantityRequested
- status
- cancellationReason
- reservedAt
- completedAt
- cancelledBy

The reservation keeps important food/listing information so the reservation remains understandable even as the listing changes.

---

# 3. RESERVATION STATUSES

FarmConnect reservations currently use:

- reserved
- completed
- cancelled
- expired

The normal lifecycle is:

reserved
    ↓
    ├── completed
    ├── cancelled
    └── expired

A completed reservation represents successful fulfilment.

A cancelled reservation represents a reservation that was intentionally cancelled by either the user or vendor.

An expired reservation represents a reservation that was automatically invalidated by the reservation expiration process.

---

# 4. CREATING A RESERVATION

A user creates a reservation by supplying:

- listingId
- quantityRequested

The reservation service validates the request using the reservation validation schema.

The system then confirms:

1. The user exists.
2. The listing exists.
3. The user is not temporarily restricted from reserving that listing.
4. The listing is active.
5. The listing status allows reservation.
6. The requested quantity does not exceed available quantity.

If any requirement fails, the reservation is rejected.

---

# 5. USER EXISTENCE

Before a reservation can be created:

User
    ↓
must exist

If the authenticated user cannot be found, the operation fails with:

"User not found."

---

# 6. LISTING EXISTENCE

The requested listing must exist.

If the listing cannot be found, the operation fails with:

"Food listing not found."

The reservation cannot proceed without a valid listing.

---

# 7. LISTING AVAILABILITY

A listing can only be reserved when:

status = available
    AND
isActive = true

A listing that is no longer active or has moved into an unavailable state cannot receive a new reservation.

---

# 8. QUANTITY VALIDATION

The requested quantity must not exceed the listing's available quantity.

Conceptually:

quantityRequested <= listing.quantity

If:

quantityRequested > listing.quantity

the reservation is rejected.

This prevents the marketplace from allocating more food than the vendor actually has.

---

# 9. RESERVATION RESTRICTION

FarmConnect deliberately prevents a user from immediately reserving the same listing after cancelling it.

The user account can contain:

reservationRestriction

with:

listing
blockedUntil

When a user cancels a reservation, the same listing is temporarily blocked for that user.

Current restriction duration:

1 hour

If the user attempts to reserve the same listing before blockedUntil expires, the reservation is rejected.

The purpose is to discourage repeated:

reserve → cancel → reserve → cancel

behaviour.

---

# 10. RESERVATION ID

Every successful reservation receives a generated:

reservationId

The reservation ID is the business-facing identifier for the reservation.

It is different from MongoDB's internal _id.

---

# 11. PICKUP CODE

Every successful reservation receives a generated:

pickupCode

The pickup code is supplied to the user as part of the reservation confirmation.

It represents the reservation's pickup identification mechanism.

The AI should understand that a pickup code belongs to a specific reservation.

---

# 12. RESERVATION CREATION

When a reservation succeeds, the system creates the reservation with:

status = reserved

The reservation records:

- listing
- vendor
- user
- food name
- category
- pickup location
- requested quantity
- reservation ID
- pickup code

---

# 13. LISTING QUANTITY AFTER RESERVATION

Creating a reservation consumes available listing quantity.

If:

listing.quantity = 10

and:

quantityRequested = 3

then:

listing.quantity = 7

The system also increments:

totalReservations

by 1.

---

# 14. FULLY RESERVED LISTING

If reservation causes:

listing.quantity <= 0

the system forces:

listing.quantity = 0

and changes:

listing.status = pendingCompletion

The listing remains:

isActive = true

because existing reservations may still need to be fulfilled.

This is important:

pendingCompletion does NOT mean the listing is immediately removed.

It means all available quantity has been allocated, but outstanding reservations may still need completion.

---

# 15. RESERVATION NOTIFICATIONS

A successful reservation generates notifications for both sides.

## Vendor notification

The vendor receives:

Title:
"New Reservation"

The message identifies:

- user
- quantity
- food

The notification contains:

reservationId
listingId
action = OPEN_VENDOR_RESERVATIONS

## User notification

The user receives:

Title:
"Reservation Confirmed"

The message identifies:

- food
- pickup code

The notification contains:

reservationId
action = OPEN_MY_RESERVATIONS

---

# 16. FULLY RESERVED NOTIFICATION

If the reservation causes listing quantity to become zero, the vendor additionally receives:

Title:

"Listing Fully Reserved"

The vendor is informed that the listing is fully reserved and waiting for reservation completion.

Action:

OPEN_MY_LISTINGS

---

# 17. VENDOR RESERVATION OWNERSHIP

A vendor can only manage reservations belonging to their own vendor profile.

The system does not directly trust a vendor-supplied vendor ID.

It resolves:

authenticated vendor user
    ↓
VendorProfile
    ↓
vendor._id

The reservation's vendor field must match that vendor profile.

---

# 18. VENDOR CANCELLATION

A vendor can cancel a reservation belonging to that vendor.

The system verifies:

1. Reservation exists.
2. Vendor profile exists.
3. Reservation belongs to the vendor.
4. Reservation is not already completed.
5. Reservation is not already cancelled.
6. Listing still exists.
7. Cancellation reason is supplied.

Cancellation reason is mandatory.

---

# 19. COMPLETED RESERVATION CANNOT BE CANCELLED

Once:

reservation.status = completed

the reservation cannot be cancelled.

This preserves the integrity of completed transactions.

---

# 20. ALREADY CANCELLED RESERVATION

A reservation already having:

status = cancelled

cannot be cancelled again.

The service rejects duplicate cancellation attempts.

---

# 21. VENDOR CANCELLATION EFFECT ON LISTING

When a vendor cancels a reservation:

listing.quantity += reservation.quantityRequested

The previously reserved quantity is returned to the listing.

If the listing had entered:

pendingCompletion

or:

fullReserved

the listing can be reopened:

status = available
isActive = true

This allows the released food quantity to become available again.

---

# 22. VENDOR CANCELLATION NOTIFICATION

When a vendor cancels a reservation, the affected user receives:

Title:

"Reservation Cancelled"

The notification includes the cancellation reason.

Action:

OPEN_MY_RESERVATIONS

The vendor is therefore responsible for communicating why the reservation was cancelled.

---

# 23. COMPLETING A RESERVATION

Only the vendor associated with the reservation can complete it.

The system verifies:

reservation.vendor
    ===
authenticated vendor profile

A vendor cannot complete another vendor's reservation.

---

# 24. COMPLETED RESERVATION RULES

A reservation cannot be completed if:

status = completed

A reservation cannot be completed if:

status = cancelled

Only an active reservation can proceed to completion.

When completed:

status = completed

completedAt = current time

---

# 25. COMPLETION NOTIFICATION

When a reservation is completed, the user receives:

Title:

"Reservation Completed"

The notification contains:

reservationId

Action:

OPEN_MY_RESERVATIONS

---

# 26. LISTING STATUS AFTER RESERVATION COMPLETION

After completing a reservation, FarmConnect checks the listing.

The system counts reservations where:

listing = current listing
status = reserved

This identifies reservations still waiting for fulfilment.

If:

listing.quantity = 0

AND:

pendingReservations = 0

then:

listing.status = fullReserved

listing.isActive = false

This means:

- no quantity remains
- no active reservation remains
- the listing no longer needs to remain active

---

# 27. USER CANCELLATION

Users can cancel their own reservations.

The system first verifies:

reservation.user === authenticated user

If not:

"You can only cancel your own reservation."

A user therefore cannot cancel another user's reservation.

---

# 28. USER CANCELLATION STATUS RULE

Only:

status = reserved

can be cancelled by the user.

Completed, expired or already cancelled reservations cannot be cancelled through the active-user cancellation flow.

---

# 29. USER CANCELLATION EFFECT ON QUANTITY

When a user cancels:

listing.quantity += reservation.quantityRequested

The released food becomes available again.

If the listing had been:

pendingCompletion

or:

fullReserved

the listing can be reopened:

status = available
isActive = true

---

# 30. USER CANCELLATION RESTRICTION

After cancellation, the user receives a restriction:

reservationRestriction = {
    listing: reservation.listing,
    blockedUntil: current time + 1 hour
}

The restriction applies specifically to the listing that was cancelled.

It does not globally prevent the user from making reservations elsewhere.

---

# 31. USER CANCELLATION NOTIFICATIONS

Two notifications are generated.

## Vendor

The vendor receives:

"Reservation Cancelled"

The notification contains:

reservationId

## User

The user receives:

"Reservation Cancelled"

The notification confirms successful cancellation.

The notification contains:

reservationId

---

# 32. RESERVATION EXPIRATION

Reservations can expire automatically.

A background reservation-expiration scheduler periodically searches for expired reservations.

For every expired reservation:

1. Find the associated listing.
2. Restore the reserved quantity.
3. Reopen the listing if appropriate.
4. Change reservation status to expired.
5. Save the reservation.
6. Notify the user.
7. Notify the vendor.

---

# 33. RESTORING QUANTITY AFTER EXPIRATION

When a reservation expires:

listing.quantity += reservation.quantityRequested

The previously locked quantity becomes available again.

If:

listing.quantity > 0

the listing is reopened:

status = available

isActive = true

---

# 34. RESERVATION EXPIRATION STATUS

The reservation becomes:

status = expired

An expired reservation is no longer considered an active reservation awaiting fulfilment.

---

# 35. USER EXPIRATION NOTIFICATION

The affected user receives:

Title:

"Reservation Expired"

Message explains that the reservation for the food has expired.

The notification includes:

reservationId

---

# 36. VENDOR EXPIRATION NOTIFICATION

The vendor receives:

Title:

"Reservation Expired"

The vendor is informed that:

- the reservation expired
- the reserved quantity has been restored

The notification contains:

reservationId

---

# 37. VENDOR RESERVATION LIST

Vendors can retrieve reservations associated with their vendor profile.

The reservation list can include populated:

User:
- fullName
- email
- phone

Listing:
- foodName
- pickupLocation
- expiresAt

Reservations are ordered by:

createdAt descending

Newest reservations appear first.

---

# 38. RESERVATION TIME REMAINING

Vendor reservation responses calculate remaining listing time.

If the listing has not expired:

timeRemaining

is represented approximately as:

hours + minutes

Example:

"3h 42m"

If expired:

"Expired"

If reservation itself has expired, the response treats it appropriately rather than presenting it as an active reservation.

---

# 39. USER RESERVATION LIST

Users can retrieve their own reservations.

Reservations are filtered by:

user = authenticated user

Listings can be populated with:

- foodName
- pickupLocation
- imageUrls

Vendors can be populated with:

- businessName

Reservations are sorted:

createdAt descending

---

# 40. RESERVATION HISTORY

FarmConnect supports reservation history for both sides.

## Vendor history

Reservations belonging to the vendor are retrieved through the vendor reservation repository.

## User history

Reservations belonging to the user are retrieved through the user reservation repository.

History allows users and vendors to understand previous reservation activity rather than only currently active reservations.

---

# 41. LISTING RESERVATION STATUS SYNCHRONIZATION

FarmConnect has a service responsible for recalculating listing status after reservation activity.

The logic is:

## If quantity remains

If:

listing.quantity > 0

then:

status = available
isActive = true

## If quantity is zero and active reservations remain

If:

listing.quantity = 0

AND:

pendingReservations > 0

then:

status = pendingCompletion
isActive = true

## If quantity is zero and no active reservations remain

If:

listing.quantity = 0

AND:

pendingReservations = 0

then:

status = fullReserved
isActive = false

This function represents the core synchronization rule between reservations and listings.

---

# 42. RESERVATION STATE MACHINE

The conceptual reservation state machine is:

                    ┌──────────────┐
                    │   RESERVED   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ↓            ↓            ↓
         COMPLETED     CANCELLED     EXPIRED

RESERVED:
Reservation is active and awaiting fulfilment.

COMPLETED:
Vendor successfully fulfilled the reservation.

CANCELLED:
Reservation was cancelled by the user or vendor.

EXPIRED:
Reservation became invalid through automatic expiration.

---

# 43. RESERVATION → LISTING RELATIONSHIP

Reservation activity directly changes listing state.

Reservation created:
    ↓
listing.quantity decreases

Reservation causes quantity = 0:
    ↓
listing → pendingCompletion

Reservation completed:
    ↓
pending reservation count decreases

Reservation cancelled:
    ↓
listing.quantity increases

Reservation expired:
    ↓
listing.quantity increases

No quantity + no pending reservations:
    ↓
listing → fullReserved
listing → inactive

---

# 44. RESERVATION → USER RELATIONSHIP

Users can:

- create reservations
- receive pickup codes
- view reservations
- cancel active reservations
- receive reservation notifications
- receive expiration notifications
- receive completion notifications

A user's cancellation also creates a temporary restriction against immediately reserving the same listing again.

---

# 45. RESERVATION → VENDOR RELATIONSHIP

Vendors can:

- view reservations
- identify reserving users
- cancel reservations
- provide cancellation reasons
- complete reservations
- receive reservation notifications
- receive expiration notifications

Vendor authorization is always checked through the vendor profile relationship.

---

# 46. IMPORTANT AI INTERPRETATION RULES

Mini Farm AI must understand that:

"Reserve food"

means creating a reservation and reducing listing quantity.

"Cancel my reservation"

means cancelling the user's own active reservation, restoring quantity and potentially reopening the listing.

"Vendor cancelled my reservation"

means the vendor cancelled the reservation and should provide a cancellation reason.

"My reservation expired"

means the reservation was automatically invalidated and its quantity was returned to the listing.

"Can I reserve this listing again?"

If the user recently cancelled that same listing, the AI should recognize the one-hour reservation restriction.

"Is this food still available?"

The AI should consider listing:

status
isActive
quantity

rather than looking only at whether the listing document exists.

"Has my reservation been completed?"

The AI should inspect reservation status rather than infer completion from listing status alone.

---

# 47. RESERVATION BUSINESS PRINCIPLE

The most important rule is:

A reservation is not independent of inventory.

Every reservation affects available food quantity.

Therefore:

RESERVATION CREATED
    ↓
DECREASE INVENTORY

RESERVATION CANCELLED
    ↓
RESTORE INVENTORY

RESERVATION EXPIRED
    ↓
RESTORE INVENTORY

RESERVATION COMPLETED
    ↓
NO INVENTORY RESTORATION

This relationship is fundamental to FarmConnect's food-rescue marketplace.

`;

export default farmConnectReservations;