FarmConnect Backend

«Production-oriented REST API and real-time backend for a digital food-rescue marketplace.»

FarmConnect is a backend system designed to connect food vendors with users who can discover, reserve, and collect surplus meals before they go to waste.

The backend was built with a focus on clean architecture, centralized business logic, authentication, authorization, real-time communication, payment processing, notifications, background jobs, containerization, and CI/CD automation.

---

🚀 Project Overview

FarmConnect provides the backend infrastructure for a food-rescue marketplace where:

- Vendors can create and manage food listings.
- Users can browse available food and discover nearby listings.
- Users can reserve available meals.
- Vendors can manage reservations and pickup workflows.
- Payments can be processed securely through Paystack.
- Subscription functionality is supported.
- Users receive push notifications through Firebase Cloud Messaging.
- Activities are delivered to dashboards in real time through Socket.IO.
- Expired listings and reservations are handled through background jobs.
- Redis is integrated as an in-memory data layer for performance and scalability.
- The application is containerized with Docker.
- Automated CI/CD workflows validate and deploy the application.

The system follows a backend-authoritative architecture, meaning business rules, validation, authorization, database operations, and application state are controlled by the backend rather than trusted from the frontend.

---

🏗️ Architecture

FarmConnect follows a layered backend architecture designed to separate responsibilities and keep business logic maintainable.

Client / Frontend
       │
       ├──────── REST API ───────────────┐
       │                                │
       └────── Socket.IO ───────────────┤
                                        ▼
                              Express Application
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             │                          │                          │
          Routes                    Middleware                 Sockets
             │                          │                          │
             ▼                          ▼                          ▼
       Controllers              Auth / Validation          Real-Time Events
             │
             ▼
          Services
             │
             ▼
       Repositories
             │
        ┌────┴─────┐
        ▼          ▼
    MongoDB      Redis
        │
        └────────────── Application Data / Cache
             
External Services
        │
        ├── Paystack
        ├── Firebase Cloud Messaging
        └── Other integrations

The architecture separates:

- Routes — API endpoint definitions
- Controllers — HTTP request/response handling
- Services — business logic
- Repositories — database access
- Models — MongoDB schemas
- Middleware — authentication, authorization, validation, errors and security
- Sockets — real-time communication
- Jobs — scheduled/background processing
- Utilities — reusable application helpers
- Configuration — environment and infrastructure configuration

This separation keeps controllers thin and prevents business logic from becoming tightly coupled to HTTP handlers.

---

🛠️ Technology Stack

Backend

- Node.js
- Express.js
- JavaScript (ES Modules)

Database & Data Layer

- MongoDB
- Mongoose
- Redis

MongoDB serves as the primary persistent database, while Redis provides a fast in-memory data layer for performance-oriented workloads.

Authentication & Security

- JWT authentication
- Password hashing with bcrypt
- Joi request validation
- Role-based authorization
- Permission-based access control
- Helmet security headers
- CORS
- Environment-based secrets/configuration

Real-Time Communication

- Socket.IO
- JWT-authenticated socket connections
- User-specific rooms
- Real-time activity events

Payments

- Paystack
- Transaction initialization
- Webhook processing
- HMAC SHA-512 webhook signature verification
- Payment persistence
- Idempotent payment processing
- Subscription activation

Notifications

- Firebase Cloud Messaging (FCM)
- Push notifications
- Device token management

DevOps

- Docker
- GitHub Actions
- CI/CD
- Render deployment

API Documentation

- Swagger / OpenAPI

---

🔐 Authentication & Authorization

FarmConnect uses JWT-based authentication.

A successful login generates a JWT containing authenticated user information such as:

- User ID
- Role
- Permissions
- Super-admin status
- Token expiration information

Protected API requests provide the token through the Authorization header.

Socket.IO connections use the same authentication model. The frontend supplies the JWT during the socket handshake, where the backend verifies the token before allowing the connection.

Login
  ↓
JWT issued
  ↓
Authenticated REST requests
  ↓
Socket.IO handshake
  ↓
JWT verification
  ↓
Authenticated socket
  ↓
User-specific room

This prevents unauthenticated clients from accessing real-time application events.

---

👥 Roles & Permissions

The backend supports role-aware authorization and administrative restrictions.

Authorization is enforced at the backend level rather than relying on frontend UI restrictions.

This allows the backend to independently determine whether an authenticated user is permitted to perform an operation.

The system also supports privileged administrative functionality, including super-admin capabilities.

---

📦 Core Modules

User Management

Handles:

- Registration
- Login
- Authentication
- Password reset
- Email verification
- User profiles
- Location management
- Device registration

Vendor Management

Handles:

- Vendor profile creation
- Vendor profile updates
- Vendor locations
- Vendor-specific listings
- Vendor reservations
- Vendor analytics

Listings

Vendors can:

- Create listings
- Update listings
- Delete listings
- Manage listing availability
- Categorize food
- Set quantities
- Configure free/paid listings
- Provide pickup information

Users can:

- Browse marketplace listings
- Search listings
- View listing details
- Discover nearby listings

Reservations

Users can:

- Reserve meals
- View active reservations
- View reservation history
- Cancel reservations

Vendors can:

- View reservations
- Complete reservations
- Cancel reservations
- View reservation history

Reservation expiration is also handled automatically through a background job.

---

💳 Payment System

FarmConnect integrates Paystack for payment processing.

The payment architecture separates payment initialization from payment confirmation.

Client
  ↓
Backend
  ↓
Paystack Transaction Initialization
  ↓
Paystack Checkout
  ↓
Successful Payment
  ↓
Paystack Webhook
  ↓
Signature Verification
  ↓
Payment Service
  ↓
MongoDB

Webhook requests are verified using Paystack's HMAC SHA-512 signature mechanism before payment events are processed.

The payment service also implements idempotent processing to prevent duplicate payment records when the same webhook is received more than once.

---

🔁 Subscription System

FarmConnect supports subscription activation following successful payment processing.

The subscription flow includes:

- Payment reference tracking
- Subscription creation
- Active subscription state
- Start and expiration dates
- Duplicate subscription protection
- Activity generation
- User notification events

Subscription records are linked to their corresponding payment records.

---

🔔 Notifications

FarmConnect uses Firebase Cloud Messaging for push notifications.

The notification flow is centralized so application services can trigger notifications without duplicating notification logic throughout controllers.

Application Event
      ↓
Notification Service
      ↓
Database Notification
      ↓
Firebase Cloud Messaging
      ↓
User Device

Notifications can be associated with events such as reservations, payments, subscriptions, and other application activities.

---

⚡ Real-Time Communication

FarmConnect uses Socket.IO to provide real-time communication between the backend and connected clients.

Socket connections are authenticated using JWT.

Each authenticated user joins a private room:

user:<userId>

This allows the backend to emit events specifically to the intended user.

For example:

Vendor creates listing
       ↓
Listing saved
       ↓
Activity created
       ↓
Socket.IO emits activity:new
       ↓
Vendor dashboard receives event
       ↓
Activity appears without page refresh

Real-time activity events currently support the application's activity system, with the architecture designed to support additional real-time business events.

---

📝 Activity System

FarmConnect maintains an activity feed for users and vendors.

Activities are generated from backend business events rather than being fabricated by the frontend.

Examples include:

- Listing created
- Free meal shared
- Reservation created
- Reservation completed
- Reservation cancelled
- Payment events
- Subscription events

Activities are persisted in MongoDB and can also be delivered instantly through Socket.IO.

This provides both:

1. Persistent activity history
2. Real-time dashboard updates

---

⚡ Redis

Redis is used as the application's high-speed in-memory data layer alongside MongoDB.

The architecture separates responsibilities:

MongoDB
→ Persistent application data

Redis
→ Fast temporary/shared data
→ Caching
→ Performance-sensitive operations

Redis is introduced to improve application performance and provide infrastructure that can support future requirements such as distributed caching, rate limiting, queues, and real-time coordination.

---

⏰ Background Jobs

FarmConnect includes background jobs for time-sensitive application operations.

Current automated jobs include:

- Reservation expiration
- Listing expiration

This prevents expired resources from depending entirely on user requests or frontend activity to transition state.

---

🧠 Centralized Business Logic

One of the main architectural principles of FarmConnect is keeping business logic centralized in services.

Controllers primarily handle:

Request
  ↓
Validation / Authentication
  ↓
Service
  ↓
Response

Business operations such as payment processing, subscription activation, reservation handling, activity creation, notification delivery, and other application rules are handled by dedicated services.

This makes the system easier to:

- Test
- Maintain
- Debug
- Extend
- Reuse

---

🗄️ Data Access Layer

Database operations are separated from business logic through repository modules.

The general flow is:

Controller
    ↓
Service
    ↓
Repository
    ↓
Model
    ↓
MongoDB

This reduces direct database coupling inside controllers and keeps persistence logic centralized.

---

🛡️ Error Handling

FarmConnect uses centralized error handling so API errors follow a consistent structure.

The application includes:

- 404 handling
- Global error middleware
- Validation errors
- Authentication errors
- Authorization errors
- External service errors
- Database errors

This prevents individual controllers from having to duplicate error-response logic.

---

📊 Analytics

The backend provides analytics for different application roles.

Vendor analytics include information related to:

- Listings
- Reservations
- Activity
- Performance

User analytics provide user-facing dashboard information based on their marketplace activity.

Analytics are calculated from backend data rather than relying on frontend-maintained state.

---

📍 Location Services

FarmConnect supports location-aware marketplace functionality.

The backend provides:

- Vendor location management
- User location management
- Coordinate-based operations
- Reverse location lookup
- Location search
- Nearby listing discovery

This allows users to discover food listings based on geographical proximity.

---

🤖 AI Integration

FarmConnect also contains an AI-powered assistant module designed to provide users with an interactive food-rescue assistant experience.

The AI functionality is exposed through a dedicated backend route and service layer, keeping external AI integration separate from the application's core business logic.

---

🐳 Docker

FarmConnect is containerized using Docker.

Containerization provides a consistent runtime environment across development, testing, and deployment.

The application can be built and run as a container rather than depending on manually configured host environments.

Example architecture:

Docker
  ↓
FarmConnect API Container
  ↓
Node.js / Express
  ↓
MongoDB
  ↓
Redis

Docker also makes the backend easier to deploy across different environments.

---

🔄 CI/CD

The project uses GitHub Actions for automated CI/CD.

The pipeline is responsible for validating the application before deployment.

Typical workflow:

Git Push
   ↓
GitHub Actions
   ↓
Install Dependencies
   ↓
Run Tests
   ↓
Validation
   ↓
Build / Deployment
   ↓
Render

This provides automated feedback and reduces the risk of deploying untested changes.

---

☁️ Deployment

FarmConnect is deployed as a containerized backend application.

The deployment architecture supports:

- Docker-based deployment
- Environment variables
- Production configuration
- Automated deployment through CI/CD
- External MongoDB
- External service integrations
- Redis infrastructure

Sensitive credentials are stored as environment variables rather than committed to source control.

---

🔑 Environment Configuration

The application uses environment variables for sensitive and environment-specific configuration.

Examples include:

PORT=
NODE_ENV=
MONGODB_URI=
JWT_SECRET=
PAYSTACK_SECRET_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
REDIS_URL=

Actual secrets are never committed to the repository.

---

📚 API Documentation

FarmConnect exposes API documentation through Swagger/OpenAPI.

The documentation provides an overview of available endpoints, request structures, authentication requirements, and API responses.

When running the backend locally, the API documentation is available through:

/api-docs

---

🧪 Testing & Validation

The project uses automated validation through the development and CI/CD workflow.

Testing and validation cover critical backend functionality such as:

- Application startup
- Authentication
- API behavior
- Database connectivity
- Payment processing
- Webhook verification
- Real-time socket authentication
- Business logic
- Deployment readiness

The CI/CD pipeline is used to ensure changes pass validation before deployment.

---

📁 Project Structure

The backend follows a modular structure similar to:

src/
├── config/
├── controllers/
├── middleware/
├── models/
├── repositories/
├── routes/
├── services/
├── sockets/
├── jobs/
├── utils/
├── validators/
└── server.js

scripts/
public/
tests/
Dockerfile
docker-compose.yml
package.json

The exact structure may evolve as the application grows.

---

🚀 Running Locally

1. Clone the repository

git clone <repository-url>
cd farmconnect-backend

2. Install dependencies

npm install

3. Configure environment variables

Create a ".env" file containing the required environment variables.

4. Start the development server

npm run d

Or run the production server:

npm start

5. Run with Docker

Build the image:

docker build -t farmconnect-backend .

Run the container:

docker run --env-file .env -p 5000:5000 farmconnect-backend

---

🔒 Security Principles

The project follows several security practices:

- JWT authentication
- Password hashing
- Request validation
- Role-based authorization
- Permission checks
- Helmet security headers
- CORS configuration
- Environment-based secrets
- Paystack webhook signature verification
- Idempotent payment processing
- Backend-authoritative authorization
- Centralized error handling

Secrets and credentials are intentionally excluded from source control.

---

🎯 Engineering Goals

FarmConnect was built not simply as a CRUD API, but as a practical backend system demonstrating how multiple production concerns work together:

- API architecture
- Authentication
- Authorization
- Database design
- Business logic
- Repository patterns
- External API integration
- Payment processing
- Webhooks
- Push notifications
- Real-time communication
- Background jobs
- Caching/in-memory data
- Docker
- CI/CD
- Deployment
- API documentation
- Error handling
- Security

The goal is to maintain a backend that is modular, testable, maintainable, secure, and capable of scaling beyond a basic prototype.

---

👨‍💻 Developer

Arinze Progress

Backend-focused developer with an engineering background, building FarmConnect as a practical full-stack backend engineering project.

Core Backend Skills Demonstrated

"Node.js" · "Express.js" · "MongoDB" · "Mongoose" · "Redis" · "JWT" · "Joi" · "Socket.IO" · "Paystack" · "Firebase Cloud Messaging" · "Docker" · "GitHub Actions" · "REST APIs" · "Swagger/OpenAPI"

---

📌 Project Status

FarmConnect is an actively developed backend system with the core marketplace, authentication, reservations, activities, payments, subscriptions, notifications, real-time communication, containerization, and DevOps infrastructure implemented progressively as part of the project's engineering roadmap.
