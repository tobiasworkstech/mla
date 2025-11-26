# C/C++ Analyzer

Native C/C++ memory analysis engine.

## Building

```bash
npm run build
```

## Requirements

- CMake 3.15+
- C++ compiler (g++, clang, or MSVC)
- Node.js (for binding to JavaScript)

## Architecture

- `analyzer.cpp` - Core memory leak detection
- `memory_parser.cpp` - Binary format parsing
- C interface for Node.js native bindings

## Supported Analysis

- Memory leak detection
- Buffer overflow detection
- Use-after-free detection
- Memory corruption patterns
