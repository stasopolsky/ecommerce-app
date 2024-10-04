ecommerce-app/
│
├── src/
│ ├── auth/ # Authentication Module
│ │ ├── auth.controller.ts # Authentication routes (login, register, password reset, etc.)
│ │ ├── auth.module.ts # Auth module configuration
│ │ ├── auth.service.ts # Auth service (business logic)
│ │ ├── jwt.strategy.ts # JWT strategy for token-based auth
│ │ ├── google.strategy.ts # Google OAuth strategy
│ │ ├── facebook.strategy.ts # Facebook OAuth strategy
│ │ └── dto/ # Auth-related Data Transfer Objects
│ │ ├── login.dto.ts
│ │ ├── register.dto.ts
│ │ └── reset-password.dto.ts
│ │
│ ├── users/ # Users Module
│ │ ├── users.controller.ts # User routes (CRUD operations on users)
│ │ ├── users.module.ts # User module configuration
│ │ ├── users.service.ts # User service (business logic for users)
│ │ ├── entities/ # Entities (Prisma Models or other DB models)
│ │ └── user.entity.ts
│ │ ├── dto/ # Data Transfer Objects for users
│ │ ├── create-user.dto.ts
│ │ ├── update-user.dto.ts
│ │ └── user-profile.dto.ts
│ │
│ ├── products/ # Products Module
│ │ ├── products.controller.ts # Product routes (CRUD for products)
│ │ ├── products.module.ts # Product module configuration
│ │ ├── products.service.ts # Product service (business logic for products)
│ │ ├── entities/ # Product entities (Prisma or other DB models)
│ │ └── product.entity.ts
│ │ ├── dto/ # Data Transfer Objects for products
│ │ ├── create-product.dto.ts
│ │ ├── update-product.dto.ts
│ │ └── product-filter.dto.ts
│ │
│ ├── orders/ # Orders Module
│ │ ├── orders.controller.ts # Order routes (CRUD for orders)
│ │ ├── orders.module.ts # Order module configuration
│ │ ├── orders.service.ts # Order service (business logic for orders)
│ │ ├── entities/ # Order entities (Prisma or other DB models)
│ │ └── order.entity.ts
│ │ ├── dto/ # Data Transfer Objects for orders
│ │ ├── create-order.dto.ts
│ │ ├── update-order.dto.ts
│ │ └── order-status.dto.ts
│ │
│ ├── prisma/ # Prisma Module
│ │ ├── prisma.module.ts # Prisma module configuration
│ │ ├── prisma.service.ts # Prisma service (Prisma client connection logic)
│ │ └── seed.ts # Seed data (initial data population)
│ │
│ ├── config/ # Configuration Module
│ │ ├── config.module.ts # Configuration module for managing environment variables
│ │ └── config.service.ts # Service to access config values
│ │
│ ├── common/ # Shared module for utilities, interceptors, guards, etc.
│ │ ├── interceptors/ # Interceptors like logging, error handling
│ │ ├── decorators/ # Custom decorators
│ │ ├── filters/ # Exception filters
│ │ ├── guards/ # Guards for route protection
│ │ └── utils/ # Utility functions
│ │
│ ├── app.module.ts # Root module
│ ├── main.ts # Main entry point
│ └── env/ # Environment variable files
│ ├── .env # Local environment variables
│ ├── .env.development # Development environment
│ └── .env.production # Production environment
│
├── prisma/
│ ├── schema.prisma # Prisma schema file for DB models
│ └── migrations/ # Prisma migration files
│
├── test/ # Tests for the app
│ ├── auth/ # Auth module tests
│ ├── users/ # Users module tests
│ └── e2e/ # End-to-end tests
│
├── package.json # Node.js dependencies
├── tsconfig.json # TypeScript configuration
├── .prettierrc # Prettier configuration for code formatting
└── .eslintrc.js # ESLint configuration for linting
