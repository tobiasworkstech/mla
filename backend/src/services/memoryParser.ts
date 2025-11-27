interface CodeSnippet {
  lineNumber: number
  code: string
  context: string[] // surrounding lines
}

interface ParsedMemoryData {
  fileName: string
  size: number
  functions: string[]
  suspiciousPatterns: string[]
  codeSnippets: Map<string, CodeSnippet[]>
  sourceCode: string
}

export async function parseMemoryDump(buffer: Buffer): Promise<ParsedMemoryData> {
  // Basic parsing - extract readable strings and patterns
  const content = buffer.toString('latin1')
  const lines = content.split('\n')

  // Extract function-like patterns
  const functionPattern = /[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)/g
  const functions = [...new Set(content.match(functionPattern) || [])].slice(0, 20)

  // Look for suspicious patterns
  const suspiciousPatterns: string[] = []
  const codeSnippets = new Map<string, CodeSnippet[]>()

  // Memory allocation patterns with code context
  const mallocRegex = /(malloc|calloc|new|new\[)\s*\(/gi
  const freeRegex = /(free|delete|delete\[)\s*\(/gi

  if (content.match(mallocRegex)) {
    suspiciousPatterns.push('Memory allocation calls detected')
    extractCodeSnippets(lines, mallocRegex, 'allocation', codeSnippets)
  }

  // Pointer patterns
  if (content.match(/0x[0-9a-fA-F]{8,}/)) {
    suspiciousPatterns.push('Pointer values found')
  }

  // Common leak indicators - look for mismatched allocation/deallocation
  const hasNew = content.includes('new')
  const hasDelete = content.includes('delete')
  const hasMalloc = content.includes('malloc')
  const hasFree = content.includes('free')

  if (hasNew && !hasDelete) {
    suspiciousPatterns.push('new operator found without delete')
    extractCodeSnippets(lines, /new\s+/gi, 'unmatched_new', codeSnippets)
  }

  if (hasMalloc && !hasFree) {
    suspiciousPatterns.push('malloc() calls found without free()')
    extractCodeSnippets(lines, /malloc\s*\(/gi, 'unmatched_malloc', codeSnippets)
  }

  if (hasNew && hasDelete) {
    suspiciousPatterns.push('New/delete pairs found')
  }

  if (hasMalloc && hasFree) {
    suspiciousPatterns.push('Allocation/free calls detected')
  }

  return {
    fileName: 'memory_dump',
    size: buffer.length,
    functions: functions as string[],
    suspiciousPatterns,
    codeSnippets,
    sourceCode: content,
  }
}

function extractCodeSnippets(
  lines: string[],
  regex: RegExp,
  category: string,
  codeSnippets: Map<string, CodeSnippet[]>
): void {
  const snippets: CodeSnippet[] = []
  const contextLines = 3

  lines.forEach((line, index) => {
    if (regex.test(line)) {
      const startLine = Math.max(0, index - contextLines)
      const endLine = Math.min(lines.length - 1, index + contextLines)
      const context = lines.slice(startLine, endLine + 1)

      snippets.push({
        lineNumber: index + 1,
        code: line.trim(),
        context,
      })
    }
  })

  if (snippets.length > 0) {
    codeSnippets.set(category, snippets)
  }
}
