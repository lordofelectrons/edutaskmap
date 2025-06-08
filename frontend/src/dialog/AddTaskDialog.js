import React, { useState } from 'react'
import { addTask } from '../requests/tasks'

const AddTaskDialog = ({ classId, onTaskAdded }) => {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)
    try {
      addTask({ description, classId }, () => {
        setDescription('')
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
        type="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task title"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting || !description.trim()}>
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

export default AddTaskDialog