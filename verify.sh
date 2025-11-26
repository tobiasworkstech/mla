#!/bin/bash

echo "🔍 Memory Leak Analyzer - Project Verification"
echo "=============================================="
echo ""

PASS="✓"
FAIL="✗"
COUNT=0

# Check directories
echo "📁 Checking Project Structure:"
for dir in frontend backend cpp-analyzer .vscode .github; do
    if [ -d "$dir" ]; then
        echo "$PASS $dir/"
        ((COUNT++))
    else
        echo "$FAIL $dir/ - Missing!"
    fi
done

echo ""
echo "📄 Checking Configuration Files:"
for file in package.json README.md SETUP.md CONTRIBUTING.md CHANGELOG.md .gitignore; do
    if [ -f "$file" ]; then
        echo "$PASS $file"
        ((COUNT++))
    else
        echo "$FAIL $file - Missing!"
    fi
done

echo ""
echo "🔧 Checking Backend:"
for file in backend/package.json backend/tsconfig.json backend/.env.example \
            backend/src/index.ts backend/src/services/claudeService.ts; do
    if [ -f "$file" ]; then
        echo "$PASS $file"
        ((COUNT++))
    else
        echo "$FAIL $file - Missing!"
    fi
done

echo ""
echo "⚛️  Checking Frontend:"
for file in frontend/package.json frontend/tsconfig.json frontend/vite.config.ts \
            frontend/tailwind.config.js frontend/index.html frontend/src/App.tsx; do
    if [ -f "$file" ]; then
        echo "$PASS $file"
        ((COUNT++))
    else
        echo "$FAIL $file - Missing!"
    fi
done

echo ""
echo "🔧 Checking C++ Analyzer:"
for file in cpp-analyzer/package.json cpp-analyzer/CMakeLists.txt \
            cpp-analyzer/include/memory_analyzer.h cpp-analyzer/src/analyzer.cpp; do
    if [ -f "$file" ]; then
        echo "$PASS $file"
        ((COUNT++))
    else
        echo "$FAIL $file - Missing!"
    fi
done

echo ""
echo "✅ Verification Summary"
echo "====================="
echo "Files verified: $COUNT"
echo ""

# Check Node modules
if [ -d "node_modules" ]; then
    MODULES=$(ls node_modules | wc -l)
    echo "$PASS Dependencies installed ($MODULES packages)"
else
    echo "$FAIL Dependencies not installed - Run: npm install"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Add Claude API key to backend/.env"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
