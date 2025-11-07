# Environment Configuration Guide

## Current Environment Status

### Development Environment (✅ Configured)
**File**: `src/environments/environment.development.ts`

This file is already configured with your Firebase credentials and is used when running:
- `ng serve` (development server)
- `ng build --configuration development`

**Configuration**:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBcNrK7r-VAk_qWJ31vQMEUpdl2fx96WXs",
    authDomain: "stjo-farm.firebaseapp.com",
    projectId: "stjo-farm",
    storageBucket: "stjo-farm.firebasestorage.app",
    messagingSenderId: "214332715937",
    appId: "1:214332715937:web:36e354ef6bcbb8f7c351e0",
    measurementId: "G-5SJNE96VYY"
  },
  adminEmail: "stephen.cantoria@stjo.farm"
};
```

### Production Environment (⚠️ Needs Update)
**File**: `src/environments/environment.ts`

This file has placeholder values and **must be updated before production deployment**.

**Current (Placeholder)**:
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "stjo-farm.firebaseapp.com",
    projectId: "stjo-farm",
    storageBucket: "stjo-farm.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  adminEmail: "stephen.cantoria@stjo.farm"
};
```

## Options for Production Environment

### Option 1: Use Same Firebase Project (Recommended for Small Projects)

If you want to use the same Firebase project for both development and production:

**Update `src/environments/environment.ts`**:
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyBcNrK7r-VAk_qWJ31vQMEUpdl2fx96WXs",
    authDomain: "stjo-farm.firebaseapp.com",
    projectId: "stjo-farm",
    storageBucket: "stjo-farm.firebasestorage.app",
    messagingSenderId: "214332715937",
    appId: "1:214332715937:web:36e354ef6bcbb8f7c351e0",
    measurementId: "G-5SJNE96VYY"
  },
  adminEmail: "stephen.cantoria@stjo.farm"
};
```

### Option 2: Create Separate Firebase Project (Recommended for Larger Projects)

For better separation of development and production data:

1. **Create a new Firebase project** for production:
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "stjo-farm-production" (or similar)
   - Follow the setup wizard

2. **Get production Firebase config**:
   - In the new project, go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click the web app icon (</>)
   - Copy the config values

3. **Update `src/environments/environment.ts`** with the new production config

## Security Considerations

### ✅ What's Safe to Commit
- `src/environments/environment.ts` with placeholder values
- Configuration structure and setup instructions

### ❌ What Should NOT Be Committed
- `src/environments/environment.ts` with real Firebase credentials
- `src/environments/environment.development.ts` with real Firebase credentials
- `.env` files in functions directory
- Any file containing passwords or secret keys

### Current Protection
Your `.gitignore` is configured to exclude:
```
src/environments/environment.ts
src/environments/environment.development.ts
```

**Important**: Since these files already exist in your repository, they may have been committed before the `.gitignore` update. If you plan to make this a public repository, you should:

1. Remove these files from Git history:
```bash
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.development.ts
git commit -m "Remove environment files from git"
```

2. Then add them to `.gitignore` (already done)

3. Keep local copies for development

## Testing Environment Configuration

### Development Build
```bash
ng serve
# Or
ng build --configuration development
```

### Production Build
```bash
ng build --configuration production
```

### Verify Configuration
After updating the production environment file, run:
```bash
ng build --configuration production
```

If successful, you should see:
```
Application bundle generation complete.
Output location: /Users/stephencantoria/Development/stjo-farm/dist/stjo-farm
```

## Firebase Configuration Summary

| Setting | Value |
|---------|-------|
| **Project ID** | stjo-farm |
| **Auth Domain** | stjo-farm.firebaseapp.com |
| **Storage Bucket** | stjo-farm.firebasestorage.app |
| **Admin Email** | stephen.cantoria@stjo.farm |

## Next Steps

1. ✅ Development environment is ready
2. ⚠️ Update production environment file when ready to deploy
3. ✅ Security rules are configured
4. ⚠️ Create admin user in Firebase Authentication
5. ⚠️ Configure email credentials for Functions
6. ⚠️ Deploy to Firebase when ready

See `DEPLOYMENT_CHECKLIST.md` for complete deployment instructions.
