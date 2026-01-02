# MindMission

A robust, scalable backend application built with NestJS following Clean Architecture principles. This application provides a comprehensive API solution with both REST and GraphQL endpoints, featuring authentication, authorization, user management, and notification systems.

## 🏗️ Architecture

This project follows **Clean Architecture** principles, ensuring separation of concerns, maintainability, and testability. The architecture is organized into distinct layers with clear boundaries and dependencies.

### Architecture Layers

```
src/
├── infrastructure/          # Infrastructure Layer (Outer Layer)
│   ├── configuration/      # Environment configuration & validation
│   ├── database/           # Database connection & setup
│   ├── exception-filters/  # Global exception handling (REST & GraphQL)
│   ├── interceptors/       # Response interceptors
│   ├── localization/      # i18n configuration
│   ├── logger/            # Logging services (Winston & Database)
│   ├── mail/              # Email service configuration
│   └── middlewares/       # Cross-cutting middleware
│
├── modules/                # Feature Modules (Clean Architecture)
│   └── [module-name]/
│       ├── domain/         # Domain Layer (Inner Layer)
│       │   ├── models/     # Domain entities & business models
│       │   ├── interfaces/ # Domain contracts
│       │   ├── enums/      # Domain enumerations
│       │   └── errors/     # Domain-specific exceptions
│       │
│       ├── application/    # Application Layer
│       │   ├── use-cases/  # Business use cases
│       │   ├── services/   # Application services
│       │   ├── interfaces/ # Application contracts
│       │   ├── inputs/     # Use case input types
│       │   └── constants/  # Dependency injection tokens
│       │
│       ├── infrastructure/ # Infrastructure Layer (Module-specific)
│       │   ├── database/   # Repositories, entities, mappers
│       │   ├── cache/      # Caching implementations
│       │   └── providers/  # External service integrations
│       │
│       └── presentation/   # Presentation Layer (Outer Layer)
│           ├── controllers/ # REST controllers
│           ├── dto/        # Data Transfer Objects
│           ├── guards/     # Authentication & authorization guards
│           └── validators/ # Custom validators
│
└── main.ts                # Application entry point
```

### Clean Architecture Principles

1. **Dependency Rule**: Dependencies point inward. Outer layers depend on inner layers, but inner layers never depend on outer layers.
2. **Domain Layer**: Contains pure business logic, independent of frameworks and external concerns.
3. **Application Layer**: Orchestrates use cases and defines application-specific business rules.
4. **Infrastructure Layer**: Implements technical details (database, external APIs, file storage).
5. **Presentation Layer**: Handles HTTP requests/responses, validation, and serialization.

### Module Structure Example

Each feature module follows this structure:

- **Domain**: Pure business logic, entities, and domain rules
- **Application**: Use cases that orchestrate domain logic
- **Infrastructure**: Data persistence, external services, caching
- **Presentation**: API endpoints, DTOs, and request/response handling


## 📦 Features

### Core Modules

- **Authentication Module**
  - JWT-based authentication
  - OAuth 2.0 (Google) integration
  - Password reset & email verification
  - Token management

- **User Management**
  - User CRUD operations
  - Profile management
  - Role-based access control
  - User blocking/suspension

- **Role & Permission System**
  - Dynamic role management
  - Granular permission system
  - Role-based authorization

- **Notification System**
  - Email notifications
  - Queue-based processing
  - Template-based emails
  - Multi-channel support

- **Storage Module**
  - File upload to AWS S3
  - Image processing
  - File validation

- **Category Management**
  - Hierarchical categories
  - Caching support

### Infrastructure Features

- **Exception Handling**
  - Global exception filters
  - Separate handlers for REST and GraphQL
  - Internationalized error messages
  - Domain-specific exceptions

- **Caching Strategy**
  - Redis-based caching
  - Cache invalidation
  - Performance optimization

- **Logging**
  - Structured logging with Winston
  - Database audit logging
  - Request/response logging

- **Internationalization**
  - Multi-language support
  - Localized error messages
  - Language detection

- **API Features**
  - RESTful API with versioning
  - GraphQL API with introspection
  - Request throttling
  - CORS configuration
  - Response wrapping

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v24.11 or higher)
- PostgreSQL (v16 or higher)
- Redis (v7 or higher)
- Docker & Docker Compose (optional)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
PORT=8888
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password

# GraphQL
GRAPHQL_PATH=/graphql
GRAPHQL_INTROSPECTION=true
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindmission
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb your_database_name
   ```

4. **Run database migrations** (if applicable)
   ```bash
   npm run migration:run
   ```

5. **Start the application**

   **Development mode:**
   ```bash
   npm run start:dev
   ```

   **Production mode:**
   ```bash
   npm run build
   npm run start:prod
   ```

### Docker Setup

1. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f app
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

## 📝 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## 🌐 API Endpoints

### REST API

Base URL: `http://localhost:8888/api`

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Roles**: `/api/v1/roles/*`
- **Permissions**: `/api/v1/permissions/*`
- **Categories**: `/api/v1/categories/*`
- **Notifications**: `/api/v1/notifications/*`

### GraphQL API

- **Endpoint**: `http://localhost:8888/graphql`
- **Playground**: Available in development mode
- **Introspection**: Enabled (configurable)

## 🔐 OAuth Integration

### OAuth Flow - Simple Visual Guide

#### 🎯 Starting Point (The Entry)

```
┌─────────────────────────────────────────────────────────────┐
│                    WHERE IT ALL STARTS                       │
└─────────────────────────────────────────────────────────────┘

👤 USER
   │
   │ Clicks: "Login with Google"
   │
   ▼
┌─────────────────────────────────────────────────────────────┐
│  🌐 FRONTEND                                                 │
│                                                              │
│  Navigates to:                                               │
│  GET /api/v1/auth/oauth/google                              │
│                                                              │
│  Full URL:                                                   │
│  http://localhost:3000/api/v1/auth/oauth/google             │
└─────────────────────────────────────────────────────────────┘
   │
   │ HTTP Request
   │
   ▼
┌─────────────────────────────────────────────────────────────┐
│ 📍 BACKEND ENTRY POINT.                                      │
│                                                             │
│  File: oauth.controller.ts                                   │
│  Route: @Get("google")                                       │
│  Method: google()                                            │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │ @Controller({ path: "auth/oauth" })    │                 │
│  │ export class OAuthController {         │                 │
│  │   @Get("google")                       │                 │
│  │   @UseGuards(GoogleGuard)  ← START     │                 │
│  │   async google() { ... }               │                 │
│  │ }                                      │                 │
│  └────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

#### 🔄 Complete Flow in One View

```
START
  │
  ├─► GET /api/v1/auth/oauth/google
  │   │
  │   ├─► OAuthController.google()
  │   │   │
  │   ├─► GoogleGuard (activates)
  │   │   │
  │   ├─► GoogleStrategy (Passport)
  │   │   │
  │   └─► HTTP 302 Redirect ──┐
  │                           │
  │                           ▼
  │                    Google OAuth Page
  │                    (External)
  │                           │
  │                           │ User authenticates
  │                           │
  │                           ▼
  │                    Google redirects back
  │                    GET /api/v1/auth/oauth/google/callback
  │                           │
  │                           ├─► OAuthController.googleCallback()
  │                           │
  │                           ├─► GoogleGuard (validates)
  │                           │
  │                           ├─► GoogleStrategy.validate()
  │                           │
  │                           ├─► GoogleOAuthCallbackUseCase
  │                           │
  │                           ├─► OAuthUserService.findOrCreateUser()
  │                           │
  │                           ├─► AuthTokenService.generateTokens()
  │                           │
  │                           └─► Return { accessToken, refreshToken }
  │
END ──► Frontend receives tokens
```

#### 📍 Entry Point Details

**The Exact Starting Point:**

```typescript
// File: src/modules/auth/presentation/controllers/oauth.controller.ts

@Controller({ path: "auth/oauth", version: "1" })  // Base path
export class OAuthController {
  
  // ⭐ THIS IS THE STARTING POINT ⭐
  @Get("google")                      // Route: /auth/oauth/google
  @UseGuards(GoogleGuard)              // Activates OAuth flow
  async google() {
    // This method initiates the OAuth flow
    // Passport will redirect to Google before this executes
  }
}
```

**Full URL Breakdown:**

```
http://localhost:3000/api/v1/auth/oauth/google
│              │    │   │   │    │     │
│              │    │   │   │    │     └─ Provider name
│              │    │   │   │    └─ OAuth controller
│              │    │   │   └─ Auth module
│              │    │   └─ API version
│              │    └─ Global prefix (from main.ts)
│              └─ Port
└─ Host
```

#### 🎬 Step-by-Step Journey

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Action                                         │
└─────────────────────────────────────────────────────────────┘
User clicks "Login with Google" button
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend Request                                    │
└─────────────────────────────────────────────────────────────┘
Browser navigates to: /api/v1/auth/oauth/google
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Entry Point                                 │
└─────────────────────────────────────────────────────────────┘
OAuthController.google() receives request
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Guard Activation                                    │
└─────────────────────────────────────────────────────────────┘
GoogleGuard activates GoogleStrategy
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Redirect to Provider                                │
└─────────────────────────────────────────────────────────────┘
HTTP 302 → Google OAuth login page
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: User Authentication                                 │
└─────────────────────────────────────────────────────────────┘
User logs in and grants permissions on Google
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: OAuth Callback                                      │
└─────────────────────────────────────────────────────────────┘
Google redirects to: /api/v1/auth/oauth/google/callback
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: User Processing                                    │
└─────────────────────────────────────────────────────────────┘
- Find or create user
- Generate tokens
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Response                                            │
└─────────────────────────────────────────────────────────────┘
Return { accessToken, refreshToken } to frontend
    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: Complete                                           │
└─────────────────────────────────────────────────────────────┘
Frontend stores tokens → User logged in ✅
```

#### 🔑 Key Takeaway

**The starting point is:**
- **URL**: `GET /api/v1/auth/oauth/google`
- **Controller Method**: `OAuthController.google()`
- **File**: `src/modules/auth/presentation/controllers/oauth.controller.ts`

**What happens immediately:**
1. Request hits the controller method
2. `@UseGuards(GoogleGuard)` decorator activates
3. Passport redirects to Google (before controller method executes)
4. User authenticates on Google
5. Google redirects back to callback endpoint
6. Callback processes authentication and returns tokens

**The controller method is the entry point, but Passport handles the actual OAuth flow!**

---

### How Frontend Receives Tokens from OAuth Callback

#### 🤔 The Problem

**Question:** "If Google redirects the browser to `/api/v1/auth/oauth/google/callback` (backend endpoint), how does the frontend receive the JSON response?"

**The Issue:**
- Google redirects browser to: `/api/v1/auth/oauth/google/callback`
- Backend returns JSON response
- Browser receives JSON, but frontend SPA might not capture it
- User sees JSON in browser instead of being redirected back to app

#### ✅ Solution: Redirect to Frontend

The backend callback should **redirect to the frontend** with tokens, not return JSON directly to the browser.

#### 🎯 Three Main Approaches

##### **Approach 1: Redirect to Frontend with Tokens in URL (Recommended)**

**How it works:**
1. Backend callback receives tokens
2. Backend redirects to frontend URL with tokens as query parameters
3. Frontend route extracts tokens from URL
4. Frontend stores tokens and redirects to dashboard

**Backend Code:**
```typescript
@Get("google/callback")
@UseGuards(GoogleGuard)
async googleCallback(@Req() req: any, @Res() res: any) {
  const { user, accessToken, refreshToken } = req.user;
  
  // Redirect to frontend with tokens in URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  res.redirect(
    `${frontendUrl}/auth/callback?` +
    `accessToken=${accessToken}&` +
    `refreshToken=${refreshToken}&` +
    `userId=${user.id}`
  );
}
```

**Frontend Code (React Example):**
```typescript
// Frontend route: /auth/callback
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract tokens from URL
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');

    if (accessToken && refreshToken) {
      // Store tokens (localStorage, sessionStorage, or state management)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Handle error
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return <div>Completing authentication...</div>;
}
```

**Flow:**
```
Google redirects → Backend callback → Backend redirects to frontend → Frontend extracts tokens
```

##### **Approach 2: Set Cookies and Redirect (Most Secure)**

**How it works:**
1. Backend callback receives tokens
2. Backend sets HTTP-only cookies with tokens
3. Backend redirects to frontend (no tokens in URL)
4. Frontend doesn't need to handle tokens (they're in cookies)
5. Frontend makes authenticated requests (cookies sent automatically)

**Backend Code:**
```typescript
@Get("google/callback")
@UseGuards(GoogleGuard)
async googleCallback(@Req() req: any, @Res() res: any) {
  const { user, accessToken, refreshToken } = req.user;
  
  // Set tokens in HTTP-only cookies (secure, not accessible via JavaScript)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,      // Not accessible via JavaScript (prevents XSS)
    secure: true,        // Only sent over HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  // Redirect to frontend (tokens are in cookies, not URL)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  res.redirect(`${frontendUrl}/auth/callback?success=true`);
}
```

**Frontend Code:**
```typescript
// Frontend route: /auth/callback
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Tokens are in cookies, automatically sent with requests
    // Just redirect to dashboard
    // Optionally verify auth by making a request to /api/user/profile
    navigate('/dashboard');
  }, [navigate]);

  return <div>Authentication successful! Redirecting...</div>;
}
```

**Benefits:**
- ✅ Most secure (HTTP-only cookies prevent XSS)
- ✅ Tokens not exposed in URL
- ✅ Automatic token management
- ✅ Works with CORS properly configured

##### **Approach 3: Popup Window with PostMessage (Best UX)**

**How it works:**
1. Frontend opens popup window to OAuth endpoint
2. User authenticates in popup
3. Backend callback redirects popup to frontend callback page
4. Frontend callback page sends tokens to parent window via `postMessage`
5. Parent window receives tokens and closes popup

**Backend Code:**
```typescript
@Get("google/callback")
@UseGuards(GoogleGuard)
async googleCallback(@Req() req: any, @Res() res: any) {
  const { user, accessToken, refreshToken } = req.user;
  
  // Redirect to frontend callback page (in popup)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  res.redirect(
    `${frontendUrl}/auth/callback?` +
    `accessToken=${accessToken}&` +
    `refreshToken=${refreshToken}&` +
    `popup=true` // Indicates this is a popup flow
  );
}
```

**Frontend Code:**
```typescript
// OAuth login function
function loginWithGoogle() {
  const popup = window.open(
    '/api/v1/auth/oauth/google',
    'oauth',
    'width=500,height=600,left=100,top=100'
  );

  // Listen for message from popup
  window.addEventListener('message', (event) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'OAUTH_SUCCESS') {
      const { accessToken, refreshToken } = event.data;
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Close popup
      popup.close();
      
      // Update UI
      navigate('/dashboard');
    }
  });
}

// Frontend callback page (in popup)
function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isPopup = searchParams.get('popup') === 'true';

    if (accessToken && refreshToken && isPopup) {
      // Send tokens to parent window
      window.opener.postMessage({
        type: 'OAUTH_SUCCESS',
        accessToken,
        refreshToken,
      }, window.location.origin);
      
      // Close popup
      window.close();
    }
  }, [searchParams]);

  return <div>Completing authentication...</div>;
}
```

**Benefits:**
- ✅ User stays on main page (doesn't navigate away)
- ✅ Better UX (no full page reload)
- ✅ Main app state preserved

#### 📊 Comparison Table

| Approach | Security | UX | Complexity | Token Storage |
|----------|----------|----|-----------|----------------|
| **URL Query Params** | ⚠️ Medium | ✅ Good | ✅ Simple | localStorage/sessionStorage |
| **HTTP-Only Cookies** | ✅ Best | ✅ Good | ✅ Simple | Cookies (automatic) |
| **Popup + PostMessage** | ✅ Good | ✅✅ Best | ⚠️ Medium | localStorage/sessionStorage |

#### 🔄 Complete Flow Diagram

##### **Approach 1: URL Query Params**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Login with Google"                              │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Frontend: window.location = '/api/v1/auth/oauth/google'      │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Backend redirects to Google                                   │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. User authenticates on Google                                  │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Google redirects to: /api/v1/auth/oauth/google/callback      │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Backend processes callback                                    │
│    - Gets tokens                                                 │
│    - Redirects to: /auth/callback?accessToken=...&refreshToken=...│
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Frontend route /auth/callback receives URL                   │
│    - Extracts tokens from query params                          │
│    - Stores tokens                                              │
│    - Redirects to dashboard                                    │
└─────────────────────────────────────────────────────────────────┘
```

##### **Approach 2: HTTP-Only Cookies**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1-5. Same as above                                              │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Backend processes callback                                    │
│    - Gets tokens                                                 │
│    - Sets HTTP-only cookies                                      │
│    - Redirects to: /auth/callback?success=true                 │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Frontend route /auth/callback                                 │
│    - Tokens already in cookies                                    │
│    - Redirects to dashboard                                      │
│    - Future API requests automatically include cookies           │
└─────────────────────────────────────────────────────────────────┘
```

#### 💻 Recommended Implementation

##### **Backend (Recommended: Cookies Approach)**

```typescript
@Get("google/callback")
@UseGuards(GoogleGuard)
async googleCallback(@Req() req: any, @Res() res: any) {
  const { user, accessToken, refreshToken } = req.user;
  
  const frontendUrl = configService.getString('FRONTEND_URL');
  
  // Set secure HTTP-only cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  // Redirect to frontend
  res.redirect(`${frontendUrl}/auth/callback?success=true`);
}
```

##### **Frontend (React Router Example)**

```typescript
// routes.tsx
<Route path="/auth/callback" element={<AuthCallback />} />

// AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === 'true') {
      // Verify auth by making a request (cookies sent automatically)
      fetch('/api/v1/users/profile', {
        credentials: 'include', // Include cookies
      })
        .then(res => res.json())
        .then(data => {
          // Update app state with user data
          // Redirect to dashboard
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login?error=oauth_failed');
        });
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate, searchParams]);

  return <div>Completing authentication...</div>;
}
```

#### 🔐 Security Considerations

##### **URL Query Params:**
- ⚠️ Tokens visible in browser history
- ⚠️ Tokens visible in server logs
- ⚠️ Tokens can be leaked if URL is shared
- ✅ Simple to implement

##### **HTTP-Only Cookies:**
- ✅ Tokens not accessible via JavaScript (XSS protection)
- ✅ Automatic token management
- ✅ More secure
- ⚠️ Requires CORS configuration
- ⚠️ Cookies must be set on same domain or with proper CORS

##### **Popup + PostMessage:**
- ✅ Good UX
- ✅ Tokens not in URL
- ⚠️ Must verify message origin
- ⚠️ Popup blockers might interfere

#### 📝 Summary

**The Problem:** Backend callback returns JSON, but frontend SPA doesn't receive it.

**The Solution:** Backend should redirect to frontend URL (not return JSON directly).

**Best Approach:** Use HTTP-only cookies for security, or redirect with tokens in URL for simplicity.

**Key Point:** The browser navigates through the OAuth flow, and the backend redirects the browser back to the frontend with tokens (in URL or cookies), where the frontend can extract and store them.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 Project Structure

```
MindMission/
├── src/
│   ├── infrastructure/     # Cross-cutting infrastructure concerns
│   ├── modules/            # Feature modules (Clean Architecture)
│   ├── app.module.ts       # Root application module
│   └── main.ts             # Application entry point
├── test/                   # E2E tests
├── dist/                   # Compiled output
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker image definition
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (throttling)
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (TypeORM)
- XSS protection
- Secure headers middleware

## 🚢 Deployment

The application is containerized and ready for deployment:

1. Build Docker image:
   ```bash
   docker build -t mindmission-backend .
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. For production deployment, ensure:
   - Environment variables are properly configured
   - Database migrations are run
   - SSL/TLS is configured
   - Monitoring and logging are set up

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- MindMission Development Team

---

**Built with ❤️ using NestJS and Clean Architecture**
