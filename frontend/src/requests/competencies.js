import { API_BASE_URL } from '../config/api';

export async function fetchCompetencies() {
  const res = await fetch(`${API_BASE_URL}/api/competencies`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchCompetenciesBySchoolId(school_id) {
  const res = await fetch(`${API_BASE_URL}/api/competencies${school_id ? `?school_id=${school_id}` : ''}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addCompetency({ name, school_id }) {
  const res = await fetch(`${API_BASE_URL}/api/competencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, school_id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteCompetency(id) {
  const res = await fetch(`${API_BASE_URL}/api/competencies/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
