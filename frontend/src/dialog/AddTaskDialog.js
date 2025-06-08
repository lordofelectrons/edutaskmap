import React, { useState } from 'react'
import { addTask } from '../requests/tasks'

const AddTaskDialog = ({ classId, onTaskAdded }) => {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    try {
      addTask({ text, classId }, async () => {
        setText('')
        onTaskAdded()
      });
    } catch (err) {
      console.error('Failed to add task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task title"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting || !text.trim()}>
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

export default AddTaskDialog