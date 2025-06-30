# Resilient Email Sending Service

## Features
- Retry with exponential backoff
- Provider fallback
- Idempotency
- Rate limiting
- Status tracking
- Circuit breaker
- Logging and queueing

## Setup
1. Run `npm install`.
2. Compile TypeScript with `npx tsc`.
3. Run the code with `node dist/index.js`.

## Testing
Use your preferred test runner (e.g., Jest or Mocha) to create unit tests in `tests/`.