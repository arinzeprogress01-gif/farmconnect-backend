const farmConnectAutomation = `

# FARMCONNECT — AUTOMATION MEMORY

## 1. AUTOMATION DOMAIN

FarmConnect uses background automation to manage time-dependent parts of the marketplace lifecycle.

Automation exists so that certain business events do not depend on a user or vendor manually triggering them.

The two major automated processes currently implemented are:

- listing expiration
- reservation expiration

The automation system should therefore be understood as:

TIME / SCHEDULE
    ↓
BACKGROUND JOB
    ↓
CHECK DATABASE STATE
    ↓
APPLY BUSINESS RULE
    ↓
UPDATE RECORDS
    ↓
RESTORE / CHANGE MARKETPLACE STATE
    ↓
SEND NOTIFICATIONS

The backend remains the authoritative source for automated lifecycle changes.

---

# 2. LISTING EXPIRATION AUTOMATION

FarmConnect contains a scheduled job responsible for detecting food listings that have expired.

The job is implemented using:

node-cron

The scheduler runs every minute.

Conceptually:

EVERY MINUTE
    ↓
CHECK ACTIVE LISTINGS
    ↓
CHECK expiresAt
    ↓
IDENTIFY EXPIRED LISTINGS
    ↓
MARK LISTINGS AS EXPIRED
    ↓
NOTIFY VENDOR

---

# 3. LISTING EXPIRATION SCHEDULE

The listing expiration scheduler uses:

\`\`\`
* * * * *
\`\`\`

This means the job runs:

**every minute**

The purpose is to continuously check whether active listings have passed their expiration time.

---

# 4. LISTINGS ELIGIBLE FOR EXPIRATION

The listing expiration job searches for listings whose status is:

\`\`\`
available
\`\`\`

or:

\`\`\`
pendingCompletion
\`\`\`

The listing must also have:

\`\`\`
isActive = true
\`\`\`

and:

\`\`\`
expiresAt <= current time
\`\`\`

Conceptually:

LISTING
    ↓
STATUS = available OR pendingCompletion
    ↓
isActive = true
    ↓
expiresAt <= now
    ↓
LISTING IS EXPIRED

---

# 5. LISTING EXPIRATION STATE CHANGE

When a listing is detected as expired, the system changes:

\`\`\`
status = "expired"
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

The listing remains in the database.

It is not physically deleted.

The change represents a lifecycle state transition.

Conceptually:

available
    ↓
TIME PASSES
    ↓
expiresAt reached
    ↓
expired

or:

pendingCompletion
    ↓
TIME PASSES
    ↓
expiresAt reached
    ↓
expired

---

# 6. EXPIRED LISTINGS ARE REMOVED FROM ACTIVE MARKETPLACE ACTIVITY

When a listing becomes:

\`\`\`
status = "expired"
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

it should no longer behave as an active marketplace listing.

The expiration process therefore prevents food listings from remaining available after their defined expiration time.

---

# 7. LISTING EXPIRATION PERSISTENCE

After changing the listing state, the automation job saves the listing.

Conceptually:

EXPIRED LISTING
    ↓
status = expired
    ↓
isActive = false
    ↓
SAVE LISTING

The database therefore becomes the source of truth for the new state.

---

# 8. LISTING EXPIRATION VENDOR LOOKUP

After a listing expires, the system retrieves the associated:

**VendorProfile**

The vendor is found using:

\`\`\`
listing.vendorId
\`\`\`

The purpose is to determine the vendor's user account so that the vendor can receive a notification.

Relationship:

LISTING
    ↓
vendorId
    ↓
VendorProfile
    ↓
userId
    ↓
VENDOR USER

---

# 9. LISTING EXPIRATION NOTIFICATION

When a listing expires, FarmConnect creates a persistent notification for the vendor.

The notification communicates that:

- the listing expired
- the listing is no longer visible in the marketplace

The notification contains:

- receiver
- title
- message
- type
- priority
- data

The notification type is:

\`\`\`
listing_expired
\`\`\`

The priority is:

\`\`\`
medium
\`\`\`

The notification data contains the listing identifier.

Conceptually:

LISTING EXPIRES
    ↓
CREATE NOTIFICATION
    ↓
VENDOR RECEIVES EXPIRATION INFORMATION

---

# 10. LISTING EXPIRATION FAILURE HANDLING

Notification creation is wrapped in a try/catch block.

If notification creation fails, the error is logged.

The listing expiration itself has already been processed and saved.

Therefore, notification failure should not silently prevent the expiration state from being persisted.

The automation logs the notification error for debugging.

---

# 11. RESERVATION EXPIRATION AUTOMATION

FarmConnect also contains a scheduled job responsible for detecting expired reservations.

This job also uses:

node-cron

It runs every minute.

Conceptually:

EVERY MINUTE
    ↓
FIND EXPIRED RESERVATIONS
    ↓
PROCESS EACH RESERVATION
    ↓
RESTORE LISTING QUANTITY
    ↓
UPDATE RESERVATION
    ↓
REOPEN LISTING WHEN APPROPRIATE
    ↓
NOTIFY USER
    ↓
NOTIFY VENDOR

---

# 12. RESERVATION EXPIRATION SCHEDULE

The reservation expiration scheduler uses:

\`\`\`
* * * * *
\`\`\`

Therefore it executes:

**every minute**

Its purpose is to prevent expired reservations from permanently holding food quantity.

---

# 13. FINDING EXPIRED RESERVATIONS

The scheduler uses the reservation repository to find reservations that have reached their expiration condition.

The repository function used is:

\`\`\`
findExpiredReservations()
\`\`\`

The automation layer therefore relies on the repository to determine which reservations have expired.

The scheduler does not independently invent the expiration condition.

Conceptually:

CURRENT DATABASE STATE
    ↓
findExpiredReservations()
    ↓
EXPIRED RESERVATIONS
    ↓
PROCESS EACH RESERVATION

---

# 14. EXPIRED RESERVATION LISTING LOOKUP

For every expired reservation, the automation retrieves the associated listing.

The listing is found using:

\`\`\`
reservation.listing
\`\`\`

through:

\`\`\`
findListingByObjectId()
\`\`\`

If the listing cannot be found, the reservation is skipped.

Conceptually:

EXPIRED RESERVATION
    ↓
reservation.listing
    ↓
FIND LISTING
    ↓
LISTING FOUND?
    ├── YES → CONTINUE
    └── NO → SKIP

---

# 15. RESTORING LISTING QUANTITY

When a reservation expires, the quantity that had previously been reserved must be returned to the listing.

The system performs:

\`\`\`
listing.quantity += reservation.quantityRequested
\`\`\`

This restores the food quantity that was previously allocated to the expired reservation.

Conceptually:

LISTING QUANTITY
    +
EXPIRED RESERVATION QUANTITY
    ↓
RESTORED AVAILABLE QUANTITY

---

# 16. REOPENING A LISTING AFTER RESERVATION EXPIRATION

After restoring the quantity, the automation checks whether:

\`\`\`
listing.quantity > 0
\`\`\`

If quantity is available again, the listing becomes:

\`\`\`
status = "available"
\`\`\`

and:

\`\`\`
isActive = true
\`\`\`

Conceptually:

RESERVATION EXPIRES
    ↓
QUANTITY RESTORED
    ↓
quantity > 0
    ↓
status = available
    ↓
isActive = true

This allows the released food to become available again.

---

# 17. RESERVATION EXPIRATION STATE CHANGE

After the listing has been updated, the reservation itself changes to:

\`\`\`
status = "expired"
\`\`\`

The reservation is then persisted through:

\`\`\`
updateReservation()
\`\`\`

Conceptually:

RESERVATION
    ↓
EXPIRATION CONDITION REACHED
    ↓
status = expired
    ↓
SAVE RESERVATION

---

# 18. USER NOTIFICATION FOR RESERVATION EXPIRATION

When a reservation expires, the user who made the reservation receives a notification.

The notification communicates that their reservation has expired.

The notification contains:

- receiver
- title
- message
- type
- priority
- data

The notification type is:

\`\`\`
reservation
\`\`\`

The priority is:

\`\`\`
medium
\`\`\`

The reservation identifier is included in the notification data.

Conceptually:

RESERVATION EXPIRES
    ↓
USER NOTIFICATION
    ↓
"Your reservation has expired."

---

# 19. VENDOR NOTIFICATION FOR RESERVATION EXPIRATION

The vendor associated with the listing also receives a notification.

The system retrieves the vendor profile using:

\`\`\`
listing.vendorId
\`\`\`

Then uses:

\`\`\`
vendor.userId
\`\`\`

as the notification receiver.

The vendor notification communicates that:

- the reservation expired
- the reserved quantity has been restored

The notification type is:

\`\`\`
reservation
\`\`\`

The priority is:

\`\`\`
medium
\`\`\`

---

# 20. RESERVATION EXPIRATION COMPLETE FLOW

The complete automated reservation expiration flow is:

EXPIRED RESERVATION
    ↓
FIND LISTING
    ↓
LISTING EXISTS?
    ↓
RESTORE quantityRequested
    ↓
quantity > 0?
    ↓
REOPEN LISTING
    ↓
MARK RESERVATION expired
    ↓
SAVE RESERVATION
    ↓
NOTIFY USER
    ↓
FIND VENDOR
    ↓
NOTIFY VENDOR

---

# 21. AUTOMATION AND FOOD AVAILABILITY

Automation directly affects marketplace availability.

For example, a user may reserve:

\`\`\`
quantity = 3
\`\`\`

The listing quantity decreases.

If the reservation later expires, the system restores:

\`\`\`
+3
\`\`\`

to the listing.

Therefore:

RESERVATION
    ↓
TEMPORARILY ALLOCATES FOOD
    ↓
EXPIRATION
    ↓
FOOD QUANTITY RELEASED
    ↓
LISTING CAN BECOME AVAILABLE AGAIN

This prevents abandoned or expired reservations from permanently locking food.

---

# 22. AUTOMATION AND LISTING STATE

Automation can change listing state without a user directly performing an update.

Reservation expiration can cause:

\`\`\`
pendingCompletion
\`\`\`

or another unavailable state with restored quantity

↓

\`\`\`
available
\`\`\`

when:

\`\`\`
quantity > 0
\`\`\`

Listing expiration can cause:

\`\`\`
available
\`\`\`

or:

\`\`\`
pendingCompletion
\`\`\`

↓

\`\`\`
expired
\`\`\`

Therefore, listing status is not controlled only by manual vendor actions.

---

# 23. AUTOMATION AND RESERVATION STATE

Reservation state can also change without a user or vendor manually updating it.

The automated expiration lifecycle is:

\`\`\`
reserved
\`\`\`

↓

TIME / EXPIRATION CONDITION

↓

\`\`\`
expired
\`\`\`

This is distinct from:

\`\`\`
reserved → completed
\`\`\`

and:

\`\`\`
reserved → cancelled
\`\`\`

which are business actions performed by vendors or users.

---

# 24. AUTOMATION AND NOTIFICATIONS

Automation is integrated with the notification system.

Automated events can generate notifications.

Listing expiration:

\`\`\`
// Listing expires
// ↓
// Vendor notification
\`\`\`

Reservation expiration:

\`\`\`
// Reservation expires
// ↓
// User notification
// ↓
// Vendor notification
\`\`\`

Notifications therefore communicate automated lifecycle events to the affected users.

---

# 25. AUTOMATION AND ANALYTICS

Automated lifecycle changes can affect analytics.

For example:

\`\`\`
reserved
\`\`\`

↓

\`\`\`
expired
\`\`\`

means the reservation should no longer be treated as an active reservation.

Similarly:

\`\`\`
available
\`\`\`

↓

\`\`\`
expired
\`\`\`

changes the listing's marketplace state.

Automation therefore indirectly affects dashboard and analytics results because analytics are based on current persisted business states.

---

# 26. AUTOMATION DOES NOT DELETE BUSINESS HISTORY

Expiration changes the state of records.

It does not mean that the underlying listing or reservation must be physically deleted.

For listings:

\`\`\`
status = expired
\`\`\`

\`\`\`
isActive = false
\`\`\`

For reservations:

\`\`\`
status = expired
\`\`\`

This preserves the historical business record.

---

# 27. AUTOMATION FREQUENCY

Both major automation jobs currently run:

**every minute**

### Listing expiration

\`\`\`
* * * * *
\`\`\`

### Reservation expiration

\`\`\`
* * * * *
\`\`\`

The one-minute schedule allows FarmConnect to react relatively quickly to time-based lifecycle changes.

---

# 28. AUTOMATION ERROR HANDLING

The reservation expiration scheduler contains an outer try/catch around the scheduled processing.

If an automation error occurs, the system logs:

\`\`\`
Reservation Scheduler Error:
\`\`\`

along with the error message.

This prevents an individual scheduler failure from silently disappearing.

The listing expiration job also handles notification creation failures through try/catch and logs the resulting error.

---

# 29. AUTOMATION PRINCIPLE

FarmConnect automation exists to enforce time-based business rules consistently.

The system should not depend on:

- a user refreshing the application
- a vendor manually changing a status
- the frontend detecting expiration
- frontend timers being the authoritative source

Instead:

DATABASE STATE
    +
CURRENT TIME
    ↓
BACKGROUND AUTOMATION
    ↓
BUSINESS STATE UPDATE

The backend is responsible for enforcing these lifecycle changes.

---

# 30. MINI FARM AI INTERPRETATION OF AUTOMATION

Mini Farm AI should understand that some FarmConnect events happen automatically.

If a user asks:

"Why did this listing disappear?"

The AI should understand that possible backend lifecycle causes include:

- listing expiration
- vendor cancellation
- listing becoming inactive after all relevant reservations are completed

The AI should not invent which event occurred unless the backend data confirms it.

---

# 31. RESERVATION EXPIRATION INTERPRETATION

If a user asks:

"Why did my reservation expire?"

Mini Farm AI should understand that reservation expiration is an automated lifecycle event.

The expiration may result in:

- reservation status becoming expired
- listing quantity being restored
- listing potentially becoming available again
- user notification
- vendor notification

The AI should only provide specific details when those details are available from backend data.

---

# 32. LISTING EXPIRATION INTERPRETATION

If a vendor asks:

"Why is my listing no longer active?"

Mini Farm AI should understand that the listing may have reached its:

\`\`\`
expiresAt
\`\`\`

and the automation may have changed it to:

\`\`\`
status = expired
\`\`\`

and:

\`\`\`
isActive = false
\`\`\`

However, the AI must inspect supplied listing data before claiming that expiration definitely occurred.

---

# 33. AUTOMATION DATA AUTHORITY

Mini Farm AI must not invent:

- expiration times
- scheduler results
- reservation expiration events
- listing expiration events
- restored quantities
- automated status changes
- notification delivery results

If the backend does not provide the relevant information, the AI should say that it does not have enough information to determine what happened.

---

# 34. AUTOMATION AND CURRENT STATE

Automation is state-changing.

Therefore, Mini Farm AI should distinguish between:

**What the system normally does**

and:

**What actually happened to this specific record**

For example:

"The system expires listings after their expiration time."

is a general business rule.

"My listing expired at 4:32 PM."

is a specific factual claim and requires actual listing data.

---

# 35. CORE AUTOMATION RELATIONSHIP

The central automation relationship is:

\`\`\`
TIME
    ↓
SCHEDULED JOB
    ↓
DATABASE QUERY
    ↓
BUSINESS CONDITION
    ↓
STATE CHANGE
    ↓
DATABASE SAVE
    ↓
NOTIFICATION
\`\`\`

---

# 36. IMPORTANT AI RULES

Mini Farm AI should remember:

1. FarmConnect uses background automation for time-dependent business processes.

2. Listing expiration is automated.

3. Reservation expiration is automated.

4. Both current expiration jobs run every minute.

5. Listing expiration checks active listings.

6. Listing expiration applies to listings with status available or pendingCompletion.

7. Listing expiration requires isActive = true.

8. Listing expiration occurs when expiresAt is less than or equal to the current time.

9. Expired listings become status = expired.

10. Expired listings become isActive = false.

11. Expired listings remain stored in the database.

12. Listing expiration triggers a vendor notification.

13. Reservation expiration is determined through findExpiredReservations().

14. Expired reservations restore their requested quantity to the associated listing.

15. When restored listing quantity is greater than zero, the listing becomes available and active again.

16. Expired reservations become status = expired.

17. Expired reservations are persisted through the reservation repository.

18. Reservation expiration notifies the affected user.

19. Reservation expiration notifies the affected vendor.

20. Automation can change marketplace state without direct user interaction.

21. Automation can affect analytics because analytics depend on reservation and listing states.

22. Automation does not require physical deletion of expired business records.

23. The backend is authoritative for automated state changes.

24. Mini Farm AI must distinguish general automation rules from actual events on a specific record.

25. Mini Farm AI must not invent expiration times, automated events, restored quantities or scheduler results.

26. Frontend timers or frontend assumptions are not the authoritative source for expiration state.

27. Time-based lifecycle changes are enforced by backend scheduled jobs.

28. Listing expiration and reservation expiration are separate automated processes.

29. Notifications communicate automated lifecycle events but do not themselves determine business state.

30. Automation is part of FarmConnect's complete business lifecycle and should be treated as backend business logic rather than a frontend feature.

`;

export default farmConnectAutomation;