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
