'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const TestContext = createContext()

export const useTestContext = () => {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider')
  }
  return context
}

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState([])
  const [results, setResults] = useState([])
  const [analytics, setAnalytics] = useState({})

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem('cultureTests')
    const savedResults = localStorage.getItem('cultureTestResults')
    
    if (savedTests) {
      setTests(JSON.parse(savedTests))
    }
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cultureTests', JSON.stringify(tests))
  }, [tests])

  useEffect(() => {
    localStorage.setItem('cultureTestResults', JSON.stringify(results))
  }, [results])

  // Calculate analytics for a specific test
  const calculateAnalytics = (testId) => {
    const testResults = results.filter(r => r.testId === testId)
    
    if (testResults.length === 0) {
      return {
        views: 0,
        starts: 0,
        submissions: 0,
        completion: 0
      }
    }

    const views = testResults.length
    const starts = testResults.filter(r => r.started).length
    const submissions = testResults.filter(r => r.completed).length
    const completion = starts > 0 ? Math.round((submissions / starts) * 100) : 0

    return { views, starts, submissions, completion }
  }

  // Create a new test
  const createTest = (testData) => {
    const testId = Date.now().toString()
    const newTest = {
      id: testId,
      ...testData,
      createdAt: new Date().toISOString(),
      analytics: calculateAnalytics(testId)
    }
    
    setTests(prev => [...prev, newTest])
    return newTest
  }

  // Record test start
  const recordTestStart = (testId) => {
    const newResult = {
      id: Date.now().toString(),
      testId,
      started: true,
      completed: false,
      startedAt: new Date().toISOString(),
      answers: {},
      score: 0,
      percentage: 0,
      rank: 0
    }
    
    setResults(prev => [...prev, newResult])
  }

  // Record test completion
  const recordTestCompletion = (testId, answers, score, percentage) => {
    const existingResult = results.find(r => r.testId === testId && !r.completed)
    
    if (existingResult) {
      const updatedResult = {
        ...existingResult,
        completed: true,
        completedAt: new Date().toISOString(),
        answers,
        score,
        percentage
      }
      
      setResults(prev => prev.map(r => 
        r.id === existingResult.id ? updatedResult : r
      ))
    }
  }

  // Get test by ID
  const getTestById = (testId) => {
    return tests.find(t => t.id === testId)
  }

  // Get analytics for a test
  const getTestAnalytics = (testId) => {
    return calculateAnalytics(testId)
  }

  // Get all results for a test
  const getTestResults = (testId) => {
    return results.filter(r => r.testId === testId && r.completed)
  }

  // Calculate ranking for a test
  const calculateRanking = (testId, score) => {
    const testResults = getTestResults(testId)
    if (testResults.length === 0) return '1/1'
    
    const sortedResults = testResults.sort((a, b) => b.score - a.score)
    const rank = sortedResults.findIndex(r => r.score === score) + 1
    
    return `${rank}/${testResults.length}`
  }

  const value = {
    tests,
    results,
    analytics,
    createTest,
    recordTestStart,
    recordTestCompletion,
    getTestById,
    getTestAnalytics,
    getTestResults,
    calculateRanking
  }

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}
