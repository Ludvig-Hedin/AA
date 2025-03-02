# Deployment Guide for AI Assistant Web App

This document provides instructions for deploying the AI Assistant Web App to various platforms.

## Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- Git
- Vercel account (for web deployment)
- Xcode (for iOS deployment)
- Android Studio (for Android deployment)

## Setting up the Repository

If you're starting from scratch:

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Web Deployment (Vercel)

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

   Or for production:
   ```bash
   vercel --prod
   ```

Alternatively, you can set up automatic deployments by connecting your GitHub repository to Vercel.

## Mobile Deployment (Capacitor)

### iOS

1. Build the web application:
   ```bash
   npm run build
   ```

2. Sync Capacitor:
   ```bash
   npx cap sync
   ```

3. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

4. In Xcode, select a deployment target (device or simulator) and click the Run button.

### Android

1. Build the web application:
   ```bash
   npm run build
   ```

2. Sync Capacitor:
   ```bash
   npx cap sync
   ```

3. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

4. In Android Studio, select a deployment target (device or emulator) and click the Run button.

## CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow for continuous integration and deployment:

1. Push changes to the `main` branch to trigger the workflow:
   ```bash
   git push origin main
   ```

2. The workflow will:
   - Install dependencies
   - Run linting and tests
   - Build the application
   - Deploy to the specified platforms (if configured)

## Environment Variables

For the application to work correctly, you'll need to set up the following environment variables:

- In development: Create a `.env.local` file in the root directory
- In production: Set these in your Vercel project settings

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `AI_API_KEY`: Your AI service API key

## Troubleshooting

If you encounter issues during deployment:

1. Ensure all environment variables are correctly set
2. Check that all dependencies are installed
3. Verify that you have the necessary permissions for deployment
4. Review the build logs for specific error messages

For further assistance, please open an issue on the GitHub repository. 