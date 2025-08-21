'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, ArrowRight, Clock, User } from 'lucide-react'
import { useTestContext } from '../../../contexts/TestContext'

export default function TestPage({ params }) {
  const { getTestById, recordTestStart, recordTestCompletion, calculateRanking } = useTestContext()
  const [testData, setTestData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    try {
      // First try to fetch test data from context
      let test = getTestById(params.id)
      
      // If not found in context, check localStorage for preview data
      if (!test) {
        const previewData = localStorage.getItem('previewTestData')
        if (previewData) {
          try {
            const parsedData = JSON.parse(previewData)
            // Only use preview data if the ID matches
            if (parsedData.id === params.id) {
              test = parsedData
              console.log('Using preview test data:', test)
            }
          } catch (error) {
            console.error('Error parsing preview test data:', error)
          }
        }
      }
      
      if (test) {
        setTestData(test)
        // Check if this is preview mode
        if (!test.createdAt) {
          setIsPreviewMode(true)
        } else {
          // Only record test start if it's a real test, not a preview
          try {
            recordTestStart(params.id)
            setHasStarted(true)
          } catch (error) {
            console.error('Error recording test start:', error)
          }
        }
      }
      
      // Start timer
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    } catch (error) {
      console.error('Error in test page useEffect:', error)
      // Show user-friendly error message
      alert('There was an error loading the test. Please refresh the page.')
    }
  }, [params.id, getTestById, recordTestStart])

  const handleAnswer = (questionId, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeTest()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeTest = () => {
    try {
      // Validate that we have all required data
      if (!testData || !testData.questions || !answers) {
        console.error('Missing required data for test completion')
        return
      }

      // Calculate results with dynamic scoring system
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
      
      // Calculate the actual scoring range based on the options provided
      let minPossibleScore = 0
      let maxPossibleScore = 0
      
      testData.questions.forEach(question => {
        const questionScores = question.options.map(opt => opt.score)
        minPossibleScore += Math.min(...questionScores)
        maxPossibleScore += Math.max(...questionScores)
      })
      
      const scoreRange = maxPossibleScore - minPossibleScore
      const percentage = scoreRange > 0 ? Math.round(((totalScore - minPossibleScore) / scoreRange) * 100) : 0
      
      // Calculate average score per question as a percentage
      const maxScorePerQuestion = Math.max(...testData.questions.flatMap(q => q.options.map(opt => opt.score)))
      const averageScorePercentage = Math.round((totalScore / testData.questions.length) / maxScorePerQuestion * 100)
      
      console.log('Score calculation:', {
        totalScore,
        minPossibleScore,
        maxPossibleScore,
        scoreRange,
        percentage,
        answers,
        questionCount: testData.questions.length,
        averageScore: Math.round(totalScore / testData.questions.length),
        averageScorePercentage
      })
      
      // Calculate category scores
      const categoryScores = {}
      testData.questions.forEach(q => {
        if (!categoryScores[q.tag]) {
          categoryScores[q.tag] = { total: 0, count: 0, minPossible: 0, maxPossible: 0 }
        }
        if (answers[q.id] !== undefined) {
          categoryScores[q.tag].total += answers[q.id]
          categoryScores[q.tag].count += 1
          categoryScores[q.tag].minPossible += Math.min(...q.options.map(opt => opt.score))
          categoryScores[q.tag].maxPossible += Math.max(...q.options.map(opt => opt.score))
        }
      })

      const categoryPercentages = {}
      Object.keys(categoryScores).forEach(tag => {
        const { total, count, minPossible, maxPossible } = categoryScores[tag]
        const categoryRange = maxPossible - minPossible
        categoryPercentages[tag] = categoryRange > 0 ? Math.round(((total - minPossible) / categoryRange) * 100) : 0
      })

      let rank = 'N/A'
      
      // Only record completion and ranking if it's not preview mode
      if (!isPreviewMode) {
        try {
          recordTestCompletion(params.id, answers, totalScore, percentage)
          // Calculate ranking
          rank = calculateRanking(params.id, totalScore)
        } catch (error) {
          console.error('Error recording test completion:', error)
        }
      } else {
        // For preview mode, just show results without saving
        console.log('Preview mode - results not saved')
      }

      setResults({
        score: totalScore,
        percentage: percentage,
        averageScorePercentage: averageScorePercentage,
        rank: rank,
        categories: Object.keys(categoryPercentages).map(tag => ({
          name: tag,
          percentage: categoryPercentages[tag],
          color: getCategoryColor(categoryPercentages[tag])
        }))
      })

      setIsCompleted(true)
    } catch (error) {
      console.error('Error completing test:', error)
      // Show a user-friendly error message
      alert('There was an error completing the test. Please try again.')
    }
  }

  const getCategoryColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCategoryTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900 mb-2">Test Not Found</div>
          <div className="text-gray-600 mb-4">The test you're looking for doesn't exist or has been removed.</div>
          
          {/* Helpful actions for users */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Go Back
            </button>
            <div className="text-sm text-gray-500">
              If you're trying to preview a test, make sure to use the "Preview Test" button from the editor.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            {isPreviewMode && (
              <div className="mb-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <Eye className="h-4 w-4 mr-2" />
                Preview Mode - Results Not Saved
              </div>
            )}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Completed!
            </h1>
            <p className="text-lg text-gray-600">
              Here are your results for the {testData.name}
            </p>
          </div>

          {/* Overall Score */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{results.averageScorePercentage}%</div>
                <div className="text-sm text-blue-600 font-medium">Average Score</div>
                <div className="text-xs text-gray-500">Per Question</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
                <div className="text-sm text-green-600 font-medium">Overall Score</div>
                <div className="text-xs text-gray-500">Total Points</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{results.rank}</div>
                <div className="text-sm text-purple-600 font-medium">Rank</div>
                <div className="text-xs text-gray-500">vs Others</div>
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Scoring System</h4>
              <div className="text-sm text-gray-600 mb-3">
                This test uses a custom scoring system where each answer option has been assigned specific point values.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-2">Score Range</div>
                  <div className="text-gray-600">
                    {Math.min(...testData.questions.flatMap(q => q.options.map(opt => opt.score)))} to {Math.max(...testData.questions.flatMap(q => q.options.map(opt => opt.score)))} points per question
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-2">Total Possible</div>
                  <div className="text-gray-600">
                    {testData.questions.reduce((sum, q) => sum + Math.max(...q.options.map(opt => opt.score)), 0)} points
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Your score: {results.score} out of {testData.questions.reduce((sum, q) => sum + Math.max(...q.options.map(opt => opt.score)), 0)} points
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
            <div className="space-y-3">
              {testData.questions.map((question, index) => {
                const answer = answers[question.id]
                const answerText = question.options.find(opt => opt.score === answer)?.text || 'Not answered'
                const answerDescription = question.options.find(opt => opt.score === answer)?.description || ''
                const scoreColor = answer >= 75 ? 'text-green-600' : answer >= 50 ? 'text-yellow-600' : 'text-red-600'
                
                return (
                  <div key={question.id} className="p-3 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Q{index + 1}:</span>
                        <span className={`font-bold ${scoreColor}`}>
                          {answer}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{question.question}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{answerText}</span>
                        <span className="text-gray-400 italic">{answerDescription}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {results.categories.map((category, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <span className="text-xs text-gray-500">
                        ({testData.questions.filter(q => q.tag === category.name).length} questions)
                      </span>
                    </span>
                    <span className={`font-bold ${getCategoryTextColor(category.percentage)}`}>
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Your Strengths</h4>
                <p className="text-sm text-green-700">
                  {results.categories.filter(c => c.percentage >= 70).map(c => c.name).join(', ')} are areas where you excel.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Areas for Development</h4>
                <p className="text-sm text-yellow-700">
                  {results.categories.filter(c => c.percentage < 50).map(c => c.name).join(', ') || 'No specific areas identified'} could be areas to focus on for behavioral improvement.
                </p>
              </div>
            </div>
            
            {/* Score Interpretation */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3">Understanding Your Score</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-700 mb-2">High Scores (75-100%)</div>
                  <div className="text-blue-600">You consistently demonstrate these behaviors and can serve as a role model for others.</div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 mb-2">Moderate Scores (50-74%)</div>
                  <div className="text-blue-600">You show these behaviors regularly but there's room for improvement and consistency.</div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 mb-2">Low Scores (25-49%)</div>
                  <div className="text-blue-600">These behaviors need attention and development to meet organizational expectations.</div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 mb-2">Very Low Scores (0-24%)</div>
                  <div className="text-blue-600">These areas require immediate focus and may indicate significant development needs.</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back to Editor Button for Preview Mode */}
          {isPreviewMode && (
            <div className="text-center mt-6">
              <button
                onClick={() => window.close()}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                Back to Editor
              </button>
            </div>
          )}
        </div>
      </div>
    )
  } // Close the results section

  const question = testData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Preview Indicator */}
          {!testData.createdAt && (
            <div className="mb-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <Eye className="h-4 w-4 mr-2" />
              Preview Mode
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{testData.behaviors}</p>
          
          {/* Back to Editor Button for Preview Mode */}
          {!testData.createdAt && (
            <div className="mt-4">
              <button
                onClick={() => window.close()}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Editor
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {testData.questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {question.tag}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  answers[question.id] === option.score
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.score}
                  checked={answers[question.id] === option.score}
                  onChange={() => handleAnswer(question.id, option.score)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  answers[question.id] === option.score
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === option.score && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span className="text-gray-900">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={nextQuestion}
              disabled={!answers[question.id]}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentQuestion === testData.questions.length - 1 ? 'Complete Test' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
