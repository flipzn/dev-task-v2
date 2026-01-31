# Node + Express Service Starter

This is a simple API sample in Node.js with express.js.

## Prerequisites
- Node.js 20 or above.

## Getting Started
Look in the `package.json` to see available scripts.

First install all dependencies:
```sh
npm i
```

To run the application in development mode where file changes are automatically recognized:
```sh
npm run dev
```

## Instructions

We're using the package "localtunnel" to generate a publicly accessible URL which the provided test API can send requests to.

The file `start-with-tunnel.js` represents this logic and writes the URL to the `.env` file.

If the application is started with the `start_tunnel_test_positive` script a NODE environment variable `TEST_POSITIVE` is set to 1 via the command line and referenced in `src/index.ts`.

## Steps to reproduce behaviour

1. Run `npm run start-tunnel-test-random` OR `npm run start-tunnel-test-positive` in a terminal window. 

This starts the express server with prejudice on how the request should resolve.

2. Run `npm run test` in another terminal window.

## Hint
Sometimes the public URL isn't responding perfectly.
Either retry the test case execution or restart the server to generate a new public URL.

