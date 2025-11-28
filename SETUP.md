# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

---

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

If you encounter TensorFlow version errors:
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```

The application will run at: **http://localhost:3000**

### 3. Login with Demo Accounts

**Student Account:**
- Email: `student@test.com`
- Password: `password123`

**Teacher/Admin Account:**
- Email: `teacher@test.com`
- Password: `password123`

---

## First-Time Setup

When you first run the application, it will automatically:
1. Initialize localStorage database
2. Create sample modules and lessons
3. Set up demo user accounts

**No manual configuration needed!**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |

---

## Webcam Permissions

For hand gesture detection to work:
1. Browser will request webcam access
2. Click "Allow" when prompted
3. Make sure you're on HTTPS or localhost (required for camera API)

---

## Browser Compatibility

✅ **Recommended:**
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

⚠️ **Note:** MediaPipe works best in Chrome/Edge

---

## Sample Data

The platform includes pre-loaded content:

**3 Modules:**
1. ASL Alphabet (4 lessons)
2. Numbers 1-10 (3 lessons)
3. Common Greetings (1 lesson)

**2 Demo Users:**
- Student (regular learner)
- Teacher (can create content)

---

## Creating New Content (Admin)

1. Login as teacher (`teacher@test.com`)
2. Navigate to `/admin` or click "Admin" in navbar
3. Create modules with:
   - Title, description
   - Category, difficulty
4. Create lessons with:
   - Title, sign being taught
   - Instructions (one per line)
   - Image URL (external link)
   - Video URL (external link)

**Note:** No file uploads - use external URLs from:
- Imgur
- Cloudinary
- YouTube (for videos)
- Any public CDN

---

## Data Storage

All data is stored in **browser localStorage**:
- User accounts
- Module/lesson content
- Student progress
- Quiz results

**Important:**
- Data persists across sessions
- Specific to this browser
- Lost if browser cache cleared
- Export manually if needed (see DevTools)

---

## Troubleshooting

### Issue: npm install fails
**Solution:** 
```bash
npm install --legacy-peer-deps
```

### Issue: Port 3000 already in use
**Solution:**
```bash
npm run dev -- -p 3001
```

### Issue: Webcam not working
**Solutions:**
1. Use Chrome or Edge browser
2. Ensure you're on localhost or HTTPS
3. Check browser permissions
4. Try reloading the page

### Issue: TypeScript errors in editor
**Solution:**
Wait for npm install to complete, then restart VS Code

### Issue: Hand detection not recognizing gestures
**Tips:**
1. Ensure good lighting
2. Show full hand to camera
3. Position hand 1-2 feet from camera
4. Practice with reference images

---

## Development Tips

### Hot Reload
Files auto-reload on save:
- Pages in `src/pages/`
- Components in `src/components/`
- Styles in `src/styles/`

### Database Updates
To reset sample data:
1. Open browser DevTools (F12)
2. Application → Local Storage → localhost:3000
3. Clear all keys
4. Refresh page (data will reinitialize)

### Adding New Features
- Pages: `src/pages/`
- Components: `src/components/`
- Database: `src/lib/db.ts`
- Styles: `src/styles/globals.css`

---

## Deployment (Free)

### Option 1: Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Option 2: Netlify
```bash
npm run build
# Upload /out or /.next folder
```

### Option 3: GitHub Pages
```bash
npm run build
npm run export
# Push /out to gh-pages branch
```

---

## What's Next?

1. ✅ Install dependencies
2. ✅ Run `npm run dev`
3. ✅ Login and explore
4. ✅ Try hand gesture detection
5. ✅ Complete a lesson
6. ✅ Take a quiz
7. ✅ Check dashboard analytics
8. ✅ (Admin) Create new content

---

## Getting Help

**Common Questions:**
- See `README.md` for features
- See `MIGRATION_COMPLETE.md` for technical details
- See `README.LOCAL.md` for limitations

**Technical Issues:**
- Check browser console (F12)
- Verify npm install completed
- Try incognito/private mode
- Clear localStorage and refresh

---

## Success Checklist

- [ ] npm install completed without errors
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Can login with demo accounts
- [ ] Webcam permission granted
- [ ] Hand detection working
- [ ] Sample modules visible
- [ ] Quiz system functional
- [ ] Admin panel accessible (teacher account)

---

**Ready to learn Sign Language! 🤟**
