# StJo Farm - Complete Build and Deploy Guide

## 🎯 Quick Start (For First Time Deployment)

### Step 1: Update Environment Files with Your Firebase Config

1. Go to Firebase Console: https://console.firebase.google.com/project/stjo-farm/settings/general
2. Scroll down to "Your apps" and click on the Web app icon
3. Copy your Firebase configuration
4. Update both environment files:
```bash
# Edit production environment
nano src/environments/environment.ts

# Edit development environment
nano src/environments/environment.development.ts
```

Replace the placeholder values with your actual Firebase config:
```typescript
export const environment = {
  production: true, // or false for development
  firebase: {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "stjo-farm.firebaseapp.com",
    projectId: "stjo-farm",
    storageBucket: "stjo-farm.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
  },
  adminEmail: "stephen.cantoria@stjo.farm"
};
```

### Step 2: Install Dependencies
```bash
# Install Angular dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### Step 3: Create Admin User

Follow the guide in `CREATE_ADMIN_USER.md`:

1. Go to Firebase Console > Authentication
2. Enable Email/Password sign-in method
3. Add user: `stephen.cantoria@stjo.farm` with a strong password
4. Save your credentials securely

### Step 4: Configure Email (Optional but Recommended)
```bash
# Set up email for notifications
firebase functions:config:set email.user="stephen.cantoria@stjo.farm"
firebase functions:config:set email.password="your-gmail-app-password"

# Verify configuration
firebase functions:config:get
```

**Note**: See `EMAIL_SETUP.md` for detailed instructions on creating a Gmail App Password.

### Step 5: Build the Application
```bash
# Build for production
npm run build

# This creates optimized files in dist/stjo-farm/browser/
```

### Step 6: Deploy to Firebase
```bash
# Deploy everything (first time)
firebase deploy

# This deploys:
# ✓ Firestore Rules
# ✓ Storage Rules
# ✓ Firebase Functions
# ✓ Hosting (your website)
```

### Step 7: Set Up Custom Domain (stjo.farm)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter: `stjo.farm`
4. Follow the DNS configuration instructions
5. Add the provided DNS records to your domain registrar
6. Wait for SSL certificate (can take up to 24 hours)

### Step 8: Test Your Deployment

1. Visit your site: `https://stjo-farm.web.app` (or your custom domain)
2. Test all pages: Home, About, Animals, For Sale, Contact, Calf Adoption
3. Login to admin: `https://yourdomain.com/admin/login`
4. Create a test listing
5. Submit a test contact form
6. Verify you receive email notifications

---

## 🔄 Regular Updates (After Initial Deployment)

### Quick Deploy (Code Changes Only)
```bash
# Make your code changes
# Then build and deploy hosting only
npm run build
firebase deploy --only hosting
```

### Deploy Functions Only
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### Deploy Rules Only
```bash
firebase deploy --only firestore:rules,storage
```

---

## 📁 Project Structure Overview
```
stjo-farm/
├── src/
│   ├── app/
│   │   ├── core/              # Services, models, guards
│   │   ├── pages/             # All page components
│   │   ├── shared/            # Shared components, modules
│   │   └── app.component.ts   # Root component
│   ├── environments/          # Firebase config (DO NOT COMMIT)
│   └── styles.scss            # Global styles
├── functions/
│   └── src/
│       └── index.ts           # Firebase Functions (email)
├── firestore.rules            # Database security rules
├── storage.rules              # Storage security rules
├── firebase.json              # Firebase configuration
└── angular.json               # Angular configuration
```

---

## 🛠️ Common Commands

### Development
```bash
# Serve locally with hot reload
ng serve

# Open in browser at http://localhost:4200
```

### Testing Firebase Functions Locally
```bash
# Start Firebase emulators
firebase emulators:start

# Your app can now connect to local Firebase services
```

### Building
```bash
# Development build
ng build

# Production build (optimized)
ng build --configuration production
```

### Deployment
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Maintenance
```bash
# View Firebase Functions logs
firebase functions:log

# View recent deployments
firebase hosting:channel:list

# Check Firebase project info
firebase projects:list
```

---

## 🎨 Adding Your Farm Photos

1. Add images to `src/assets/` folder:
```
   src/assets/
   ├── logo.png              # Farm logo
   ├── hero-background.jpg   # Homepage hero
   ├── farm-preview.jpg      # About page
   ├── about-farm.jpg        # About page
   ├── dairy-cows.jpg        # Animals page
   ├── calves.jpg            # Animals page
   ├── goats.jpg             # Animals page
   ├── horses.jpg            # Animals page
   ├── chickens.jpg          # Animals page
   └── placeholder.png       # Fallback image
```

2. Update component flags to show images:
```typescript
   // In each component
   farmImageExists = true;
   dairyCowsImageExists = true;
   // etc.
```

3. Rebuild and redeploy:
```bash
   npm run build
   firebase deploy --only hosting
```

---

## 📊 Managing Your Farm

### Adding Listings

1. Login to admin: `https://yourdomain.com/admin/login`
2. Click "Add New Listing"
3. Fill in details:
   - Title (e.g., "2-Year-Old Holstein Heifer")
   - Category (Dairy Cow, Heifer, Steer, Goat, Horse, Eggs, Other)
   - Description (detailed information)
   - Price
   - Upload multiple photos
4. Toggle "Available for Sale"
5. Click "Create Listing"

### Managing Listings

- **Edit**: Click edit icon on any listing card
- **Delete**: Click delete icon (confirmation required)
- **Mark as Sold**: Edit listing and toggle "Available for Sale" off

### Viewing Messages

1. Go to Admin Dashboard
2. Click "Contact Messages" tab
3. View all contact form submissions
4. Click "Reply" to respond via email
5. Mark as read to organize

### Managing Calf Adoption Requests

1. Go to Admin Dashboard
2. Click "Adoption Requests" tab
3. Review request details and photos
4. Update status: Reviewed / Accepted / Declined
5. Click "Reply" to contact the requester

---

## 🔒 Security Best Practices

### DO:
- ✅ Keep Firebase config files out of Git
- ✅ Use strong passwords for admin account
- ✅ Enable 2FA in Firebase Console
- ✅ Regularly review Firebase security rules
- ✅ Monitor Firebase Console for unusual activity
- ✅ Keep dependencies updated

### DON'T:
- ❌ Commit API keys or passwords to Git
- ❌ Share admin credentials
- ❌ Disable security rules
- ❌ Ignore Firebase security warnings
- ❌ Use weak passwords

---

## 💰 Firebase Pricing & Limits

### Free Tier (Spark Plan) Includes:
- 10 GB storage
- 1 GB/day downloads
- 50,000 document reads/day
- 20,000 document writes/day
- Hosting: 10 GB/month transfer
- Functions: 125K invocations/month

**Your farm website will likely stay within free tier limits!**

### Monitoring Usage

1. Go to Firebase Console > Usage and billing
2. Set up budget alerts (recommended)
3. Monitor daily usage

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Cannot find module '@angular/fire'"**
```bash
npm install firebase @angular/fire
```

### Deployment Errors

**Error: "Permission denied"**
```bash
# Make sure you're logged in
firebase login

# Select correct project
firebase use stjo-farm
```

**Error: "Functions deploy failed"**
```bash
# Check functions code for errors
cd functions
npm run build
```

### Runtime Errors

**Error: "Firebase: Error (auth/invalid-email)"**
- Check that admin email matches exactly in security rules

**Error: "Missing or insufficient permissions"**
- Redeploy Firestore rules: `firebase deploy --only firestore:rules`

**Images not loading**
- Check Storage rules: `firebase deploy --only storage`
- Verify image paths in code

**Email not sending**
- Check Functions logs: `firebase functions:log`
- Verify email config: `firebase functions:config:get`

---

## 📞 Getting Help

### Resources:
- **Firebase Console**: https://console.firebase.google.com/project/stjo-farm
- **Firebase Docs**: https://firebase.google.com/docs
- **Angular Docs**: https://angular.io/docs
- **Stack Overflow**: Tag questions with 'firebase' and 'angular'

### Local Documentation:
- `CREATE_ADMIN_USER.md` - Admin setup
- `EMAIL_SETUP.md` - Email configuration
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide

---

## 🎉 Success Checklist

After completing deployment, you should have:

- ✅ Website live at stjo.farm (or Firebase URL)
- ✅ Admin panel accessible
- ✅ Contact form working
- ✅ Calf adoption form working
- ✅ Email notifications working
- ✅ Listing management working
- ✅ Image uploads working
- ✅ Mobile responsive design
- ✅ SSL certificate (HTTPS)
- ✅ All pages functional

---

## 🚀 You're All Set!

Your StJo Farm website is now live! Here's what you can do:

1. **Add your first listings** - Login to admin and create listings
2. **Upload farm photos** - Replace placeholders with real photos
3. **Share your website** - Tell customers about stjo.farm
4. **Monitor inquiries** - Check admin dashboard regularly
5. **Update content** - Keep listings current

**Welcome to your new farm website! 🌾🐄🐴🐐🐓**

---

*Need help? Review the documentation files or check Firebase Console for errors.*
