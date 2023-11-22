# Configuration Documentation

## Introduction
This configuration module uses the `dotenv` library to load environment variables from a `.env` file into a TypeScript configuration object. It includes settings for the database (DB), server, and JSON Web Token (JWT).

## Installation
Make sure to install the required dependencies:

```bash
npm install dotenv
```

## Usage

  Create a .env file in your project's root directory with the necessary environment variables:

```env
DB_URL=mongodb://localhost:27017/mydatabase
PORT=3000
JWT_SECRET=mysecretkey
```
Import and use the configuration in your TypeScript application:

```typescript

// Import the dotenv library
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Configuration object
export const config = {
  // Database configuration
  DB: {
    // Database URL, defaults to an empty string if not provided
    url: process.env.DB_URL || "",
  },
  // Server configuration
  Server: {
    // Server port, defaults to 1337 if not provided
    port: Number(process.env.PORT) || 1337,
  },
  // JSON Web Token configuration
  JWT: {
    // JWT secret key, defaults to an empty string if not provided
    key: process.env.JWT_SECRET || "",
  },
};
```
  ### Accessing
  Access the configuration properties in your application:

  ```typescript
  // Accessing the configuration properties
  const databaseUrl: string = config.DB.url;
  const serverPort: number = config.Server.port;
  const jwtKey: string = config.JWT.key;

  // Use these values in your application as needed
  ```
## Configuration Details
1. **Database Configuration (DB):**

    `url`: The database URL. It is loaded from the `DB_URL` environment variable, and if not present, it defaults to an empty string.

2. **Server Configuration (Server):**

    `port`: The port on which the server will listen. It is loaded from the `PORT` environment variable and converted to a number. If not present, it defaults to 1337.

3. **JSON Web Token Configuration (JWT):**

    `key`: The secret key used for signing and verifying JSON Web Tokens. It is loaded from the `JWT_SECRET` environment variable, and if not present, it defaults to an empty string.





