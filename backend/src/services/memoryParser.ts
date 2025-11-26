interface ParsedMemoryData {
  fileName: string
  size: number
  functions: string[]
  suspiciousPatterns: string[]
}

export async function parseMemoryDump(buffer: Buffer): Promise<ParsedMemoryData> {
  // Basic parsing - extract readable strings and patterns
  const content = buffer.toString('latin1')

  // Extract function-like patterns
  const functionPattern = /[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)/g
  const functions = [...new Set(content.match(functionPattern) || [])].slice(0, 20)

  // Look for suspicious patterns
  const suspiciousPatterns: string[] = []

  // Memory allocation patterns
  if (content.includes('malloc') || content.includes('calloc')) {
    suspiciousPatterns.push('Memory allocation calls detected')
  }

  // Pointer patterns
  if (content.match(/0x[0-9a-fA-F]{8,}/)) {
    suspiciousPatterns.push('Pointer values found')
  }

  // Common leak indicators
  if (content.includes('delete') && content.includes('new')) {
    suspiciousPatterns.push('New/delete pairs found')
  }

  if (content.includes('free') && content.includes('alloc')) {
    suspiciousPatterns.push('Allocation/free calls detected')
  }

  return {
    fileName: 'memory_dump',
    size: buffer.length,
    functions: functions as string[],
    suspiciousPatterns,
  }
}
