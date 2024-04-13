# DocsQuality angular example

## Introduction

This guide provides detailed instructions for setting up and running an DocsQuality angular example project.
Please follow these steps to get your environment ready and launch the application.

## Prerequisites

- **Node.js**: Required for npm (Node Package Manager). Download and install it from [nodejs.org](https://nodejs.org).
- **Angular CLI**: Needed for Angular project management and development tasks. Install it globally using npm:
  ```bash
  npm install -g @angular/cli
  ```

## Installation

1. Install project dependencies

    ```bash
    npm install
    ```

2. Enter your credentials (available in your [DocsQuality](https://app.docsquality.com/) account)

   Open the `src/environments/environment.ts` file and replace the `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET` placeholders
   with your DocsQuality credentials.

    ```typescript
    export const environment = {
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    };
    ```
   
**Note: do not upload confidential documents.**

For a **fully private** (standalone) version,
check out [DocsQuality offline integration](https://docs.app.docsquality.com/usage.html#offline-integration).

## Running the application

1. Serve the application

    ```bash
    ng serve
    ```

2. Access the application

Open your web browser and go to http://localhost:4200/. The app will automatically reload if you change any of the
source files.


