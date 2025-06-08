import React, { useEffect, useState } from 'react'
import { fetchTasks } from '../requests/tasks'

const TaskList = ({ classId }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasksAsync = async () => {
      try {
        await fetchTasks(classId, setTasks)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    };
    fetchTasksAsync();
  }, [classId]);

  if (loading) return <p>Loading tasks…</p>
  if (error) return <p>Error loading tasks</p>
  if (!tasks.length) return <p>No tasks available</p>

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}

export default TaskList