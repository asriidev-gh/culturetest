'use client'

import { useState } from 'react'
import Header from '../components/Header'
import TestCreation from '../components/TestCreation'
import TestQuestions from '../components/TestQuestions'
import TestShare from '../components/TestShare'
import TestResults from '../components/TestResults'

export default function Home() {
  const [testData, setTestData] = useState({
    name: '',
    behaviors: '',
    questions: [],
    currentStep: 1
  })

  const updateTestData = (newData) => {
    setTestData(prev => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    setTestData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
  }

  const prevStep = () => {
    setTestData(prev => ({ ...prev, currentStep: prev.currentStep - 1 }))
  }

  const resetTest = () => {
    setTestData({
      name: '',
      behaviors: '',
      questions: [],
      currentStep: 1
    })
  }

  const renderCurrentStep = () => {
    switch (testData.currentStep) {
      case 1:
        return (
          <TestCreation 
            testData={testData}
            updateTestData={updateTestData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <TestQuestions 
            testData={testData}
            updateTestData={updateTestData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <TestShare 
            testData={testData}
            onPrev={prevStep}
            onNext={nextStep}
          />
        )
      case 4:
        return (
          <TestResults 
            testData={testData}
            onPrev={prevStep}
            onReset={resetTest}
          />
        )
      default:
        return (
          <TestCreation 
            testData={testData}
            updateTestData={updateTestData}
            onNext={nextStep}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {renderCurrentStep()}
      </main>
    </div>
  )
}
