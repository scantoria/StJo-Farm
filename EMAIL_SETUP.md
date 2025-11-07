# Email Configuration for Firebase Functions

## Setting Up Email Notifications

The Firebase Functions are configured to send email notifications for:
1. Contact form submissions
2. Calf adoption requests
3. New listing notifications (optional)

### Option 1: Gmail (Recommended for Development)

1. **Create an App Password** (if using Gmail):
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. **Configure Firebase Functions** (using .env file for local development):

Create a `.env` file in the `functions` directory:
```bash
cd functions
cat > .env << 'EOF'
EMAIL_USER=stephen.cantoria@stjo.farm
EMAIL_PASSWORD=your-16-char-app-password
EOF
```

3. **For Production Deployment**:
When deploying to Firebase, you'll be prompted to set these values, or you can set them using:
```bash
firebase deploy --only functions
# You'll be prompted to enter EMAIL_USER and EMAIL_PASSWORD during deployment
```

### Option 2: Other Email Services

You can use other services like SendGrid, Mailgun, or AWS SES:

1. Update `functions/src/index.ts` with your service configuration
2. Install necessary packages (e.g., `@sendgrid/mail`)
3. Update the transporter configuration

### Testing Email Functions Locally

1. **Start Firebase Emulators**:
```bash
   cd functions
   npm run serve
```

2. **Test from your app** by submitting forms while emulators are running

### Deploying Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendContactEmail
```

### Troubleshooting

**Error: "Invalid login"**
- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled on your Google Account

**Error: "Less secure app access"**
- Gmail requires App Passwords (see Option 1 above)
- Do NOT enable "Less secure app access" - use App Passwords instead

**Emails not sending**
- Check Firebase Functions logs: `firebase functions:log`
- Verify email configuration is set in `.env` file (local) or deployment params (production)
- Make sure functions are deployed: `firebase deploy --only functions`
- Test locally first with emulators: `cd functions && npm run serve`

### Important Notes

- **Never commit email credentials to Git**
- App passwords are stored in Firebase Functions config (secure)
- Test thoroughly in development before deploying to production
- Consider setting up a dedicated email for notifications (e.g., noreply@stjo.farm)

### Alternative: Disable Email Notifications

If you don't want email notifications initially:

1. The app will still save data to Firestore
2. You can view all submissions in the Admin Dashboard
3. Email functions will fail silently without breaking the app
