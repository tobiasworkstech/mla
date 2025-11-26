# Updated Features - Directory Analysis

## ✨ New Features Added

### 1. **Directory Analysis**
Automatically discover and analyze all C/C++ files in a directory without manual file selection.

### 2. **Batch File Analysis**
Upload multiple files at once and analyze them together.

### 3. **File Discovery**
Recursively finds C/C++ files with these extensions:
- `.c`, `.cpp`, `.cc`, `.cxx` (source files)
- `.h`, `.hpp`, `.hxx` (header files)
- `.o`, `.so`, `.dylib`, `.bin` (binary files)

---

## 🚀 How to Use

### Option 1: Upload Files Directly
1. Open http://localhost:3000
2. Click "Analyze" → "Upload Files"
3. Drag and drop your files or click to select
4. Click "Analyze with AI"

### Option 2: Analyze Entire Directory (NEW!)
1. Open http://localhost:3000
2. Click "Analyze" → "Analyze Directory"
3. Enter the full path to your project directory
4. Click "Analyze Directory"

**Example paths:**
- macOS: `/Users/username/Documents/myproject`
- Linux: `/home/user/projects/myapp`
- WSL: `/mnt/c/Users/username/projects`

---

## 📋 API Endpoints

### Upload Files
```bash
curl -X POST http://localhost:4000/api/analyze \
  -F "files=@file1.c" \
  -F "files=@file2.cpp"
```

### Analyze Directory (NEW!)
```bash
curl -X POST http://localhost:4000/api/analyze-directory \
  -H "Content-Type: application/json" \
  -d '{
    "directoryPath": "/path/to/your/project"
  }'
```

Response:
```json
{
  "id": "analysis-id-123",
  "message": "Found and analyzed 42 C/C++ files",
  "filesFound": 42
}
```

### Get Results
```bash
curl http://localhost:4000/api/results/analysis-id-123
```

---

## 📊 Results Format

### Batch Results (Directory Analysis)
```json
{
  "id": "analysis-id",
  "directoryPath": "/path/to/project",
  "filesAnalyzed": 42,
  "filesFound": 42,
  "timestamp": "2025-11-26T...",
  "results": [
    {
      "fileName": "src/main.c",
      "fullPath": "/path/to/project/src/main.c",
      "leaksFound": 3,
      "severity": "high",
      "issues": [...],
      "analysis": "..."
    }
  ]
}
```

### Single File Results
```json
{
  "id": "analysis-id",
  "fileName": "main.c",
  "timestamp": "2025-11-26T...",
  "leaksFound": 3,
  "severity": "high",
  "issues": [...],
  "aiAnalysis": "..."
}
```

---

## 🔍 File Discovery Behavior

When analyzing a directory:
1. Recursively scans all subdirectories
2. Skips `.` directories (hidden)
3. Skips `node_modules` directory
4. Finds matching C/C++ extensions
5. Analyzes each file individually
6. Returns combined results

---

## 💡 Tips

**For Large Projects:**
- Narrow down the directory to analyze specific modules
- Example: Analyze `src/` instead of entire project root

**For Specific File Types:**
- Upload individual files if you only want to analyze headers or sources

**Performance:**
- Analyzing 100+ files may take 5-10 minutes depending on file sizes
- Backend processes one file at a time for reliability

---

## 🛠️ Backend Implementation

### New Endpoint
```
POST /api/analyze-directory
```

### Helper Function
```typescript
function findCppFiles(dirPath: string, extensions = ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx']): string[]
```

### Process Flow
1. Validate directory path
2. Find all C/C++ files recursively
3. Read each file from disk
4. Parse with memory parser
5. Analyze with Claude AI
6. Return combined results

---

## 📱 Frontend UI Updates

### Analyzer Page
- Toggle between "Upload Files" and "Analyze Directory" modes
- Directory mode with path input
- Example paths provided
- Status messages during scanning

### Results Page
- Shows file count for batch results
- Collapsible file sections
- Expandable issue details
- Individual severity for each file

---

## ⚙️ Configuration

### Supported Extensions
Edit in `backend/src/index.ts`:
```typescript
const extensions = ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx']
```

### Size Limits
```typescript
const upload = multer({ 
  storage, 
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
})
```

### JSON Size Limit
```typescript
app.use(express.json({ limit: '100mb' }))
```

---

## 🐛 Troubleshooting

**"Directory not found"**
- Check path syntax (use full absolute path)
- Verify directory exists and is readable
- Use forward slashes even on Windows (WSL)

**"No C/C++ files found"**
- Verify `.c`, `.cpp`, `.h`, `.hpp` files exist
- Check file extensions match supported types
- Try analyzing a specific subdirectory

**Analysis taking too long**
- Large files take longer to analyze
- Reduce directory size or analyze fewer files
- Check API logs for progress

---

## 🎯 Next Steps

1. Try analyzing a test project
2. Check the Results page for expandable file details
3. Review severity levels and recommendations
4. Use insights to fix memory issues

**Happy analyzing!** 🚀
