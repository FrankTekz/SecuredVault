# SecuredVault: State Management Diagram

## Redux Store Architecture

SecuredVault uses Redux for global state management, organized into modular slices that handle specific aspects of the application. This document outlines the state flow and interactions between components and the Redux store.

```
     ┌────────────────────────────────────────────────────────────────────────┐
     │                                                                        │
     │                           REDUX STORE                                  │
     │________________________________________________________________________|                                                                        │
   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
   │                │  │                │  │                │  │                │
   │   userSlice    │  │credentialsSlice│  │   notesSlice   │  │   searchSlice  │
   │                │  │                │  │                │  │                │
   └───────┬────────┘  └───────┬────────┘  └───────┬────────┘  └────────┬───────┘
           │                   │                   │                    │        
           |                   |                   |                    |
           │                   │                   │                    │
           │                   │                   │                    │
           ▼                   ▼                   ▼                    ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │                             COMPONENT TREE                                  │
    │                                                                             │
    └─────────────────────────────────────────────────────────────────────────────┘
```

## Redux Slices

### 1. **userSlice**

The userSlice manages user authentication, settings, and locking state.

**State Structure:**
```javascript
{
  isLocked: boolean,
  hasPasswordSet: boolean,
  masterPasswordHash: string, 
  isInitialized: boolean,
  lastActivity: number,
  autoLockTimeout: string,
  theme: string,
  passwordStrengthCheck: boolean
}
```

**Key Actions:**
- `setMasterPassword`: Sets/updates the master password hash
- `lock`: Locks the application
- `unlock`: Unlocks the application with password validation
- `setAutoLockTimeout`: Updates auto-lock settings
- `updateLastActivity`: Records user activity to prevent auto-lock
- `setTheme`: Toggles light/dark theme
- `clearAllData`: Resets all application data

**Component Consumers:**
- `LockScreen`: For password verification
- `Settings`: For adjusting timeout settings and theme
- `App`: For global lock status and theme

### 2. **credentialsSlice**

The credentialsSlice handles the storage and management of encrypted password entries.

**State Structure:**
```javascript
{
  credentials: [
    {
      id: string,
      title: string,
      username: string,
      password: string, // Encrypted
      url: string,
      notes: string, // Encrypted
      category: string,
      createdAt: number,
      updatedAt: number
    }
  ],
  categories: string[]
}
```

**Key Actions:**
- `addCredential`: Adds a new credential with encryption
- `updateCredential`: Updates an existing credential
- `deleteCredential`: Removes a credential
- `addCategory`: Adds a new category
- `loadCredentials`: Loads encrypted credentials from localStorage

**Component Consumers:**
- `Vault`: For displaying and managing credentials
- `CredentialForm`: For adding/editing credentials

### 3. **notesSlice**

The notesSlice manages secured notes with separate encryption and locking.

**State Structure:**
```javascript
{
  notes: [
    {
      id: string,
      title: string,
      content: string, // Encrypted
      createdAt: number,
      updatedAt: number
    }
  ],
  notesLockInterval: string,
  isNotesLocked: boolean
}
```

**Key Actions:**
- `addNote`: Adds new encrypted note
- `updateNote`: Updates existing note with encryption
- `deleteNote`: Removes a note
- `lockNotes`: Locks notes section
- `unlockNotes`: Unlocks notes section
- `setNotesLockInterval`: Updates lock interval for notes

**Component Consumers:**
- `SecuredNotes`: For displaying/managing notes
- `NoteEditor`: For editing note content
- `Settings`: For adjusting notes lock interval

### 4. **searchSlice**

The searchSlice handles global search functionality across the application.

**State Structure:**
```javascript
{
  searchTerm: string,
  searchCategory: string,
  isSearching: boolean
}
```

**Key Actions:**
- `setSearchTerm`: Updates search query
- `setSearchCategory`: Filters by category
- `clearSearch`: Resets search state

**Component Consumers:**
- `SearchBar`: For input and search control
- `Vault`: For filtering credentials
- `SecuredNotes`: For filtering notes

## State Persistence

The Redux store synchronizes with localStorage for persistence:

```
┌────────────────────┐     ┌────────────────────┐
│                    │     │                    │
│    Redux Store     │◄───►│    LocalStorage    │
│                    │     │                    │
└────────────────────┘     └────────────────────┘
```

- On application load: State is rehydrated from localStorage
- On state changes: Updated state is persisted to localStorage
- Security: Sensitive data is always encrypted before storage

## State Flow Examples

### 1. **Adding a New Password**

```
User Input → CredentialForm → dispatch(addCredential) → credentialsSlice
    → encrypt data → update Redux state → persist to localStorage
```

### 2. **Unlocking the Application**

```
User Input → LockScreen → dispatch(unlock) → userSlice → validate password
    → update isLocked state → unlock application UI
```

### 3. **Auto-locking Flow**

```
Activity timeout → useEffect hook in App → checkLastActivity
    → dispatch(lock) → userSlice → update isLocked → show LockScreen
```

### 4. **Searching Credentials**

```
User Input → SearchBar → dispatch(setSearchTerm) → searchSlice
    → update searchTerm → Vault (filtered render based on searchTerm)
```

## Component-Level State

Besides Redux global state, several components maintain local state using React hooks:

1. **Forms**: Use `useState` for form fields before submission to Redux
2. **Modals/Dialogs**: Use `useState` for open/closed state
3. **UI Animations**: Use state for controlling animations
4. **Temporary UI States**: Like hover effects, expansion states