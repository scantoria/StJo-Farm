# StJo Farm Website

A modern, full-featured farm website built with Angular and Firebase for managing livestock sales, farm information, and customer communications.

## 🌾 Features

- **Public Website**
  - Home page with farm overview
  - About page with farm story and values
  - Animals showcase page
  - For Sale listings with filtering
  - Calf Adoption program
  - Contact form with image attachments

- **Admin Dashboard**
  - Secure admin authentication
  - Create, edit, and delete listings
  - Upload multiple images per listing
  - View and manage contact messages
  - Review calf adoption requests
  - Email notifications for all submissions

- **Technical Features**
  - Responsive design (mobile-friendly)
  - Real-time database (Firestore)
  - Cloud storage for images
  - Serverless functions for email
  - Security rules for data protection
  - Custom domain support (stjo.farm)

## 🚀 Technology Stack

- **Frontend**: Angular 17+, Angular Material
- **Backend**: Firebase (Firestore, Authentication, Storage, Functions, Hosting)
- **Styling**: SCSS with custom color scheme
- **Email**: Nodemailer via Firebase Functions

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project (already created: stjo-farm)

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
   git clone https://github.com/scantoria/StJo-Farm.git
   cd StJo-Farm
```

2. **Install dependencies**
```bash
   npm install
   cd functions && npm install && cd ..
```

3. **Configure Firebase**
   - Update `src/environments/environment.ts` with your Firebase config
   - Update `src/environments/environment.development.ts` for development
   - See `BUILD_AND_DEPLOY.md` for detailed instructions

4. **Set up email** (optional)
```bash
   firebase functions:config:set email.user="stephen.cantoria@stjo.farm"
   firebase functions:config:set email.password="your-app-password"
```
   See `EMAIL_SETUP.md` for details

5. **Create admin user**
   - Follow instructions in `CREATE_ADMIN_USER.md`

## 🏃 Running Locally
```bash
# Development server
ng serve

# Visit http://localhost:4200

# With Firebase emulators (optional)
firebase emulators:start
```

## 🏗️ Building & Deploying
```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Deploy only specific services
firebase deploy --only hosting
firebase deploy --only functions
```

See `BUILD_AND_DEPLOY.md` for complete deployment guide.

## 📖 Documentation

- **[BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md)** - Complete build and deployment guide
- **[CREATE_ADMIN_USER.md](CREATE_ADMIN_USER.md)** - Admin user setup
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Email configuration
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** - Environment configuration

## 🎨 Customization

### Colors
The website uses a custom color scheme defined in `src/styles.scss`:
- Orange (#FF8C00) - Primary
- Blue (#4A90E2) - Secondary
- White (#FFFFFF)
- Badass Green (#BADA55) - Accent

### Adding Photos
Place your farm photos in `src/assets/` and update component flags to display them.

### Content Updates
Edit component HTML/TypeScript files in `src/app/pages/` to update content.

## 🔒 Security

- Admin access restricted to configured email
- Firestore security rules protect data
- Storage rules limit uploads to images only
- Firebase Authentication for admin panel
- Environment files excluded from Git

## 📊 Project Structure
```
stjo-farm/
├── src/app/
│   ├── core/           # Services, models, guards
│   ├── pages/          # Page components
│   ├── shared/         # Shared components
│   └── app.component.ts
├── functions/          # Firebase Functions
├── firestore.rules     # Database security
├── storage.rules       # Storage security
└── firebase.json       # Firebase config
```

## 🐛 Troubleshooting

Common issues and solutions can be found in:
- `BUILD_AND_DEPLOY.md` - Deployment issues
- `QUICK_REFERENCE.md` - Quick fixes
- Firebase Console logs

## 📞 Support

- **Firebase Console**: https://console.firebase.google.com/project/stjo-farm
- **Documentation**: See docs in project root
- **Issues**: GitHub Issues (if public repo)

## 📝 License

Private project for StJo Farm

## 👨‍💻 Developer

Developed by Stephen Cantoria for StJo Farm

---

**Live Site**: https://stjo.farm

**Admin Panel**: https://stjo.farm/admin/login
