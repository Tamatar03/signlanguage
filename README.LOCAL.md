# 🤟 SignLearn - Free Local Version

This version uses **local storage** instead of Firebase - completely free with no setup required!

## ✨ What's Different

- ✅ No Firebase configuration needed
- ✅ No cloud costs
- ✅ All data stored locally in your browser
- ✅ Works offline after first load
- ✅ No environment variables required

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 How It Works

- **Authentication**: Local password hashing with bcrypt
- **Database**: Browser localStorage with sample data included
- **Media**: Uses placeholder images/videos (you can add your own)
- **Hand Detection**: Still uses MediaPipe (client-side only)

## 👤 Getting Started

1. Go to `/signup` and create an account
2. Choose **Student** or **Teacher** role
3. Start learning immediately with preloaded sample modules!

### Sample Modules Included

- ASL Alphabet Basics (Letters A, B, C)
- Numbers 1-10 (Numbers 1, 2, 3)
- Common Greetings (Hello, Thank You)

## 🎯 Features Available

✅ Full authentication (local)
✅ Browse modules and lessons
✅ Webcam practice with AI feedback
✅ Take quizzes
✅ Track progress
✅ View analytics
✅ Teacher/admin can create content

## ⚠️ Limitations

- Data stored in browser only (clears if you clear browser data)
- No cross-device sync
- Media files must be hosted externally or use data URLs
- No real-time collaboration

## 📤 Adding Your Own Media

Teachers can upload content by providing URLs to:
- Images (use imgur.com, cloudinary.com, or similar)
- Videos (use YouTube embed or self-hosted)
- Or use base64 data URLs for small files

## 🔄 Migrating to Firebase Later

If you want to upgrade to Firebase later:
1. Install Firebase: `npm install firebase`
2. Restore the original `src/lib/firebase.ts` and `src/lib/firestore.ts`
3. Update `AuthContext` to use Firebase
4. Add Firebase config to `.env.local`

## 🎨 Customization

All the same customization options apply - edit colors, add categories, modify UI.

## 📱 Deployment

Deploy to Vercel (free tier):

```bash
vercel --prod
```

No environment variables needed!

## 🤝 Perfect For

- Learning/testing the platform
- Demo/prototype purposes
- Schools with limited budgets
- Offline workshop environments
- Development without cloud dependencies

---

**Built with ❤️ - Now completely free and local!**
