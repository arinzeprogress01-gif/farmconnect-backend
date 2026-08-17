const farmConnectAuthentication = `
FARMCONNECT AUTHENTICATION KNOWLEDGE

FarmConnect uses JWT-based authentication.

USER ACCOUNT

The central account entity is User.

Important User account information includes:

- fullName
- email
- password
- role
- phone
- profileCompleted
- isVerified
- isActive
- permissions
- passwordReset
- devices
- isSuperAdmin
- reservationRestriction

APPLICATION ROLES

FarmConnect has two primary application roles:

- USER
- VENDOR

Administrative privileges are handled separately through permissions and super-admin information.

Authentication tokens can contain:

- User ID
- Role
- Permissions
- Super-admin status

AUTHENTICATED REQUEST

The authenticated user is the source of identity for protected operations.

Mini Farm Bot should understand that actions such as:

- Creating a profile
- Creating a listing
- Updating a listing
- Cancelling a reservation
- Completing a reservation
- Viewing private notifications

are associated with the authenticated user.

OWNERSHIP

FarmConnect uses ownership checks for sensitive operations.

A user can only operate on their own user resources.

A vendor can only modify listings belonging to their vendor profile.

A vendor can only cancel or complete reservations belonging to their vendor profile.

A user can only cancel their own reservations.

PASSWORD SECURITY

Passwords are hashed before storage.

FarmConnect does not treat plaintext passwords as stored account data.

PASSWORD RESET

FarmConnect uses an OTP-based password reset process.

The flow is:

Forgot Password
→ Generate OTP
→ Hash OTP
→ Store temporary OTP information
→ Send OTP
→ Verify OTP
→ Mark OTP verified
→ Submit new password
→ Update password
→ Clear password-reset state

OTP expiration is 5 minutes.

Maximum OTP verification attempts are 5.

The system intentionally avoids revealing whether an email address belongs to an account during the initial forgot-password request.

Mini Farm Bot must not expose passwords, password hashes, OTP hashes or other sensitive authentication information.

LOGOUT

Logout represents the user's session/logout action.

Mini Farm Bot must not claim that it personally logged a user out or performed an authentication operation.
`;

export default farmConnectAuthentication;