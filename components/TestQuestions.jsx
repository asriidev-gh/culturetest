'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowLeft, Tag } from 'lucide-react'

const TestQuestions = ({ testData, updateTestData, onPrev, onNext }) => {
  const [questions, setQuestions] = useState(testData.questions.length > 0 ? testData.questions : [
    {
      id: 1,
      tag: 'Sample Category',
      question: 'This is a sample question. You can edit or delete it and create your own.',
      options: [
        { text: 'Option 1', score: 10, description: 'Highest score option' },
        { text: 'Option 2', score: 7, description: 'Medium-high score option' },
        { text: 'Option 3', score: 4, description: 'Medium-low score option' },
        { text: 'Option 4', score: 1, description: 'Lowest score option' }
      ]
    }
  ])

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      tag: '',
      question: '',
      options: [
        { text: 'Option 1', score: 10, description: 'Highest score option' },
        { text: 'Option 2', score: 7, description: 'Medium-high score option' },
        { text: 'Option 3', score: 4, description: 'Medium-low score option' },
        { text: 'Option 4', score: 1, description: 'Lowest score option' }
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId, optionIndex, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value }
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption = {
          text: `Option ${q.options.length + 1}`,
          score: Math.max(...q.options.map(o => o.score)) + 1,
          description: ''
        }
        return { ...q, options: [...q.options, newOption] }
      }
      return q
    }))
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = q.options.filter((_, index) => index !== optionIndex)
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const handleFinish = () => {
    if (questions.length > 0 && questions.every(q => q.tag && q.question)) {
      updateTestData({ questions })
      // Move to next step (TestShare)
      onNext()
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Tag className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Questions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add questions that assess the behaviors and attitudes you defined
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {index + 1}
              </h3>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Tag
                </label>
                <input
                  type="text"
                  value={question.tag}
                  onChange={(e) => updateQuestion(question.id, 'tag', e.target.value)}
                  placeholder="e.g., Ownership & Accountability, Team Collaboration"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  rows={3}
                  placeholder="Enter your question here..."
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Scoring Tip:</strong> Assign point values to each answer option. 
                    Higher points = better performance. You can use any scale (e.g., 1-10, 0-100, or custom).
                  </p>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(question.id, optionIndex, 'text', e.target.value)}
                          className="input-field"
                          placeholder={`Answer option ${optionIndex + 1}`}
                        />
                        <input
                          type="text"
                          value={option.description}
                          onChange={(e) => updateOption(question.id, optionIndex, 'description', e.target.value)}
                          className="input-field text-sm"
                          placeholder="Optional description"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Points:</label>
                        <input
                          type="number"
                          value={option.score}
                          onChange={(e) => updateOption(question.id, optionIndex, 'score', parseInt(e.target.value) || 0)}
                          className="input-field w-20 text-center"
                          placeholder="0"
                          min="0"
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove option"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question.id)}
                    className="btn-secondary text-sm py-2 px-3 w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Answer Option
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={addQuestion}
            className="btn-secondary flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Question</span>
          </button>
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
            onClick={handleFinish}
            disabled={questions.length === 0 || !questions.every(q => q.tag && q.question)}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue to Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestQuestions
