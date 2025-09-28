import { API_BASE_URL } from '../config/api';

export async function fetchSchools(cb) {
  const res = await fetch(`${API_BASE_URL}/api/schools`);
  const data = await res.json();
  cb(data);
}

export async function addSchool({ name }, cb) {
  const res = await fetch(`${API_BASE_URL}/api/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  cb(data);
}

export async function deleteSchool(id, cb) {
  const res = await fetch(`${API_BASE_URL}/api/schools/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  cb(data);
}