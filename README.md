# 🤟 SignLearn - Interactive Sign Language Learning Platform

A modern, accessible web-based learning platform designed for deaf and hard-of-hearing students to learn Sign Language through interactive modules, webcam practice, and AI-powered gesture recognition.

## ✨ Features

### For Students
- **📚 Modular Lessons**: Learn alphabets, numbers, common words, idioms, and phrases
- **🎥 Rich Media**: Static images, looping videos, and optional 360° rotatable 3D hand models
- **🤖 AI-Powered Practice**: Real-time hand gesture recognition using MediaPipe and TensorFlow.js
- **📊 Progress Tracking**: Detailed analytics, quiz scores, and learning journey visualization
- **🎯 Interactive Quizzes**: MCQs, identify-the-sign questions, and webcam-based gesture checks
- **🔒 Privacy First**: All camera processing happens locally on your device
- **♿ Accessible Design**: WCAG-compliant with screen reader support and keyboard navigation

### For Teachers/Admins
- **📝 Content Management**: Upload and manage lessons, modules, and learning materials
- **👥 Student Analytics**: View student performance, progress, and quiz results
- **📊 Platform Insights**: Dashboard with comprehensive learning analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend & Auth**: Firebase (Authentication, Firestore, Storage)
- **AI/ML**: TensorFlow.js, MediaPipe Hands
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Firebase project with Authentication, Firestore, and Storage enabled

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage

### 3. Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Key Pages & Features

- `/` - Landing page with features overview
- `/signup` - User registration (student/teacher)
- `/login` - User authentication
- `/dashboard` - Student progress dashboard with charts
- `/modules` - Browse learning modules by category
- `/modules/[id]` - View lessons within a module
- `/lessons/[id]` - Interactive lesson with webcam practice
- `/quiz/[id]` - Module quiz with gesture recognition
- `/admin` - Teacher/admin content management
- `/admin/analytics` - Platform analytics and insights
- `/profile` - User profile and learning history

## 🎯 Core Components

### HandGestureDetector
Real-time hand tracking using MediaPipe:
- Client-side processing for privacy
- Confidence scoring (0-100%)
- Visual feedback with overlay
- Landmark comparison for validation

### Quiz System
- Multiple choice questions
- Identify-the-sign challenges
- Webcam gesture verification
- Auto-scoring and progress saving

### Progress Tracking
- Per-lesson completion tracking
- Quiz scores and history
- Learning analytics with charts
- Streak tracking

## 🔒 Security & Privacy

- All hand detection happens locally (no video upload)
- Firebase Authentication for secure login
- Firestore security rules protect user data
- HTTPS required for camera access in production

## 👤 First-Time Setup

1. Create your first account at `/signup`
2. To make a user admin/teacher:
   - Go to Firebase Console → Firestore
   - Edit user document, set `role` to `"teacher"` or `"admin"`
3. Login and access `/admin` to create modules and lessons

## 🚀 Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

## 📊 Database Collections

- `users` - User profiles (uid, email, displayName, role)
- `modules` - Learning modules (title, category, difficulty)
- `lessons` - Individual lessons (moduleId, sign, media URLs)
- `progress` - User progress tracking
- `quizResults` - Quiz attempt history
- `quizzes` - Quiz questions and answers

## 🎨 Customization

Edit `tailwind.config.js` to change theme colors.
Modify categories in `src/lib/firestore.ts`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

## 📝 License

MIT License

---

**Built with ❤️ for the deaf and hard-of-hearing community**