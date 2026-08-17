const farmConnectAnalytics = `

# FARMCONNECT — ANALYTICS MEMORY

## 1. ANALYTICS DOMAIN

FarmConnect analytics provide users and vendors with meaningful summaries of their activity within the application.

Analytics are derived from actual FarmConnect records and business activity.

The analytics system should therefore be understood as:

DATABASE RECORDS
    ↓
BUSINESS ACTIVITY
    ↓
ANALYTICS CALCULATION
    ↓
DASHBOARD METRICS

Analytics are not static values and should not be treated as frontend dummy data.

The backend remains the authoritative source for analytics.

---

# 2. USER ANALYTICS

The user dashboard provides information about the user's reservation activity.

Important user metrics include:

- total reservations
- active reservations
- completed reservations
- cancelled reservations
- meals rescued

These metrics describe the user's actual interaction with FarmConnect food listings.

---

# 3. TOTAL RESERVATIONS

The total reservations metric represents the user's reservation activity.

Conceptually:

USER
    ↓
RESERVATIONS
    ↓
COUNT RESERVATIONS
    ↓
TOTAL RESERVATIONS

The metric is based on actual reservation records associated with the user.

It should not be generated from frontend assumptions or hardcoded values.

---

# 4. ACTIVE RESERVATIONS

Active reservations represent reservations that are currently ongoing and have not reached a terminal state.

The relevant reservation state is:

reserved

The active reservation metric therefore reflects reservations that are still awaiting completion, cancellation or expiration.

Conceptually:

USER RESERVATIONS
    ↓
STATUS = reserved
    ↓
ACTIVE RESERVATIONS

---

# 5. COMPLETED RESERVATIONS

Completed reservations represent successfully fulfilled reservations.

The relevant reservation state is:

completed

Conceptually:

USER RESERVATIONS
    ↓
STATUS = completed
    ↓
COMPLETED RESERVATIONS

A completed reservation represents a successful food-rescue transaction from the user's perspective.

---

# 6. CANCELLED RESERVATIONS

Cancelled reservations represent reservations that were cancelled before successful completion.

The relevant reservation state is:

cancelled

Cancellation may occur through:

- user cancellation
- vendor cancellation

The analytics metric should therefore be based on the actual reservation status rather than assuming who performed the cancellation.

---

# 7. EXPIRED RESERVATIONS

FarmConnect also supports:

expired

as a reservation state.

Expired reservations occur when the reservation expiration automation determines that a reservation is no longer valid.

Expired reservations should not be counted as completed reservations.

They represent reservations that were not successfully fulfilled.

---

# 8. MEALS RESCUED

One of the important FarmConnect user analytics is:

mealsRescued

This metric is based on completed reservations.

The system calculates it from:

quantityRequested

for completed reservations.

Conceptually:

COMPLETED RESERVATIONS
    ↓
quantityRequested
    ↓
SUM QUANTITIES
    ↓
MEALS RESCUED

Therefore, meals rescued represents the number of food portions associated with successfully completed reservations.

---

# 9. MEALS RESCUED EXAMPLE

If a user has:

Reservation A
quantityRequested = 2
status = completed

Reservation B
quantityRequested = 3
status = completed

Reservation C
quantityRequested = 5
status = cancelled

Then:

mealsRescued = 2 + 3

mealsRescued = 5

The cancelled reservation does not contribute to meals rescued.

---

# 10. COMPLETION IS IMPORTANT

The analytics system distinguishes between:

reserved

cancelled

expired

completed

Only successful completion contributes to the user's rescued-meal metric.

Therefore:

RESERVED
    ≠
RESCUED

CANCELLED
    ≠
RESCUED

EXPIRED
    ≠
RESCUED

COMPLETED
    =
RESCUED CONTRIBUTION

---

# 11. USER ANALYTICS FLOW

The user analytics lifecycle is:

USER
    ↓
USER RESERVATIONS
    ↓
CLASSIFY BY STATUS
    ↓
TOTAL
ACTIVE
COMPLETED
CANCELLED
    ↓
SUM QUANTITY OF COMPLETED RESERVATIONS
    ↓
MEALS RESCUED

---

# 12. USER DASHBOARD PURPOSE

The user dashboard should give the user a quick understanding of their FarmConnect activity.

It can answer questions such as:

- How many reservations have I made?
- How many are currently active?
- How many have I completed?
- How many have I cancelled?
- How many food portions have I rescued?

The values should reflect backend records.

---

# 13. VENDOR ANALYTICS

FarmConnect also supports vendor analytics.

Vendor analytics are based on the vendor's actual marketplace activity.

The vendor analytics layer can use information associated with:

- vendor profile
- food listings
- reservations
- listing activity
- reservation activity

The purpose is to help vendors understand how their food listings are performing.

---

# 14. VENDOR ACTIVITY

Vendor activity can be understood through the relationship:

VENDOR
    ↓
LISTINGS
    ↓
RESERVATIONS
    ↓
COMPLETION / CANCELLATION / EXPIRATION

Analytics should reflect this actual lifecycle.

A vendor's dashboard should therefore be connected to real listing and reservation records.

---

# 15. VENDOR LISTING ACTIVITY

Vendor analytics can be associated with the vendor's food listings.

Relevant listing information includes:

- number of listings
- listing status
- quantity
- total reservations
- active state
- expiration state

The listing record is the authoritative source for listing-related activity.

---

# 16. TOTAL RESERVATIONS FOR VENDOR ACTIVITY

Reservations associated with a vendor can be used to understand demand for that vendor's food.

Conceptually:

VENDOR
    ↓
LISTINGS
    ↓
RESERVATIONS
    ↓
RESERVATION ACTIVITY

This allows the vendor dashboard to represent actual marketplace demand.

---

# 17. RESERVATION OUTCOMES FOR VENDORS

Vendor activity can be divided according to reservation outcomes:

reserved

completed

cancelled

expired

These states describe what happened after users interacted with the vendor's food listings.

---

# 18. COMPLETED FOOD ACTIVITY

Completed reservations are especially important because they represent successfully fulfilled food pickups.

For a vendor:

COMPLETED RESERVATIONS
    ↓
SUCCESSFUL FOOD DISTRIBUTION

This provides a meaningful indicator of the vendor's contribution to food rescue.

---

# 19. LISTING QUANTITY AND ANALYTICS

Listing quantity changes during the reservation lifecycle.

When a user reserves food:

listing.quantity
    ↓
decreases

When a reservation is cancelled or expires:

listing.quantity
    ↓
is restored

Analytics should therefore distinguish current listing quantity from historical reservation activity.

Current quantity is a snapshot of availability.

Reservation records represent historical activity.

---

# 20. TOTAL RESERVATIONS FIELD

Listings maintain:

totalReservations

This tracks how many reservation operations have been made against a listing.

When a new reservation is successfully created:

listing.totalReservations
    ↓
+1

This field is useful for understanding listing demand.

---

# 21. ANALYTICS AND LISTING STATUS

Listing status provides context for marketplace analytics.

Important listing states include:

available

pendingCompletion

fullReserved

expired

cancelled

Analytics should interpret listing state together with reservation activity.

For example:

available
    ↓
food still has available quantity

pendingCompletion
    ↓
food quantity has been allocated but reservations still require fulfilment

fullReserved
    ↓
no quantity remains and no active reservations remain

expired
    ↓
listing passed its expiration time

cancelled
    ↓
vendor removed the listing

---

# 22. ANALYTICS DATA AUTHORITY

The backend database is the authoritative source for analytics.

Mini Farm AI must not invent:

- reservation counts
- completed reservations
- cancelled reservations
- meals rescued
- listing performance
- vendor performance
- marketplace statistics

If the required data is not supplied by the backend, the AI should clearly state that it does not have the relevant information.

---

# 23. ANALYTICS SHOULD NOT USE DUMMY DATA

FarmConnect dashboards are intended to represent real application activity.

The frontend should not be treated as the authoritative source for analytics.

The backend calculates or retrieves analytics from actual records.

Therefore:

BACKEND DATA
    ↓
ANALYTICS
    ↓
FRONTEND DASHBOARD

NOT:

FRONTEND DUMMY DATA
    ↓
DASHBOARD

---

# 24. USER ANALYTICS AND RESERVATION RELATIONSHIP

User analytics depend heavily on reservation records.

The relationship is:

USER
    ↓
RESERVATIONS
    ↓
STATUS
    ↓
ANALYTICS

A reservation is therefore both:

1. A business transaction.
2. A source of user activity analytics.

---

# 25. MEALS RESCUED PRINCIPLE

FarmConnect uses successful reservation completion as the basis for measuring rescued meals.

The important calculation is:

SUM(quantityRequested)
for reservations where:
status = completed

This prevents cancelled or expired reservations from being incorrectly counted as rescued food.

---

# 26. ANALYTICS AND FOOD RESCUE IMPACT

The meals rescued metric provides a connection between marketplace activity and FarmConnect's food-rescue purpose.

The conceptual relationship is:

FOOD LISTING
    ↓
RESERVATION
    ↓
SUCCESSFUL COMPLETION
    ↓
FOOD PORTIONS RESCUED
    ↓
USER IMPACT

This makes completed reservations more meaningful than simple listing views or reservation attempts.

---

# 27. ANALYTICS INTERPRETATION FOR MINI FARM AI

Mini Farm AI should understand questions such as:

"How many reservations have I made?"

    ↓
Use the user's reservation analytics.

"How many meals have I rescued?"

    ↓
Use completed reservations and their quantityRequested values.

"How many reservations have I completed?"

    ↓
Use reservations with status = completed.

"How many active reservations do I have?"

    ↓
Use currently active reserved reservations.

"How many reservations have I cancelled?"

    ↓
Use reservations with status = cancelled.

"How are my listings performing?"

    ↓
Use actual vendor listing and reservation data supplied by the backend.

---

# 28. ANALYTICS MUST REFLECT CURRENT DATA

Analytics can change as the FarmConnect lifecycle progresses.

For example:

RESERVED
    ↓
CANCELLED

or:

RESERVED
    ↓
COMPLETED

or:

RESERVED
    ↓
EXPIRED

Therefore, dashboard values should be derived from current database state and relevant historical records.

---

# 29. ANALYTICS AND AUTOMATION

Background automation affects analytics.

Reservation expiration can change:

reserved
    ↓
expired

Listing expiration can change:

available
    ↓
expired

Reservation completion can change:

reserved
    ↓
completed

Reservation cancellation can change:

reserved
    ↓
cancelled

Because analytics depend on these states, automated lifecycle changes can affect dashboard metrics.

---

# 30. ANALYTICS AND NOTIFICATIONS

Analytics and notifications are related but serve different purposes.

Notifications communicate events.

Analytics summarize activity.

For example:

Reservation completed
    ↓
Notification:
"Reservation Completed"

and separately:

Reservation completed
    ↓
Analytics:
completedReservations + 1
mealsRescued += quantityRequested

The notification tells the user what happened.

The analytics show the cumulative impact.

---

# 31. ANALYTICS SECURITY

Analytics involving personal activity should be scoped to the authenticated user.

A user should only be able to retrieve their own personal analytics.

Vendor analytics should be scoped to the authenticated vendor and their vendor-owned activity.

Analytics must not expose another user's private reservation history or personal statistics.

---

# 32. VENDOR ANALYTICS SECURITY

A vendor's analytics must be associated with the correct vendor.

The system should ensure that vendor analytics are calculated from records belonging to that vendor.

Conceptually:

AUTHENTICATED VENDOR
    ↓
VENDOR PROFILE
    ↓
VENDOR LISTINGS / RESERVATIONS
    ↓
VENDOR ANALYTICS

A vendor must not be able to retrieve another vendor's private analytics.

---

# 33. ANALYTICS PRINCIPLE

FarmConnect analytics should answer:

"What has actually happened in the system?"

rather than:

"What might have happened?"

Analytics are therefore derived from persisted business records.

---

# 34. CORE ANALYTICS RELATIONSHIP

The central analytics relationship is:

USER
    ↓
RESERVATIONS
    ↓
STATUS + QUANTITY
    ↓
USER ANALYTICS

and:

VENDOR
    ↓
LISTINGS
    ↓
RESERVATIONS
    ↓
STATUS + QUANTITY
    ↓
VENDOR ANALYTICS

---

# 35. IMPORTANT AI RULES

Mini Farm AI should remember:

1. Analytics are based on actual FarmConnect records.

2. User analytics are primarily reservation-based.

3. Total reservations represent reservation activity.

4. Active reservations represent currently reserved/ongoing reservations.

5. Completed reservations represent successfully fulfilled reservations.

6. Cancelled reservations represent reservations that were cancelled.

7. Expired reservations represent reservations that expired without successful completion.

8. mealsRescued is calculated from completed reservations.

9. mealsRescued is the sum of quantityRequested for completed reservations.

10. Cancelled reservations must not contribute to mealsRescued.

11. Expired reservations must not contribute to mealsRescued.

12. A reservation being created does not automatically mean food was rescued.

13. Successful completion is the important event for rescued-meal impact.

14. Listing totalReservations increases when a reservation is successfully created.

15. Current listing quantity is different from historical reservation activity.

16. Background automation can change reservation and listing states.

17. Backend data is authoritative for analytics.

18. Mini Farm AI must not invent analytics values.

19. User analytics must be scoped to the authenticated user.

20. Vendor analytics must be scoped to the authenticated vendor and their own marketplace activity.

21. Analytics summarize business activity; notifications communicate individual events.

22. FarmConnect analytics exist to provide meaningful insight into actual marketplace and food-rescue activity.

`;

export default farmConnectAnalytics;