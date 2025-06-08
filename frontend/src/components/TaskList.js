import React, { useEffect, useState } from 'react'
import { fetchTasks } from '../requests/tasks'
import AddTaskDialog from '../dialog/AddTaskDialog';

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
    fetchTasks(classId, setTasks)
    setShowAddForm(false)
  }

  return (
    <div>
      {loading ? (<p>Loading tasks…</p>) : 
        error ? <p>Завдання не знайдені!</p> :
          (<ul className="task-list">
            {tasks?.map(task => (
              <li key={task.id}>{task.description}</li>
            ))}
          </ul>)
      }
      {showAddForm ? (
        <>
          <AddTaskDialog classId={classId} onTaskAdded={handleTaskAdded} />
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