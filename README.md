# AI Assistant Web App - Project AA

A modern web application with a secure login/registration page inspired by ChatGPT, Craft, and Notion. Features a clean, minimalist aesthetic with both light and dark modes.

## Project Overview

This project aims to create an AI-powered web application with a focus on:
- Clean, modern UI inspired by popular productivity tools
- Secure authentication with multiple options
- AI-powered chat interface with advanced features
- Cross-platform compatibility

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Radix UI
- **Authentication**: Supabase Auth with OAuth support
- **Database**: Supabase
- **AI Integration**: Modular adapter for multiple AI models
- **Deployment**: Vercel
- **Asset Storage**: Google Cloud Console bucket
- **Native Apps**: Capacitor for iOS and Android

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the Vite development server at http://localhost:3000.

2. Build for production:
   ```bash
   npm run build
   ```
   This will create a production build in the `dist` directory.

### Native App Development

1. Sync web assets to native platforms:
   ```bash
   npx cap sync
   ```

2. Open iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

3. Open Android project in Android Studio:
   ```bash
   npx cap open android
   ```

## Deployment

### Web Deployment

To deploy to Vercel:
```bash
./deploy.sh
```

### Native App Deployment

Follow the standard iOS and Android deployment processes using Xcode and Android Studio respectively.

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `pages/` - Page components
  - `services/` - Service modules (Supabase, AI, etc.)
  - `styles/` - CSS styles
- `public/` - Static assets
- `ios/` - iOS native project
- `android/` - Android native project

## Features

- **Authentication**: OAuth and email/password login
- **AI Chat**: Conversational interface with context awareness
- **Dark Mode**: System-level detection with manual toggle
- **Responsive Design**: Works on all device sizes
- **Native Apps**: iOS and Android support via Capacitor

## Core Features

### Authentication & User Management
- OAuth login (Google, Apple, Microsoft)
- Email/password registration
- Session management via Supabase
- Personalized dashboard for authenticated users

### User Interface & Experience
- Client First methodology with Tailwind CSS and Radix UI
- Responsive design for all devices
- System-level light/dark mode detection
- WCAG 2.1 AA accessibility compliance

### AI Integration
- Modular adapter pattern for AI models
- Development: Open-source models (Deepseek, Qwen)
- Production: Cloud APIs (OpenAI/Anthropic)
- Automatic prompt optimization
- Vector database for conversation history (ChromaDB)

### Core Functionalities
- Modern chat interface with prompt optimization toggle
- Context & memory management with RAG
- Task extraction and Google Calendar integration
- Voice features (speech-to-text, text-to-speech)
- Multiple language support

## Style Guide

### Color Palette
- **Dark Mode**:
  - Primary Background: #121314
  - Primary Text: #FFFEFC
  - Borders: #434343
  - Secondary Text: #9A9A9A
- **Light Mode**:
  - Primary Background: #FFFEFC
  - Primary Text: #040404
  - Secondary Button Border: #E6E3DE
  - Secondary Text: #ADABA9
- **Accent Color**: #2383E2

### Typography & Spacing
- Font: Clean sans-serif (Helvetica, Arial)
- Sizing: rem units for fonts, margins, and paddings
- Headings: Bold and clear hierarchy
- Body Text: Regular weight for readability

### UI Components
- **Primary Buttons**:
  - Background: #2383E2
  - Text: White (#FFFFFF)
- **Secondary Buttons**:
  - Transparent/monochrome background
  - Border (light mode): #E6E3DE
- **Forms & Inputs**:
  - Borders: #434343 (dark) / #E6E3DE (light)
  - Consistent hover states

## Development Guidelines

### Project Structure
- Modular structure separating authentication, UI components, and integrations
- Follow Client First documentation for structure

### Deployment
- Web deployment via Vercel with CI/CD pipeline
- Native packaging using Capacitor
- Environment variables for secure configuration

### Compliance & Security
- GDPR compliance for user data
- Secure API keys via environment variables
- Asset storage in Google Cloud Console bucket

## Change Management
- All changes must be logged in changelog.md
- Each commit should include clear descriptions of updates

## Compliance
This project is designed to be GDPR compliant and follows WCAG 2.1 AA accessibility standards.

App AA
Project Overview
Develop a modern web app that begins with a secure login/registration page, inspired by ChatGPT, Craft, and Notion.
Some pages (e.g., sign up/sign in TSX files) already exist and need refinement.

Important Notes for Cursor
Only create the app and refine the sign up/sign in pages.
Always log changes in changelog.md.
I already have:
A Supabase project (for authentication and database).
A Vercel project (for deployment).
A GitHub repository (for version control).
A Google Cloud Console bucket (for storing assets).
Use this Client First documentation for structure:
👉 Client First Docs
1. Core Features & Implementation
A. Authentication & User Management
Implement OAuth login for Google, Apple, and Microsoft.
Allow optional email/password registration.
Do not use tabs for switching between sign up and sign in.
Instead, include a button with the text:
"Already have an account? Sign in"
Secure backend authentication with session management via Supabase.
Redirect authenticated users to a personalized dashboard.
B. User Interface & Experience
Use Client First methodology, Tailwind CSS, and Radix UI for UI components.
Ensure responsive layouts for desktop, tablet, and mobile.
Follow Material Design 3 and Apple Human Interface Design guidelines.
Support system-level light/dark mode detection.
Ensure WCAG 2.1 AA compliance for accessibility.
C. AI Integration
Implement an AI engine with a modular adapter pattern.
Support open-source AI models (e.g., Deepseek, Qwen) for development.
Enable switching to OpenAI/Anthropic APIs for production.
Implement automatic prompt optimization before sending queries.
Store conversation history in a vector database (e.g., ChromaDB).
D. Core Functionalities
Chat Interface:
Provide a modern chat interface.
Include a toggle for automatic prompt optimization.
Allow users to edit optimized prompts before submission.
Context & Memory Management:
Implement retrieval-augmented generation (RAG).
Use a vector database for storing conversation history.
Task & Calendar Integration:
Automatically extract to-dos from chat interactions.
Integrate Google Calendar for event scheduling.
Voice Features:
Implement speech-to-text input.
Enable text-to-speech output.
Include voice command recognition.
Multiple Language Support:
Allow users to select from multiple language options.
E. Compliance & Security
Ensure GDPR compliance for user data handling.
Secure API keys and sensitive data via environment variables.
Store assets securely in Google Cloud Console bucket.
2. Style Guide
A. Design Aesthetic
Clean, minimalist design with ample whitespace.
Consistent unified style across all app components.
Inspired by Notion's simplicity and ChatGPT's modern UI.
B. Color Palette
Dark Mode:
Primary Background: #121314
Primary Text: #FFFEFC
Borders: #434343
Secondary Text: #9A9A9A
Light Mode:
Primary Background: #FFFEFC
Primary Text: #040404
Secondary Button Border: #E6E3DE
Secondary Text: #ADABA9
Accent Color: #2383E2 (apply to interactive elements like buttons, links, and hover states).
C. Typography & Spacing
Font: Use a clean, sans-serif font (e.g., Helvetica, Arial).
Sizing: Use rem units for fonts, margins, and paddings.
Headings: Bold and clear (h1, h2, h3).
Body Text: Regular weight for maximum readability.
D. UI Components
Primary Buttons:
Background: #2383E2
Text: White on Blue (#FFFFFF)
Secondary Buttons:
Transparent or monochrome background.
Border (light mode): #E6E3DE
Forms & Inputs:
Borders: #434343 (dark mode) / #E6E3DE (light mode)
Hover States: Consistent styling with subtle effects.
3. Development & Deployment
Use Supabase for authentication and data storage.
Host the app on Vercel with a CI/CD pipeline.
Store assets in Google Cloud Console bucket.
Ensure GDPR compliance for all data handling.
4. Change Logging
Always log changes in changelog.md.
Each commit should include clear descriptions of updates.
Final Instructions for Cursor
Refine the sign up/sign in pages (TSX files).
Build the initial app structure.
Implement authentication (OAuth + Supabase).
Follow the style guide strictly (Client First, Tailwind, Radix UI).
Ensure full GDPR compliance and security best practices.
Store all assets in Google Cloud Console bucket.
Log all changes in changelog.md.

always add changes makde in the changelog.md file.

create to create a modern web app that begins with a secure login/registration page inspired by ChatGPT, Craft, and Notion. This and some otehr apges are already created but will need to be refined.

### Core Requirements

1. **Authentication & User Management**
   - Develop a stylish login screen with options to:
     - Sign up using OAuth (Google, Apple, Microsoft).
     - Optionally sign up with email and password.
   - Secure backend authentication with session management.
   - Redirect authenticated users to a personalized dashboard with access to the AI assistant.

2. **User Interface & Experience**
   - Create a clean, modern, and minimal design inspired by ChatGPT, Craft, and Notion.
   - Include placeholders for product previews or brief descriptions near the login form.
   - Ensure a responsive UI for desktop, tablet, and mobile views.

3. **AI Integration**
   - Integrate an AI engine via a modular adapter pattern:
     - Allow for using an open source model (e.g., Deepseek or Qwen) during development.
     - Enable seamless switching to cloud-based APIs (OpenAI/Anthropic) for production.
   - Implement prompt optimization and context-aware processing to enhance interactions.
   - Support features such as task extraction and dynamic response tuning.

4. **Core Features & Functionalities**
   - **Chat Interface:**  
     - Provide a chat interface with a prompt optimization toggle.
     - Allow editing of optimized prompts before sending.
   - **Context & Memory Management:**  
     - Implement retrieval-augmented generation (RAG) to maintain context from previous conversations.
     - Use a vector database (e.g., ChromaDB) for storing conversation history.
   - **Task & Calendar Integration:**  
     - Automatically extract to-dos and tasks from conversations.
     - Integrate with Google Calendar to schedule and manage events.
   - **Voice Interaction:**  
     - Integrate the Web Speech API for voice input and output.
   - **Notifications:**  
     - Implement push notifications and reminders for tasks and calendar events.
   - **User Settings:**  
     - Allow customization of AI parameters (e.g., creativity, response length).
     - Support theme customization (e.g., dark mode).

5. **Deployment & Multi-Platform Support**
   - Deploy on the web via Vercel with a clean CI/CD pipeline.
   - Package the web app for native platforms (iOS, macOS, Windows, Android) using Capacitor.
   - Configure environment variables for OAuth keys, API endpoints, and other sensitive data.

6. **Project Structure & Documentation**
   - Adopt a modular project structure separating authentication, AI services, UI components, and third-party integrations.
   - Include detailed documentation for setup, configuration, and future feature expansions.
   - Maintain a GitHub repository with continuous deployment setup.

### Additional Optional Features
- **Real-Time Collaboration:** Support multi-user chat sessions.
- **Analytics Dashboard:** Provide insights into user interactions and AI performance.
- **Feedback Mechanism:** Enable users to rate AI responses to improve accuracy over time.
- **Advanced Customization:** Allow users to adjust AI parameters and manage multiple themes or projects.

"1. dont use tabs for the sign up / sign in. Have a button that says something like "already have an account? Sign in"

2. Remake the styles. Style guide designed to support both light and dark modes while delivering a clean, minimalist aesthetic inspired by Notion and ChatGPT. It uses a primarily monochrome color palette accented with subtle hues for visual interest.

Style Guide
1. Design Aesthetic
Overall Look & Feel:

Clean, minimalist design with a focus on simplicity and clarity.
Consistent and unified styling across the entire app.
Ample white (or negative) space to ensure a clutter-free interface.
Design inspiration drawn from Notion's simplicity and ChatGPT's modern interface.
Design Principles:

Prioritize readability and usability.
Emphasize clarity through simple, flat design elements.
Follow design best practices from Apple (e.g., minimalism, intuitive interactions) and Google (e.g., material design principles).
2. Color Palette
Primary Palette:

Use a monochrome base for both light and dark modes.
Integrate subtle accent colors sparingly to highlight interactive elements.
Dark Mode Settings:

Primary Background: #121314
Primary Text: #FFFEFC
Borders: #434343
Secondary Text: #9A9A9A
Light Mode Settings:

Primary Background: #FFFEFC
Primary Text: #040404
Secondary Button Border: #E6E3DE
Secondary Text: #ADABA9
Accent Color (Optional - Blue):

Accent: #2383E2
(Apply to interactive elements such as links, buttons, or hover states)
3. Typography & Spacing
Font Choices & Hierarchy:

Primary Font: Use a clean, sans-serif font (e.g., Helvetica, Arial, or a similar web-safe font).
Font Hierarchy:
Headings: Bold and clear (e.g., h1, h2, h3 with decreasing sizes).
Body Text: Regular weight for readability.
Captions/Labels: Slightly smaller with a lighter weight.
Sizing:
All sizing (fonts, margins, paddings, etc.) should be specified in rem units for scalability and consistency.
Spacing Guidelines:

Use consistent margins and paddings across components.
Ensure sufficient spacing between elements to maintain clarity and avoid visual clutter.
4. UI Components
Buttons:

Primary Buttons:
Background should use the accent color (#2383E2 when applicable).
Text should contrast with the background (e.g., white on blue).
Rounded corners or subtle shadows may be applied for a modern look.
Secondary Buttons:
Border color for light mode: #E6E3DE
Utilize transparent or monochrome backgrounds with appropriate hover states.
Inputs & Forms:

Text Inputs, Dropdowns, and Checkboxes:
Use clear, defined borders (using the dark mode border #434343 or equivalent in light mode).
Maintain a consistent style for focus and hover states.
Ensure input fields have enough padding for usability.
Backgrounds & Cards:

Cards and panels should adopt the primary background colors for each mode.
Use subtle borders or shadows to define sections without overwhelming the design.
5. Technical Guidelines
CSS Class Naming:

Follow the Client First convention to maintain clarity in your styles. For example, class names should be descriptive and reflect their purpose (e.g., client-header, client-button-primary).
Platform Guidelines:

Apple & Google:
Incorporate design principles from both ecosystems to ensure a familiar, intuitive experience for users on all platforms.
Prioritize performance and responsiveness.
Responsive Design:

Use media queries to adjust layout and component sizes for various screen sizes.
Ensure that the design works well across devices, from mobile to desktop.

Final Notes
Consistency is Key:
Ensure that every component adheres to this style guide. Consistency across typography, spacing, and color usage is vital to maintain a cohesive and professional look.
Iterative Refinement:
As you develop the app, continuously test and refine the styles, especially when switching between light and dark modes.
Accessibility:
Double-check color contrast ratios and ensure that the design meets accessibility guidelines for all users.
Does this style guide cover all your requirements, or is there any area you'd like to further expand or clarify?

Please store these styles somewhere so you know in the future.

I already have some pages created like thge sign up and sign in pages, they are tsx files. Use that if thats the best.

please keep all styles in the styles.css file. No more css fiels are needed

