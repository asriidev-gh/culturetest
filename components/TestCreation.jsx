'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Target, ArrowRight } from 'lucide-react'

const TestCreation = ({ testData, updateTestData, onNext }) => {
  const [formData, setFormData] = useState({
    name: testData.name || '',
    behaviors: testData.behaviors || ''
  })

  // Update form data when testData changes (e.g., when coming back from other steps)
  useEffect(() => {
    setFormData({
      name: testData.name || '',
      behaviors: testData.behaviors || ''
    })
  }, [testData.name, testData.behaviors])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() && formData.behaviors.trim()) {
      updateTestData(formData)
      onNext()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isButtonDisabled = !formData.name.trim() || !formData.behaviors.trim()

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Target className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Define Your Test
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start by describing what behaviors and attitudes you want to assess in your candidates
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Test Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Leadership Assessment, Team Collaboration Test"
              className="input-field text-lg"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Give your test a descriptive name that reflects what you're assessing
            </p>
          </div>

          <div>
            <label htmlFor="behaviors" className="block text-sm font-medium text-gray-700 mb-2">
              Test Behaviors
            </label>
            <textarea
              id="behaviors"
              name="behaviors"
              value={formData.behaviors}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the behaviors, attitudes and mindsets you want your candidates to show day to day. What does 'great' look like in your company?"
              className="input-field resize-none"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Be specific about the cultural values and behaviors that matter most to your organization
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Pro Tip</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Focus on observable behaviors rather than abstract concepts. Instead of "good communication," 
                  think "actively listens and asks clarifying questions."
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue to Questions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TestCreation
