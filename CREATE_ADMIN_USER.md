# Creating Admin User for StJo Farm

## Method 1: Firebase Console (Recommended)

1. **Go to Firebase Console**:
   - Visit https://console.firebase.google.com
   - Select your `stjo-farm` project

2. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Get Started" if you haven't enabled it yet

3. **Enable Email/Password Authentication**:
   - Go to "Sign-in method" tab
   - Click on "Email/Password"
   - Enable it and save

4. **Create Admin User**:
   - Go to "Users" tab
   - Click "Add user"
   - Email: `stephen.cantoria@stjo.farm`
   - Password: Choose a strong password
   - Click "Add user"

5. **Note your credentials** - you'll need these to log into the admin panel

## Method 2: Using Firebase CLI
```bash
# Install Firebase tools if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Use Firebase Auth REST API to create user
# (You'll need to enable Email/Password auth first in console)
```

## Method 3: First-Time Setup via Code (One-time use)

You can create a temporary signup page, use it once to create your admin account, then remove it:

1. Create a temporary component with signup form
2. Use it to create your admin account
3. Delete the component
4. Deploy the app without signup functionality

## Security Notes

- **IMPORTANT**: Only use `stephen.cantoria@stjo.farm` as admin email
- The security rules are configured to only allow this email as admin
- To add more admins, update the `isAdmin()` function in `firestore.rules` and `storage.rules`
- Never commit passwords to Git
- Use strong, unique passwords
- Enable 2FA in Firebase Console for extra security

## Testing Admin Access

1. Build and serve your app locally:
```bash
   ng serve
```

2. Navigate to `http://localhost:4200/admin/login`

3. Login with your admin credentials

4. You should see the admin dashboard with all management features

## Adding Additional Admins (Optional)

If you want to add more admin emails, update the security rules:

### In firestore.rules and storage.rules:
```javascript
function isAdmin() {
  return isSignedIn() && (
    request.auth.token.email == 'stephen.cantoria@stjo.farm' ||
    request.auth.token.email == 'another-admin@stjo.farm'
  );
}
```

Then redeploy:
```bash
firebase deploy --only firestore:rules,storage
```

## Troubleshooting

**Can't create user in console:**
- Make sure Email/Password authentication is enabled
- Check that you're in the correct Firebase project

**Can't login to admin panel:**
- Verify the email exactly matches what's in the security rules
- Check browser console for errors
- Make sure Firebase Auth is properly initialized in your app

**Security rules denying access:**
- Confirm your email matches exactly (case-sensitive)
- Redeploy rules: `firebase deploy --only firestore:rules,storage`
- Check Firebase Console > Firestore > Rules tab for any errors
