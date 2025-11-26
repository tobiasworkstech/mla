# 🚀 Memory Leak Analyzer - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Get Claude API Key
1. Visit https://console.anthropic.com
2. Sign up or login
3. Create API key
4. Copy the key (starts with `sk-ant-`)

### 2. Configure Project
```bash
# Create environment file
echo "CLAUDE_API_KEY=sk-ant-your-key-here" > backend/.env
echo "PORT=4000" >> backend/.env
echo "NODE_ENV=development" >> backend/.env
```

### 3. Start Development
```bash
npm run dev
```

### 4. Open Application
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 🎯 Using the Application

### Step 1: Upload Files
1. Click "Analyze" in navigation
2. Drag and drop C/C++ files
   - Binary files (.bin, .o, .so, .dylib)
   - Source files (.c, .cpp, .h, .hpp)

### Step 2: Run Analysis
1. Click "Analyze with AI"
2. Wait for processing (5-30 seconds)

### Step 3: View Results
- **Severity Badge** - Critical/High/Medium/Low
- **Leak Count** - Total issues found
- **Detailed Issues** - Each issue with:
  - Type (leak, corruption, use-after-free, etc.)
  - Location in code
  - Description
  - 💡 AI-provided fix recommendation

## 📁 Project Structure Overview

```
Your Project
├── Frontend (React + Vite)
│   └── Runs on port 3000
├── Backend (Node.js + Express)
│   └── Runs on port 4000
├── C++ Analyzer (Native)
│   └── Build with CMake
└── Documentation
    ├── README.md (overview)
    ├── SETUP.md (detailed guide)
    ├── PROJECT_SUMMARY.md (this info)
    └── CONTRIBUTING.md (contribute)
```

## 🔍 Key Commands

```bash
# Start everything
npm run dev

# Start just frontend (needs backend running)
npm run dev:frontend

# Start just backend (needs backend/.env)
npm run dev:backend

# Build for production
npm run build

# Run tests
npm run test

# Verify project
bash verify.sh

# Setup (first time)
bash setup.sh
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version (need 18+)
node -v

# Check port 4000 is free
lsof -i :4000

# Check .env file exists
cat backend/.env

# Try reinstalling
rm -rf node_modules package-lock.json
npm install
npm run dev:backend
```

### Frontend won't load
```bash
# Clear cache
npm cache clean --force

# Restart dev server
npm run dev:frontend
```

### API not connecting
```bash
# Test backend health
curl http://localhost:4000/api/health

# Check browser console (F12)
# Check Network tab for API calls
```

## 🎓 Project Features

✅ **Drag & Drop Upload** - Easy file selection
✅ **AI Analysis** - Claude AI powers detection
✅ **Live Results** - Real-time feedback
✅ **Smart Recommendations** - AI-provided fixes
✅ **Multi-Format** - Support for binaries & source
✅ **Production Ready** - Docker included

## 📚 Additional Resources

- **Full Setup Guide**: Read `SETUP.md`
- **API Documentation**: See `backend/README.md`
- **Frontend Info**: Check `frontend/README.md`
- **Contribute**: See `CONTRIBUTING.md`
- **Version Info**: Read `CHANGELOG.md`

## 🚀 Next Steps

1. **Add More Test Files**
   - Create sample C/C++ files with memory issues
   - Test the analyzer with various file types

2. **Customize Analysis**
   - Edit `backend/src/services/claudeService.ts`
   - Modify analysis prompts
   - Add custom detection patterns

3. **Enhance UI**
   - Modify components in `frontend/src/`
   - Add more charts and visualizations
   - Customize styling

4. **Deploy**
   - Use Docker: `docker build -t analyzer .`
   - Deploy to cloud: See `SETUP.md` deployment section

## 💡 Pro Tips

1. **Development**
   - Use VS Code debugger (F5)
   - Chrome DevTools for frontend
   - API testing with curl or Postman

2. **Performance**
   - Keep file uploads < 100MB
   - Monitor API rate limits
   - Build C++ with optimizations

3. **Security**
   - Never commit `.env` files
   - Rotate API keys regularly
   - Use HTTPS in production

## 📞 Need Help?

1. Check `SETUP.md` - Comprehensive setup guide
2. Review `backend/README.md` - API documentation
3. Look at example files in `frontend/src/pages/`
4. Check `CONTRIBUTING.md` - Contributing guidelines

---

**You're all set! Start with `npm run dev` and visit http://localhost:3000** 🎉
