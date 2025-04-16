# Password Manager Export

This document provides guidance on exporting this project from Replit to GitHub.

## Important Files & Directories

### Core Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite bundler configuration
- `postcss.config.js`: PostCSS configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `theme.json`: Theme settings
- `drizzle.config.ts`: Drizzle ORM configuration
- `.gitignore`: Git ignore patterns

### Source Code Directories
- `client/`: Frontend React application
  - `client/src/`: Source code
  - `client/src/components/`: UI components
  - `client/src/pages/`: Page components
  - `client/src/hooks/`: Custom React hooks
  - `client/src/lib/`: Utility functions
  - `client/src/slices/`: Redux slices
  - `client/index.html`: HTML entry point
- `server/`: Backend Express server
- `shared/`: Shared types and schemas

## Manual Export Instructions

1. Create a new GitHub repository
2. Clone the repository to your local machine
3. Copy all files from this Replit project to your local repository
4. Push the changes to GitHub

## GitHub Setup Commands

```bash
# After creating your GitHub repository
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME

# Copy all files from Replit (manually download them)
# Then commit and push
git add .
git commit -m "Initial commit"
git push origin main
```