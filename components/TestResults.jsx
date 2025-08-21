'use client'

import { useState } from 'react'
import { Trophy, BarChart3, ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react'

const TestResults = ({ testData, onPrev, onReset }) => {
  const [results] = useState({
    score: 57,
    percentage: 90,
    rank: '13/36',
    categories: [
      { name: 'Continuous Learning', percentage: 100, color: 'bg-green-500' },
      { name: 'Creative Imagination', percentage: 66, color: 'bg-blue-500' },
      { name: 'Adaptability & Agility', percentage: 23, color: 'bg-yellow-500' },
      { name: 'Reliability', percentage: 88, color: 'bg-purple-500' }
    ]
  })

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
        </div>

        {/* Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Strengths</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Candidates excel in Continuous Learning and Reliability, showing strong potential for growth and dependability.
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
                    Adaptability & Agility scores are lower, suggesting candidates may need support in handling change.
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



