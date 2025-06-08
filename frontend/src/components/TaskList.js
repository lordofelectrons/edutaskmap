import React, { useEffect, useState } from 'react'
import { fetchTasks } from '../requests/tasks'

const TaskList = ({ classId }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchTasksAsync = async () => {
    try {
      await fetchTasks(classId, setTasks)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchTasksAsync();
  }, [classId]);

  const handleTaskAdded = () => {
    fetchTasks()
    setShowAddForm(false)
  }

  if (loading) return <p>Loading tasks…</p>
  if (error) return <p>Завдання не знайдені!</p>
  if (!tasks.length) return <p>No tasks available</p>

  return (
    <div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      {showAddForm ? (
        <>
          <AddTaskForm classId={classId} onTaskAdded={handleTaskAdded} />
          <button
            className="cancel-button"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="add-task-button"
          onClick={() => setShowAddForm(true)}
        >
          Add Task
        </button>
      )}
    </div>
  )
}

export default TaskList