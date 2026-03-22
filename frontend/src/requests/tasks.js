import { API_BASE_URL } from '../config/api';

export async function fetchTasks(classId) {
  const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/tasks`);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function addTask({ description, classId }) {
  const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
