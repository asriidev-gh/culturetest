import { NextResponse } from 'next/server'
import openaiService from '../../../services/openaiService'

export async function POST(request) {
  try {
    const { testName, behaviors, questionCount } = await request.json()

    // Validate input
    if (!testName || !behaviors) {
      return NextResponse.json(
        { error: 'Test name and behaviors are required' },
        { status: 400 }
      )
    }

    // Validate question count (minimum 10, maximum 50)
    const validatedQuestionCount = Math.max(10, Math.min(50, questionCount || 10))

    // Generate questions using OpenAI
    const generatedQuestions = await openaiService.generateBehavioralQuestions(
      testName,
      behaviors,
      validatedQuestionCount
    )

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length
    })

  } catch (error) {
    console.error('Error generating questions:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate questions',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
