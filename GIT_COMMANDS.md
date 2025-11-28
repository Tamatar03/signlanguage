# 🔧 Git Commands for Initial Commit & GitHub Upload

## Step-by-Step Guide

### 1. Initialize Git Repository (if not done)
```bash
git init
```

### 2. Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Check Current Status
```bash
git status
```

### 4. Add All Files to Staging
```bash
git add .
```

Or add specific files:
```bash
git add README.md
git add src/
git add package.json
```

### 5. Create Initial Commit
```bash
git commit -m "Initial commit: Sign Language Learning Platform"
```

Or with more detail:
```bash
git commit -m "feat: Complete Sign Language platform with localStorage

- Implemented modular lesson system
- Added MediaPipe hand gesture detection
- Built quiz system with webcam verification
- Created student and teacher dashboards
- Migrated from Firebase to localStorage (100% free)
- Includes sample data (3 modules, 8 lessons)"
```

### 6. Create Repository on GitHub
1. Go to https://github.com
2. Click "New repository" (green button)
3. Name it: `sign-language-platform` (or your choice)
4. DON'T initialize with README (you already have one)
5. Click "Create repository"

### 7. Link Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/sign-language-platform.git
```

Replace `YOUR_USERNAME` with your GitHub username.

Verify it's added:
```bash
git remote -v
```

### 8. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

If you prefer `master` as branch name:
```bash
git branch -M master
git push -u origin master
```

---

## Common Variations

### Using SSH Instead of HTTPS
```bash
git remote add origin git@github.com:YOUR_USERNAME/sign-language-platform.git
git push -u origin main
```

### Pushing to Existing Repository
```bash
git remote add origin <your-repo-url>
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Complete Command Sequence (Copy-Paste)

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Sign Language Learning Platform with localStorage"

# Add GitHub remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sign-language-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### Error: "fatal: not a git repository"
**Solution:**
```bash
git init
```

### Error: "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin <your-repo-url>
```

### Error: "failed to push some refs"
**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied (publickey)"
**Solution:** Use HTTPS instead of SSH, or set up SSH keys:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/repo-name.git
```

---

## What Files Will Be Committed?

The `.gitignore` file excludes:
- ❌ `node_modules/` (dependencies - don't commit)
- ❌ `.next/` (build files)
- ❌ `.env.local` (secrets)
- ❌ `.DS_Store` (Mac files)

Will be committed: ✅
- All source code (`src/`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`README.md`, `SETUP.md`, etc.)
- Git metadata (`.gitignore`)

---

## After Pushing to GitHub

### View Your Repository
```
https://github.com/YOUR_USERNAME/sign-language-platform
```

### Clone on Another Machine
```bash
git clone https://github.com/YOUR_USERNAME/sign-language-platform.git
cd sign-language-platform
npm install
npm run dev
```

### Make Changes and Update
```bash
# Make changes to files
git add .
git commit -m "Update: description of changes"
git push
```

---

## GitHub Repository Settings

### Recommended Settings
1. **Description:** "Interactive web-based Sign Language learning platform with MediaPipe hand detection, quiz system, and progress tracking. 100% free - uses localStorage."

2. **Topics (tags):**
   - `sign-language`
   - `education`
   - `nextjs`
   - `typescript`
   - `mediapipe`
   - `hand-detection`
   - `machine-learning`
   - `accessibility`

3. **Website:** Your deployed URL (e.g., https://yourusername.vercel.app)

4. **License:** MIT (or your choice)

5. **README Badges (Optional):**
   ```markdown
   ![Next.js](https://img.shields.io/badge/Next.js-14-black)
   ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
   ![License](https://img.shields.io/badge/license-MIT-green)
   ```

---

## Branching Strategy (Optional)

### Create Development Branch
```bash
git checkout -b develop
git push -u origin develop
```

### Feature Branches
```bash
git checkout -b feature/new-lessons
# Make changes
git add .
git commit -m "feat: Add 5 new ASL lessons"
git push -u origin feature/new-lessons
# Create Pull Request on GitHub
```

---

## .gitignore File Check

Make sure you have a `.gitignore` file with:
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Build
.next/
out/
build/
dist/

# Misc
.DS_Store
*.log
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## Deployment After Push

### Vercel (Recommended)
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy"
5. Done! Auto-deploys on every push

### Netlify
1. Go to https://netlify.com
2. Click "New site from Git"
3. Choose GitHub
4. Select repository
5. Deploy

---

## Commit Message Best Practices

### Format
```
<type>: <subject>

<body (optional)>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semi-colons, etc.
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Examples
```bash
git commit -m "feat: Add quiz timer feature"
git commit -m "fix: Resolve webcam permission bug"
git commit -m "docs: Update setup instructions"
git commit -m "style: Format code with Prettier"
git commit -m "refactor: Simplify localStorage logic"
```

---

## Collaboration Commands

### Pull Latest Changes
```bash
git pull origin main
```

### Check Commit History
```bash
git log --oneline
```

### View Changes Before Commit
```bash
git diff
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

---

## Tags for Releases

### Create Version Tag
```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

### List Tags
```bash
git tag
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Add files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| Pull | `git pull` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| View history | `git log` |
| Undo changes | `git checkout -- file.txt` |

---

## 🎯 TL;DR - Quick Upload to GitHub

```bash
# One-time setup
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git push -u origin main

# Future updates:
git add .
git commit -m "Update message"
git push
```

---

**That's it! Your code is now on GitHub! 🎉**
