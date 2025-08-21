'use client'

import { useState, useEffect } from 'react'
import { Copy, Mail, Share2, ArrowLeft, Eye, Play, CheckCircle, TrendingUp, Plus } from 'lucide-react'
import { useTestContext } from '../contexts/TestContext'

const TestShare = ({ testData, onPrev }) => {
  const [copied, setCopied] = useState(false)
  const { createTest, getTestAnalytics } = useTestContext()
  const [testId, setTestId] = useState(null)
  const [analytics, setAnalytics] = useState({
    views: 0,
    starts: 0,
    submissions: 0,
    completion: 0
  })

  // Create test immediately when component mounts
  useEffect(() => {
    if (testData.name && testData.behaviors && testData.questions.length > 0) {
      console.log('Creating test with data:', testData)
      const newTest = createTest(testData)
      console.log('Created test:', newTest)
      setTestId(newTest.id)
      
      // Get initial analytics
      const initialAnalytics = getTestAnalytics(newTest.id)
      setAnalytics(initialAnalytics)
    }
  }, [testData.name, testData.behaviors, testData.questions.length]) // Only depend on the actual data, not the functions

  // Update analytics every few seconds to show real-time data
  useEffect(() => {
    if (testId) {
      const interval = setInterval(() => {
        const currentAnalytics = getTestAnalytics(testId)
        setAnalytics(currentAnalytics)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [testId]) // Only depend on testId

  const testLink = testId ? `https://culturetest.com/test/${testId}` : 'Generating...'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(testLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const openEmail = () => {
    const subject = encodeURIComponent(`Take the ${testData.name} test`)
    const body = encodeURIComponent(`Hi,\n\nI'd like you to take this behavioral assessment: ${testLink}\n\nThis will help us understand how well we might work together.\n\nBest regards`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const openShare = () => {
    if (navigator.share) {
      navigator.share({
        title: testData.name,
        text: `Take the ${testData.name} behavioral assessment`,
        url: testLink,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      copyLink()
    }
  }

  const openTestLink = () => {
    // Open the test in a new tab using the correct route
    console.log('Attempting to open test preview with ID:', testId)
    if (testId) {
      // Store the current test data in localStorage so the test page can access it
      const testDataForPreview = {
        id: testId,
        name: testData.name,
        behaviors: testData.behaviors,
        questions: testData.questions,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage for the test page to access
      localStorage.setItem('previewTestData', JSON.stringify(testDataForPreview))
      
      const testUrl = `/test/${testId}`
      console.log('Opening URL:', testUrl)
      console.log('Test data saved for preview:', testDataForPreview)
      
      // Open in new tab
      window.open(testUrl, '_blank')
    } else {
      console.log('No test ID available')
      alert('Test is still being created. Please wait a moment and try again.')
    }
  }

  const createNewTest = () => {
    // Reset and go back to step 1
    window.location.reload()
  }

  // Show loading state if test is still being created
  if (!testId) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Share2 className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creating Your Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please wait while we set up your test...
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="card">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Share2 className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Share Your Test
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your test is ready! Share it with candidates and track their responses
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Link</h3>
          
          {/* Debug info - remove this in production */}
          {testId && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Test ID:</strong> {testId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Internal Route:</strong> /test/{testId}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={testLink}
              readOnly
              className="input-field bg-gray-50"
            />
            <button
              onClick={copyLink}
              disabled={!testId}
              className="btn-primary px-4 py-2 whitespace-nowrap disabled:opacity-50"
            >
              {copied ? (
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Copied!</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={openTestLink}
              disabled={!testId}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Test</span>
            </button>
            <button
              onClick={openEmail}
              disabled={!testId}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={openShare}
              disabled={!testId}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Test Preview</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Click "Preview Test" to see exactly what examinees will see when they take your test.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{analytics.views}</div>
              <div className="text-sm text-blue-600">Views</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{analytics.starts}</div>
              <div className="text-sm text-green-600">Starts</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{analytics.submissions}</div>
              <div className="text-sm text-purple-600">Submissions</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{analytics.completion}%</div>
              <div className="text-sm text-orange-600">Completion</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Analytics update automatically as examinees take your test
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            onClick={createNewTest}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Test</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestShare
