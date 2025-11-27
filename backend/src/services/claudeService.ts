import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.CLAUDE_API_KEY?.trim()

if (!apiKey) {
  console.error('ERROR: CLAUDE_API_KEY environment variable is not set or empty')
}

let client: Anthropic | null = null

try {
  client = new Anthropic({
    apiKey: apiKey || 'dummy',
  })
} catch (err) {
  console.error('ERROR: Failed to initialize Anthropic client:', err)
}

interface ParsedMemoryData {
  fileName: string
  size: number
  functions: string[]
  suspiciousPatterns: string[]
  codeSnippets: Map<string, CodeSnippet[]>
  sourceCode: string
}

interface CodeSnippet {
  lineNumber: number
  code: string
  context: string[]
}

interface AIAnalysisResult {
  leaksFound: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  issues: Array<{
    type: string
    location: string
    severity: string
    description: string
    recommendation: string
    codeSnippet?: CodeSnippet
    lineNumber?: number
  }>
  analysis: string
}

export async function analyzeWithClaude(data: ParsedMemoryData, fileName: string): Promise<AIAnalysisResult> {
  // Always use mock analysis if client is not properly initialized
  if (!client || !apiKey || apiKey === 'dummy') {
    console.log('Using mock analysis - API key not configured')
    return generateMockAnalysis(data, fileName)
  }

  // Prepare code snippets for analysis
  const codeSnippetsText = formatCodeSnippets(data.codeSnippets)

  const prompt = `You are an expert C/C++ memory analyst. Analyze the following memory dump and provide insights on potential memory leaks and corruption issues.

File: ${fileName}
Size: ${data.size} bytes
Functions: ${data.functions.join(', ')}
Suspicious Patterns: ${data.suspiciousPatterns.join(', ')}

Code Snippets with Potential Issues:
${codeSnippetsText}

Provide a detailed analysis in JSON format with the following structure:
{
  "leaksFound": <number>,
  "severity": "<critical|high|medium|low>",
  "issues": [
    {
      "type": "<leak|corruption|use_after_free|buffer_overflow>",
      "location": "<function or memory address>",
      "severity": "<critical|high|medium|low>",
      "description": "<detailed description>",
      "recommendation": "<fix recommendation>",
      "lineNumber": <line number if available>
    }
  ],
  "analysis": "<comprehensive analysis>"
}

Be specific and actionable in your recommendations. Include line numbers where applicable.`

  try {
    const message = await (client as any).messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const analysis = JSON.parse(jsonMatch[0]) as AIAnalysisResult
    
    // Enrich issues with code snippets from parsed data
    const enrichedAnalysis = enrichIssuesWithCodeSnippets(analysis, data)
    return enrichedAnalysis
  } catch (error) {
    console.error('Claude analysis error:', error)
    console.log('Falling back to mock analysis')
    return generateMockAnalysis(data, fileName)
  }
}

// Fallback mock analysis when API is not available
function generateMockAnalysis(data: ParsedMemoryData, fileName: string): AIAnalysisResult {
  const hasMemoryPatterns = data.suspiciousPatterns.some(p => 
    p.toLowerCase().includes('malloc') || 
    p.toLowerCase().includes('leak') ||
    p.toLowerCase().includes('free')
  )

  // Get code snippets for the issues
  const allocationSnippets = data.codeSnippets.get('allocation') || []
  const unmatchedSnippets = data.codeSnippets.get('unmatched_malloc') || data.codeSnippets.get('unmatched_new') || []

  const issues = [
    {
      type: 'leak',
      location: data.functions[0] || 'unknown',
      severity: hasMemoryPatterns ? 'high' : 'medium',
      description: `Potential memory leak detected in ${fileName}. Memory allocation without corresponding deallocation detected.`,
      recommendation: 'Add corresponding free() or delete calls for all allocated memory.',
      codeSnippet: unmatchedSnippets[0],
      lineNumber: unmatchedSnippets[0]?.lineNumber,
    },
    {
      type: 'leak',
      location: data.functions[1] || 'unknown',
      severity: 'medium',
      description: `Possible unfreed memory found in function. Check for early returns or exceptions that skip cleanup.`,
      recommendation: 'Use RAII patterns or ensure cleanup in all code paths.',
      codeSnippet: allocationSnippets[0],
      lineNumber: allocationSnippets[0]?.lineNumber,
    },
  ]

  return {
    leaksFound: hasMemoryPatterns ? 2 : 1,
    severity: hasMemoryPatterns ? 'high' : 'medium',
    issues,
    analysis: `Analysis of ${fileName} (${data.size} bytes) revealed potential memory management issues. The file contains ${data.functions.length} functions with suspicious memory patterns. Recommended actions: 1) Add memory leak detection tools, 2) Use static analysis, 3) Review malloc/free pairs.`,
  }
}

function formatCodeSnippets(codeSnippets: Map<string, any[]>): string {
  let result = ''
  codeSnippets.forEach((snippets, category) => {
    result += `\n${category.replace(/_/g, ' ').toUpperCase()}:\n`
    snippets.slice(0, 5).forEach(snippet => {
      result += `  Line ${snippet.lineNumber}: ${snippet.code}\n`
    })
  })
  return result
}

function enrichIssuesWithCodeSnippets(analysis: AIAnalysisResult, data: ParsedMemoryData): AIAnalysisResult {
  const enrichedIssues = analysis.issues.map(issue => {
    if (issue.lineNumber) {
      // Find the corresponding code snippet
      const codeSnippets = Array.from(data.codeSnippets.values()).flat()
      const snippet = codeSnippets.find(s => s.lineNumber === issue.lineNumber)
      if (snippet) {
        return { ...issue, codeSnippet: snippet }
      }
    }
    return issue
  })

  return { ...analysis, issues: enrichedIssues }
}
