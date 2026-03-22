import { API_BASE_URL } from '../config/api';

export async function fetchClassesBySchoolAndGrade(school_name, grade) {
  const res = await fetch(`${API_BASE_URL}/api/classes/by-school-and-grade?school_name=${encodeURIComponent(school_name)}&grade=${grade}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addClass({ grade, name, school_id }) {
  const res = await fetch(`${API_BASE_URL}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade, name, school_id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteClass(id) {
  const res = await fetch(`${API_BASE_URL}/api/classes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
