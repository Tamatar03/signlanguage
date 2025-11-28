# 🤟 SignLearn - Interactive Sign Language Learning Platform

A modern, accessible web-based learning platform designed for deaf and hard-of-hearing students to learn Sign Language through interactive modules, webcam practice, and AI-powered gesture recognition.

**💰 100% FREE - No cloud costs, runs entirely in your browser!**

## ✨ Features

### For Students
- **📚 Modular Lessons**: Learn alphabets, numbers, common words, idioms, and phrases
- **🎥 Rich Media Support**: Images, videos, and 3D hand models
- **🤖 AI-Powered Practice**: Real-time hand gesture recognition using MediaPipe and TensorFlow.js
- **📊 Progress Tracking**: Detailed analytics, quiz scores, and learning journey visualization
- **🎯 Interactive Quizzes**: MCQs, identify-the-sign questions, and webcam-based gesture checks
- **🔒 Privacy First**: All processing happens locally on your device (no data sent to servers)
- **♿ Accessible Design**: WCAG-compliant with screen reader support and keyboard navigation

### For Teachers/Admins
- **📝 Content Management**: Create and manage lessons, modules, and learning materials
- **👥 Student Analytics**: View performance and progress (local data)
- **📊 Platform Insights**: Dashboard with learning analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage (no cloud needed!)
- **Authentication**: Local bcrypt password hashing
- **AI/ML**: TensorFlow.js, MediaPipe Hands (client-side)
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- **That's it!** No Firebase, no cloud services needed!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

**No environment variables needed! No configuration required!**

## 🎓 Sample Data Included

The platform comes pre-loaded with sample modules:

- **ASL Alphabet Basics** - Letters A, B, C with instructions
- **Numbers 1-10** - Numbers 1, 2, 3 with step-by-step guides
- **Common Greetings** - Hello, Thank You with practice tips

## 👤 Getting Started

1. Visit `http://localhost:3000`
2. Click **Sign Up**
3. Create account (choose Student or Teacher role)
4. Start learning immediately!

### Making a User Admin/Teacher

After signup, to change a user's role:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find the `users` key
4. Edit the JSON to change `"role": "student"` to `"role": "teacher"` or `"role": "admin"`
5. Refresh the page

## 📚 Key Pages & Routes

- `/` - Landing page with platform overview
- `/signup` - Create new account (local storage)
- `/login` - Sign in to existing account
- `/dashboard` - Student progress dashboard with charts
- `/modules` - Browse all learning modules
- `/modules/[id]` - View lessons within a specific module
- `/lessons/[id]` - Interactive lesson with webcam practice
- `/quiz/[id]` - Take module quiz with gesture recognition
- `/admin` - Teacher/admin content creation panel
- `/admin/analytics` - Platform-wide analytics
- `/profile` - User profile and quiz history

## 🎯 Core Components

### HandGestureDetector
Real-time hand tracking using MediaPipe:
- Client-side processing (100% private)
- Confidence scoring (0-100%)
- Visual feedback overlay on webcam
- Landmark comparison for sign validation

### Quiz System
- Multiple choice questions
- Identify-the-sign visual challenges
- Live webcam gesture verification
- Auto-scoring and instant feedback
- Progress saved to localStorage

### Progress Tracking
- Per-lesson completion status
- Quiz scores and detailed history
- Learning analytics with interactive charts
- Daily streak tracking

## 🔒 Security & Privacy

- ✅ All hand detection runs in your browser (no uploads)
- ✅ Passwords hashed with bcrypt
- ✅ Data stored locally (localStorage only)
- ✅ No external API calls (except MediaPipe CDN)
- ✅ HTTPS required for camera access in production

## 💾 Data Storage

All data is stored in browser localStorage:
- `users` - User accounts and profiles
- `modules` - Learning modules
- `lessons` - Lesson content and instructions
- `progress` - User progress per lesson
- `quizResults` - Quiz attempt history
- `quizzes` - Quiz questions and answers

**⚠️ Note**: Clearing browser data will reset everything. Export/import features coming soon!

## 🚀 Deployment

### Deploy to Vercel (Free)

```bash
npm i -g vercel
vercel --prod
```

**No environment variables needed!**

### Deploy to Netlify (Free)

```bash
npm run build
# Upload 'out' folder to Netlify
```

### Deploy Anywhere

Since there's no backend required, you can deploy to any static hosting:
- GitHub Pages
- Cloudflare Pages  
- AWS S3 + CloudFront
- Any web server

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-color',
        // ... more shades
      },
    },
  },
}
```

### Add Module Categories

Edit `src/lib/db.ts` to add new categories to the `Module` interface.

### Customize Sample Data

Edit the `initializeDatabase()` function in `src/lib/db.ts`.

## 📤 Adding Your Own Content

Teachers can create lessons by:
1. Logging in with a teacher/admin account
2. Going to `/admin`
3. Clicking "Create Module" or "Create Lesson"
4. For media (images/videos):
   - Use external URLs (imgur, YouTube, etc.)
   - Or use data URLs for small files
   - Or deploy with static files in `/public`

## 💡 Limitations (Free Version)

- Data stored locally only (no cross-device sync)
- No real-time collaboration
- Browser storage limits (~5-10MB typically)
- Media must be externally hosted or embedded

## 🔄 Migrating to Firebase (Optional)

If you later want cloud sync:
1. Install Firebase: `npm install firebase`
2. Create `src/lib/firebase.ts` with Firebase config
3. Replace `src/lib/db.ts` functions with Firestore calls
4. Update `AuthContext` to use Firebase Auth
5. Add environment variables

See `README.LOCAL.md` for migration guide.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for educational purposes!

## 🙏 Acknowledgments

- **MediaPipe** - Google's hand tracking ML model
- **TensorFlow.js** - In-browser machine learning
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first styling

## 📧 Support

- Open an issue on GitHub
- Check existing issues for solutions
- Star the repo if you find it useful!

## 🗺️ Roadmap

- [ ] Export/import data functionality
- [ ] PWA support for offline use
- [ ] More sample modules and lessons
- [ ] Video recording for practice review
- [ ] Multi-language sign language support (BSL, ISL)
- [ ] Gamification and achievement badges
- [ ] Community-contributed lesson library

---

**Built with ❤️ for the deaf and hard-of-hearing community**

**💰 Cost: $0/month forever - No credit card, no cloud services, no limits!**