# SecuredVault: Component Hierarchy

This document outlines the component structure of the SecuredVault password manager application, showing the relationships and nesting of UI components.

## Application Structure Overview

```
┌─ App
│  │
│  ├─ LockScreen (when app is locked)
│  │
│  └─ AppLayout (when app is unlocked)
│     │
│     ├─ Sidebar
│     │  
│     └─ PageTransition
│        │
│        ├─ Vault
│        │
│        ├─ PasswordGenerator
│        │
│        ├─ SecuredNotes
│        │
│        ├─ DarkWebScan
│        │
│        └─ Settings
```

## Detailed Component Hierarchy

### Core Layout Components

```
App
├─ LockScreen
│  ├─ PasswordForm
│  └─ Button
│
└─ AppLayout
   ├─ Sidebar
   │  ├─ Logo
   │  ├─ NavLink (multiple)
   │  ├─ ThemeToggle
   │  └─ LockButton
   │
   └─ PageContent
      ├─ Header
      │  ├─ PageTitle
      │  └─ SearchBar
      │
      └─ PageTransition
         └─ [Page Components]
```

### Page Components

#### 1. Vault Page

```
Vault
├─ SearchBar
├─ CategoryFilter
├─ SortOptions
│
├─ CredentialsList
│  └─ CredentialCard (multiple)
│     ├─ CredentialInfo
│     └─ ActionButtons
│        ├─ ViewButton
│        ├─ EditButton
│        ├─ CopyButton
│        └─ DeleteButton
│
├─ AddCredentialButton
│
└─ CredentialDialog
   ├─ CredentialForm
   │  ├─ FormField (multiple)
   │  ├─ PasswordStrengthMeter
   │  └─ CategorySelector
   │
   └─ ActionButtons
      ├─ SaveButton
      └─ CancelButton
```

#### 2. Password Generator Page

```
PasswordGenerator
├─ PasswordDisplay
│  ├─ GeneratedPassword
│  └─ CopyButton
│
├─ PasswordOptions
│  ├─ LengthSlider
│  ├─ OptionCheckbox (multiple)
│  │  ├─ IncludeUppercase
│  │  ├─ IncludeLowercase
│  │  ├─ IncludeNumbers
│  │  └─ IncludeSymbols
│  │
│  └─ GenerateButton
│
└─ PasswordStrengthIndicator
   ├─ StrengthMeter
   └─ StrengthLabel
```

#### 3. Secured Notes Page

```
SecuredNotes
├─ NotesLockScreen (if locked)
│  └─ PasswordForm
│
├─ NotesList (if unlocked)
│  ├─ SearchBar
│  │
│  ├─ NoteCard (multiple)
│  │  ├─ NoteTitle
│  │  ├─ NoteSummary
│  │  ├─ TimeStamp
│  │  └─ ActionButtons
│  │     ├─ EditButton
│  │     └─ DeleteButton
│  │
│  └─ AddNoteButton
│
└─ NoteDialog
   ├─ NoteForm
   │  ├─ TitleInput
   │  └─ ContentTextarea
   │
   └─ ActionButtons
      ├─ SaveButton
      └─ CancelButton
```

#### 4. Dark Web Scan Page

```
DarkWebScan
├─ ScanForm
│  ├─ EmailInput
│  └─ ScanButton
│
├─ ScanResults
│  └─ ResultCard (multiple)
│     ├─ BreachInfo
│     │  ├─ ServiceIcon
│     │  ├─ ServiceName
│     │  └─ BreachDate
│     │
│     ├─ SeverityIndicator
│     └─ ActionButton
│
└─ ScanHistory
   └─ HistoryItem (multiple)
```

#### 5. Settings Page

```
Settings
├─ SettingsSection (multiple)
│  │
│  ├─ AccountSettings
│  │  ├─ ChangePasswordForm
│  │  └─ AccountInfoForm
│  │
│  ├─ AppSettings
│  │  ├─ AutoLockSelector
│  │  ├─ NotesLockIntervalSelector
│  │  └─ ThemeToggle
│  │
│  └─ DataSettings
│     ├─ ExportDataButton
│     ├─ ImportDataButton
│     └─ ClearDataButton
│
└─ ConfirmationDialog
   ├─ WarningMessage
   └─ ActionButtons
      ├─ ConfirmButton
      └─ CancelButton
```

### Shared UI Components

```
UI Components
├─ Button
│  ├─ PrimaryButton
│  ├─ SecondaryButton
│  └─ DangerButton
│
├─ Input
│  ├─ TextInput
│  ├─ PasswordInput
│  └─ SearchInput
│
├─ Dialog
│  ├─ DialogHeader
│  ├─ DialogContent
│  └─ DialogFooter
│
├─ Card
│
├─ Dropdown
│  ├─ DropdownTrigger
│  └─ DropdownContent
│
├─ Toast
│  ├─ SuccessToast
│  └─ ErrorToast
│
└─ Tooltip
```

## Component Interaction Patterns

### Parent-Child Data Flow

1. **Props Passing**: Data flows down from parent to child components
   - Example: `Vault` passes credential data to `CredentialsList` which passes individual items to `CredentialCard`

2. **Callback Functions**: Child components communicate with parents via callback props
   - Example: `CredentialForm` calls parent-provided `onSave` function when form is submitted

### Component-Redux Interactions

1. **Connect Pattern**: Components connect to Redux store using hooks
   - Example: `useSelector` to read state, `useDispatch` to dispatch actions

2. **Selector Functions**: Components use selectors to extract specific data
   - Example: `Vault` uses selectors to get filtered credentials based on search state

### Component State vs. Redux State

1. **Component State (useState)**:
   - Form input values before submission
   - UI toggling (open/closed dialogs)
   - Animation states

2. **Redux State**:
   - Application data (credentials, notes)
   - User authentication status
   - Application preferences
   - Search and filter criteria

## Component Lifecycle and Effects

Components use React's useEffect hook for:

1. **Data Loading**: Fetching initial data from localStorage
   - Example: `App` loads persisted state on mount

2. **Auto-locking**: Monitoring inactivity for security
   - Example: `App` tracks last activity and locks after timeout

3. **Side Effects**: Managing browser interactions
   - Example: `PasswordGenerator` copies generated passwords to clipboard

## Component Styling Architecture

The application uses a combination of Tailwind CSS utility classes and component-based styling:

1. **Shadcn Components**: Pre-styled UI components from Shadcn library
   - Example: Buttons, Dialogs, Forms

2. **Tailwind Classes**: Direct styling using utility classes
   - Example: Layout, spacing, responsive behavior

3. **Theme Variables**: Dynamic theming based on user preferences
   - Example: Light/dark mode controlled via theme context