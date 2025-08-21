'use client'

import { useState, useEffect } from 'react'
import { Trophy, BarChart3, ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react'

const TestResults = ({ testData, onPrev, onReset }) => {
  // Generate dynamic results based on testData
  const generateResults = () => {
    console.log('generateResults called with testData:', testData)
    
    if (!testData || !testData.questions || testData.questions.length === 0) {
      console.log('No test data or questions found')
      return {
        score: 0,
        percentage: 0,
        rank: 'N/A',
        categories: []
      }
    }

    console.log('Questions found:', testData.questions)
    
    // Calculate categories from questions
    const categoryMap = {}
    testData.questions.forEach(question => {
      console.log('Processing question:', question)
      if (question.tag) {
        if (!categoryMap[question.tag]) {
          categoryMap[question.tag] = { count: 0, totalScore: 0 }
        }
        categoryMap[question.tag].count++
        // Use the highest possible score for each question as a baseline
        const maxScore = Math.max(...question.options.map(opt => opt.score))
        categoryMap[question.tag].totalScore += maxScore
        console.log(`Category ${question.tag}: count=${categoryMap[question.tag].count}, totalScore=${categoryMap[question.tag].totalScore}`)
      } else {
        console.log('Question has no tag:', question)
      }
    })

    console.log('Category map:', categoryMap)

    const categories = Object.keys(categoryMap).map(tag => {
      const { count, totalScore } = categoryMap[tag]
      const percentage = Math.round((totalScore / (count * 10)) * 100) // Assuming max score is 10
      return {
        name: tag,
        percentage: percentage,
        color: percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
      }
    })

    console.log('Generated categories:', categories)

    const result = {
      score: testData.questions.length * 10, // Total possible score
      percentage: categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + cat.percentage, 0) / categories.length) : 0,
      rank: '1/1', // Default rank for new test
      categories: categories
    }
    
    console.log('Final result:', result)
    return result
  }

  const [results, setResults] = useState(generateResults())
  
  // Regenerate results when testData changes
  useEffect(() => {
    console.log('TestResults useEffect - testData changed:', testData)
    const newResults = generateResults()
    console.log('TestResults useEffect - new results:', newResults)
    setResults(newResults)
  }, [testData])
  
  // Debug logging
  console.log('TestResults - testData:', testData)
  console.log('TestResults - generated results:', results)
  console.log('TestResults - categories:', results.categories)

  const getCategoryColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCategoryBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-blue-100'
    if (percentage >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test Results
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here's how your test is performing and insights into candidate responses
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overall Score Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{results.score}</div>
              <div className="text-sm text-blue-600 font-medium">Score</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
              <div className="text-sm text-green-600 font-medium">Percentage</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{results.rank}</div>
              <div className="text-sm text-purple-600 font-medium">Rank</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          {results.categories.length > 0 ? (
            <div className="space-y-4">
              {results.categories.map((category, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <span className={`font-bold ${getCategoryColor(category.percentage)}`}>
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No categories found. Debug info:</p>
              <p className="text-xs mt-2">testData.questions: {testData?.questions?.length || 0}</p>
              <p className="text-xs">results.categories: {results.categories.length}</p>
              <p className="text-xs">testData: {JSON.stringify(testData, null, 2)}</p>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Your Strengths</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {(() => {
                      const strengths = results.categories.filter(c => c.percentage >= 70)
                      console.log('Strengths filter result:', strengths)
                      console.log('All categories:', results.categories)
                      return strengths.length > 0 ? (
                        <>
                          {strengths.map(c => c.name).join(', ')} are areas where you excel.
                        </>
                      ) : (
                        'Focus on building consistent strengths across all categories.'
                      )
                    })()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Areas for Development</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {results.categories.filter(c => c.percentage < 50).length > 0 ? (
                      <>
                        {results.categories.filter(c => c.percentage < 50).map(c => c.name).join(', ')} could be areas to focus on for behavioral improvement.
                      </>
                    ) : (
                      'No specific areas identified - you\'re performing well across all categories!'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            onClick={onReset}
            className="btn-primary flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Create New Test</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestResults



