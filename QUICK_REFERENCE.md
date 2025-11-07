# StJo Farm - Quick Reference Card

## 🔗 Important URLs

- **Website**: https://stjo.farm (or https://stjo-farm.web.app)
- **Admin Login**: https://stjo.farm/admin/login
- **Firebase Console**: https://console.firebase.google.com/project/stjo-farm
- **GitHub Repo**: https://github.com/scantoria/StJo-Farm

## ⚡ Most Common Commands
```bash
# Local development
ng serve                                    # Start dev server
firebase emulators:start                    # Test with Firebase locally

# Build
npm run build                              # Build for production

# Deploy
firebase deploy                            # Deploy everything
firebase deploy --only hosting             # Deploy website only
firebase deploy --only functions           # Deploy functions only

# Monitoring
firebase functions:log                     # View function logs
firebase hosting:channel:list              # View deployments
```

## 👤 Admin Access

- **Email**: stephen.cantoria@stjo.farm
- **Login URL**: /admin/login
- **Dashboard**: /admin/dashboard

## 📧 Email Setup
```bash
firebase functions:config:set email.user="stephen.cantoria@stjo.farm"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:get
```

## 📁 Key Files

- `src/environments/` - Firebase config (DON'T COMMIT)
- `firestore.rules` - Database security
- `storage.rules` - Storage security
- `functions/src/index.ts` - Email functions
- `firebase.json` - Firebase configuration

## 🎨 Adding Content

1. **Add Listings**: Admin Dashboard > Add New Listing
2. **Add Photos**: Upload through admin panel
3. **Check Messages**: Admin Dashboard > Contact Messages / Adoption Requests

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check admin email matches security rules |
| Images not uploading | Check Storage rules, file size limits |
| Email not sending | Check Functions logs, email config |
| Build errors | `rm -rf node_modules && npm install` |
| Deploy errors | `firebase login` then `firebase use stjo-farm` |

## 📊 Firebase Limits (Free Tier)

- Storage: 10 GB
- Reads: 50,000/day
- Writes: 20,000/day
- Functions: 125,000 invocations/month

## 🆘 Emergency Contacts

- Firebase Support: https://firebase.google.com/support
- Check documentation files for detailed help
- Review Firebase Console for error details

---

**Keep this handy for quick reference! 📌**
