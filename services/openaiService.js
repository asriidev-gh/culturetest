// OpenAI service for generating behavioral questions
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.baseURL = 'https://api.openai.com/v1'
  }

  async generateBehavioralQuestions(testName, behaviors, questionCount = 10) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = this.buildPrompt(testName, behaviors, questionCount)
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in behavioral assessment and organizational psychology. Generate relevant behavioral questions that assess specific behaviors and attitudes. Always provide the exact number of questions requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      let generatedQuestions = this.parseGeneratedQuestions(data.choices[0].message.content, questionCount)
      
      // If we still don't have enough questions, try one more time with a more explicit prompt
      if (generatedQuestions.length < questionCount) {
        console.log(`First attempt generated ${generatedQuestions.length} questions, retrying for ${questionCount - generatedQuestions.length} more...`)
        
        const retryPrompt = this.buildRetryPrompt(testName, behaviors, questionCount - generatedQuestions.length)
        const retryResponse = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert in behavioral assessment. Generate ONLY the missing questions in the exact format requested.'
              },
              {
                role: 'user',
                content: retryPrompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        })
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json()
          const additionalQuestions = this.parseGeneratedQuestions(retryData.choices[0].message.content, questionCount - generatedQuestions.length)
          generatedQuestions = [...generatedQuestions, ...additionalQuestions]
        }
      }
      
      return generatedQuestions
    } catch (error) {
      console.error('Error generating questions:', error)
      throw error
    }
  }

  buildPrompt(testName, behaviors, questionCount) {
    return `Generate EXACTLY ${questionCount} behavioral assessment questions for a test called "${testName}".

The test focuses on these behaviors and attitudes: "${behaviors}"

IMPORTANT: You must generate EXACTLY ${questionCount} questions, no more, no less.

For each question, provide:
1. A clear, specific behavioral question
2. 4 answer options with different behavioral levels
3. A relevant category/tag for the question
4. Scoring for each option (10, 7, 4, 1 where 10 is best)

Format the response as JSON with EXACTLY ${questionCount} questions:
{
  "questions": [
    {
      "tag": "Category Name",
      "question": "Question text here?",
      "options": [
        {
          "text": "Option description",
          "score": 10,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 7,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 4,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 1,
          "description": "What this option represents"
        }
      ]
    }
  ]
}

Make questions specific, observable, and relevant to workplace behaviors. Focus on real scenarios that demonstrate the behaviors described.

CRITICAL: Ensure you generate EXACTLY ${questionCount} questions in the response.`
  }

  buildRetryPrompt(testName, behaviors, questionCount) {
    return `Generate EXACTLY ${questionCount} additional behavioral assessment questions for a test called "${testName}".

The test focuses on these behaviors and attitudes: "${behaviors}"

You need to generate EXACTLY ${questionCount} more questions to complete the set.

Format as JSON with ONLY the additional questions:
{
  "questions": [
    {
      "tag": "Category Name",
      "question": "Question text here?",
      "options": [
        {
          "text": "Option description",
          "score": 10,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 7,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 4,
          "description": "What this option represents"
        },
        {
          "text": "Option description",
          "score": 1,
          "description": "What this option represents"
        }
      ]
    }
  ]
}

Make these questions different from typical ones - focus on unique scenarios and edge cases.`
  }

  parseGeneratedQuestions(content, expectedCount) {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and format the questions
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format')
      }

      // Check if we got the expected number of questions
      if (parsed.questions.length !== expectedCount) {
        console.warn(`Expected ${expectedCount} questions, but got ${parsed.questions.length}`)
        
        // If we got fewer questions, try to extract more from the text
        if (parsed.questions.length < expectedCount) {
          const additionalQuestions = this.extractAdditionalQuestions(content, expectedCount - parsed.questions.length)
          parsed.questions = [...parsed.questions, ...additionalQuestions]
        }
      }

      // Add IDs and ensure proper structure
      return parsed.questions.map((q, index) => ({
        id: index + 1,
        tag: q.tag || 'General',
        question: q.question || '',
        options: q.options?.map((opt, optIndex) => ({
          text: opt.text || `Option ${optIndex + 1}`,
          score: opt.score || (10 - optIndex * 3),
          description: opt.description || ''
        })) || [
          { text: 'Option 1', score: 10, description: 'Highest score option' },
          { text: 'Option 2', score: 7, description: 'Medium-high score option' },
          { text: 'Option 3', score: 4, description: 'Medium-low score option' },
          { text: 'Option 4', score: 1, description: 'Lowest score option' }
        ]
      }))
    } catch (error) {
      console.error('Error parsing generated questions:', error)
      throw new Error('Failed to parse generated questions')
    }
  }

  extractAdditionalQuestions(content, neededCount) {
    const questions = []
    
    // Look for question patterns in the text
    const questionPatterns = [
      /(?:question|q|#)\s*\d*[:\-]?\s*([^?]+\?)/gi,
      /([^.!?]+\?)/g
    ]
    
    let foundQuestions = []
    questionPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        foundQuestions.push(...matches)
      }
    })
    
    // Remove duplicates and format
    foundQuestions = [...new Set(foundQuestions)]
      .filter(q => q.length > 20 && q.length < 200) // Reasonable question length
      .slice(0, neededCount)
    
    // Create additional questions from found text
    for (let i = 0; i < Math.min(foundQuestions.length, neededCount); i++) {
      questions.push({
        tag: 'Additional',
        question: foundQuestions[i].trim(),
        options: [
          { text: 'Option 1', score: 10, description: 'Highest score option' },
          { text: 'Option 2', score: 7, description: 'Medium-high score option' },
          { text: 'Option 3', score: 4, description: 'Medium-low score option' },
          { text: 'Option 4', score: 1, description: 'Lowest score option' }
        ]
      })
    }
    
    return questions
  }
}

export default new OpenAIService()
