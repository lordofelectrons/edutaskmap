import { API_BASE_URL } from '../config/api';

export async function fetchSchools() {
  const res = await fetch(`${API_BASE_URL}/api/schools`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addSchool({ name }) {
  const res = await fetch(`${API_BASE_URL}/api/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteSchool(id) {
  const res = await fetch(`${API_BASE_URL}/api/schools/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
