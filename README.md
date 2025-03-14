# NoStranger - Nostr Authentication Service

A NestJS-based authentication service using the Nostr protocol for cryptographic authentication.

## Description

NoStranger is a lightweight authentication service that allows users to authenticate using Nostr events. It uses cryptographic signatures from the Nostr protocol to verify user identity and issues JWT tokens for authenticated sessions.

## Features

- Authenticates users via Nostr events
- Validates Nostr event signatures
- Issues JWT tokens for authenticated sessions
- Provides route protection with JWT guard

## Installation

```bash
$ npm install
```

## Configuration

Replace the JWT secret in `src/auth/auth.module.ts` with a proper secret. For production, use environment variables.

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
}),
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication

- **POST /auth/login**
  - Accepts a Nostr event in the request body
  - Returns JWT token upon successful authentication

### Protected Routes

- **GET /protected**
  - Example protected route that requires JWT authentication
  - Returns user pubkey from the JWT token

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Client Authentication Example

Here's an example of how to authenticate from a client application:

```javascript
import { generatePrivateKey, getPublicKey, signEvent } from 'nostr-tools';

// Generate keys (in a real app, the privateKey would be stored securely)
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);

// Create authentication event
const event = {
  kind: 22242, // Custom kind for authentication
  pubkey: publicKey,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Authentication request'
};

// Sign the event
const signedEvent = signEvent(event, privateKey);

// Send to the server
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(signedEvent),
})
.then(response => response.json())
.then(data => {
  // Store the JWT token
  localStorage.setItem('token', data.access_token);
});
```

## License

This project is MIT licensed.
