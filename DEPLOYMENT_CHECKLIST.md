# StJo Farm Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Configuration
- [ ] Updated `src/environments/environment.ts` with production Firebase config
- [ ] Updated `src/environments/environment.development.ts` with development config
- [ ] Verified `adminEmail` is set correctly in both environment files
- [ ] Added environment files to `.gitignore`

### 2. Email Configuration
- [ ] Created Gmail App Password (or configured alternative email service)
- [ ] Created `.env` file in `functions` directory with email credentials
- [ ] For production: Prepared to set EMAIL_USER and EMAIL_PASSWORD during deployment

### 3. Admin User
- [ ] Created admin user in Firebase Authentication
- [ ] Email: `stephen.cantoria@stjo.farm`
- [ ] Tested login at `/admin/login`

### 4. Security Rules
- [ ] Reviewed `firestore.rules`
- [ ] Reviewed `storage.rules`
- [ ] Verified admin email in rules matches your email

### 5. Content Preparation
- [ ] Added farm photos to `src/assets/` folder
- [ ] Created placeholder images if needed
- [ ] Updated any hardcoded content/text
- [ ] Reviewed all pages for accuracy

## Build & Deploy

### 1. Test Locally
```bash
# Build the app
ng build --configuration production

# Test the build locally
firebase serve

# Test Firebase emulators (optional)
firebase emulators:start
```

### 2. Deploy to Firebase
```bash
# Deploy everything
firebase deploy

# Or deploy individually:
firebase deploy --only hosting        # Deploy website
firebase deploy --only functions      # Deploy cloud functions
firebase deploy --only firestore      # Deploy Firestore rules
firebase deploy --only storage        # Deploy Storage rules
```

### 3. Configure Custom Domain
```bash
# Add custom domain in Firebase Console
# Follow instructions at:
# https://console.firebase.google.com/project/stjo-farm/hosting/sites
```

- [ ] Verify DNS records for stjo.farm
- [ ] Wait for SSL certificate provisioning (can take 24 hours)
- [ ] Test custom domain access

## Post-Deployment

### 1. Verify Functionality
- [ ] Visit https://stjo.farm (or your Firebase URL)
- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Test calf adoption form submission
- [ ] Login to admin panel
- [ ] Create a test listing
- [ ] Upload test images
- [ ] Verify email notifications are working

### 2. Performance & SEO
- [ ] Run Google PageSpeed Insights
- [ ] Check mobile responsiveness
- [ ] Verify meta tags and descriptions
- [ ] Test on different browsers
- [ ] Add Google Analytics (optional)

### 3. Monitoring
- [ ] Enable Firebase Analytics
- [ ] Monitor Firebase Console for errors
- [ ] Check Functions logs: `firebase functions:log`
- [ ] Set up uptime monitoring (optional)

### 4. Backup Plan
- [ ] Document how to rollback deployment
- [ ] Save Firebase config files
- [ ] Export Firestore data (optional)
- [ ] Keep a local backup of images

## Ongoing Maintenance

### Regular Tasks
- [ ] Check admin dashboard weekly for new messages
- [ ] Review and respond to contact/adoption requests
- [ ] Update listings as needed
- [ ] Monitor Firebase usage and costs
- [ ] Keep dependencies updated: `npm update`

### Monthly Tasks
- [ ] Review Firebase Analytics
- [ ] Check for Angular/Firebase updates
- [ ] Backup important data
- [ ] Review security rules

## Troubleshooting Common Issues

**Issue: Can't access admin panel**
- Solution: Verify admin email in Auth and security rules match exactly

**Issue: Images not uploading**
- Solution: Check Storage rules, verify file size limits

**Issue: Forms not submitting**
- Solution: Check browser console, verify Firebase Functions are deployed

**Issue: Email not sending**
- Solution: Check Functions logs, verify email config is set

**Issue: "Permission denied" errors**
- Solution: Review and redeploy Firestore/Storage rules

## Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- Angular Documentation: https://angular.io/docs
- Stack Overflow: Tag questions with 'firebase' and 'angular'
- Firebase Console: https://console.firebase.google.com/project/stjo-farm

## Emergency Rollback

If something goes wrong:
```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version (if needed)
# Go to Firebase Console > Hosting > View history
# Click "Rollback" on a previous deployment
```

---

**IMPORTANT**: Never commit sensitive data (API keys, passwords, email credentials) to Git!
