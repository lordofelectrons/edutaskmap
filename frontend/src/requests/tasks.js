import { API_BASE_URL } from '../config/api';

export async function fetchTasks(classId, cb) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/tasks`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Ensure we always pass an array to the callback
    if (Array.isArray(data)) {
      cb(data);
    } else {
      console.error('API returned non-array data:', data);
      cb([]);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    cb([]);
  }
}

export async function addTask({ description, classId }, cb) {
  const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  await res.json();
  cb();
}

export async function deleteTask(id, cb) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  cb(data);
}