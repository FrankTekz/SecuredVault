# SecuredVault: Technical Architecture Overview

## Application Architecture

SecuredVault is a modern password management application built with a client-centric architecture. The application follows a modular design pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CLIENT (React + Redux)                                     │
│  ┌─────────────────┐   ┌───────────────┐   ┌──────────────┐ │
│  │                 │   │               │   │              │ │
│  │  UI Components  │◄──┤  Redux Store  │◄──┤ LocalStorage │ │
│  │                 │   │               │   │              │ │
│  └────────┬────────┘   └───────────────┘   └──────────────┘ │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │                 │                                        │
│  │  Utility Libs   │                                        │
│  │  (Encryption)   │                                        │
│  │                 │                                        │
│  └─────────────────┘                                        │
│                                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ (Future API Integration Points)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│               SERVER (Express)                              │
│  ┌─────────────────┐   ┌───────────────┐                    │
│  │                 │   │               │                    │
│  │  API Endpoints  │   │  Data Storage │                    │
│  │  (placeholder)  │   │  (in-memory)  │                    │
│  │                 │   │               │                    │
│  └─────────────────┘   └───────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Components

### Frontend Architecture

1. **React Application**
   - Built with modern React (18+) utilizing functional components and hooks
   - Uses TypeScript for type safety in core infrastructure components
   - Implements JSX for component rendering logic

2. **State Management**
   - **Redux**: Central state management using Redux store
   - **Redux Slices**: Modular state organization with dedicated slices:
     - `userSlice`: Authentication, user preferences, and locking mechanisms
     - `credentialsSlice`: Password vault entries and credential management
     - `notesSlice`: Secured notes with encryption/decryption
     - `searchSlice`: Global search functionality

3. **UI Framework**
   - **Tailwind CSS**: For responsive styling and layout
   - **Shadcn UI**: Component library built on Radix UI primitives
   - **Framer Motion**: Animation library for page transitions

4. **Routing**
   - **Router**: Lightweight router for page navigation
   - Custom `PageTransition` component for animated route transitions

5. **Security Features**
   - **Client-side Encryption**: All sensitive data encrypted in the browser
   - **Master Password**: Hash-based validation for accessing secured content
   - **Auto-lock Mechanism**: Configurable timeouts for automatic locking
   - **LocalStorage**: Encrypted data persistence in browser storage
   - **Crypto-js**: Library used for encryption/decryption operations

### Backend Architecture (Minimal)

The backend is minimal and primarily serves the frontend application with placeholder API endpoints:

1. **Express Server**
   - Serves the React application in production
   - Configured for potential future API implementation

2. **API Structure**
   - Placeholder routes in `server/routes.ts`
   - In-memory storage implementation in `server/storage.ts`

3. **Database**
   - Schema definitions in `shared/schema.ts` using Drizzle ORM
   - Currently not connected to a database (prepared for future integration)

## Data Flow

1. **User Authentication**
   - Master password is hashed and stored in Redux state
   - Authentication state persisted in localStorage
   - Current implementation is client-side only

2. **Password Storage**
   - Credentials encrypted with master password
   - Encrypted data stored in localStorage via Redux
   - Decryption happens on-demand when viewing credentials

3. **Secured Notes**
   - Notes encrypted with master password
   - Similar to credentials, stored encrypted in localStorage
   - Separate lock mechanism provides additional security layer

## Build and Deployment

1. **Development Environment**
   - Vite for fast development server and building
   - TypeScript for type checking
   - Tailwind for CSS processing

2. **Production Build**
   - Production builds created with Vite
   - Result is a static site that can be deployed to any hosting platform
   - Minimal server requirements (static file serving)

## Security Model

The application implements a client-side security model with several layers:

1. **Master Password**
   - Never stored directly, only the hash is kept
   - Used as encryption key for sensitive data

2. **Data Encryption**
   - All sensitive data (passwords, notes) encrypted before storage
   - AES encryption via crypto-js library

3. **Auto-locking**
   - App locks automatically after configurable periods of inactivity
   - Requires master password re-entry to unlock

4. **Secure Notes Extra Protection**
   - Additional locking mechanism for secured notes
   - Configurable independent of main app lock

## Integration Points for Future Development

The architecture is designed to be extended with server-side capabilities:

1. **API Integration**
   - Routes are prepared in `server/routes.ts` 
   - Would connect to actual database instead of localStorage

2. **User Authentication**
   - Ready to implement actual user registration/login
   - Would require session management and server-side validation

3. **Cloud Sync**
   - Structure allows for future synchronization across devices
   - Would require backend implementation and secure API transport