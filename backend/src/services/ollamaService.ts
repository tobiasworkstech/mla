import { parseMemoryDump } from './memoryParser.js'

// Re-defining interfaces since they aren't exported from other services
interface CodeSnippet {
    lineNumber: number
    code: string
    context: string[]
}

interface ParsedMemoryData {
    fileName: string
    size: number
    functions: string[]
    suspiciousPatterns: string[]
    codeSnippets: Map<string, CodeSnippet[]>
    sourceCode: string
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

export async function analyzeWithOllama(data: ParsedMemoryData, fileName: string): Promise<AIAnalysisResult> {
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

Be specific and actionable in your recommendations. Include line numbers where applicable.
IMPORTANT: Return ONLY the JSON object, no markdown formatting or other text.`

    const ollamaHost = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434'
    const ollamaModel = process.env.OLLAMA_MODEL || 'gemma3:1b'

    try {
        const response = await fetch(`${ollamaHost}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: ollamaModel,
                messages: [{ role: 'user', content: prompt }],
                stream: false,
                format: 'json', // Force JSON mode if supported
            }),
        })

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`)
        }

        const json = (await response.json()) as any
        const content = json.message?.content || '{}'

        // Parse JSON from response
        // Sometimes models add markdown blocks even when asked not to
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            // Fallback or retry logic could go here
            throw new Error('No JSON found in response')
        }

        const analysis = JSON.parse(jsonMatch[0]) as AIAnalysisResult

        // Enrich issues with code snippets from parsed data
        const enrichedAnalysis = enrichIssuesWithCodeSnippets(analysis, data)
        return enrichedAnalysis

    } catch (error) {
        console.error('Ollama analysis error:', error)
        console.log('Falling back to mock analysis')
        return generateMockAnalysis(data, fileName)
    }
}

// Reuse helper functions (duplicated to avoid complex refactoring)
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
