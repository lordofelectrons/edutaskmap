import { API_BASE_URL } from '../config/api';

export async function fetchSchoolFullData(schoolId, { signal } = {}) {
  const res = await fetch(`${API_BASE_URL}/api/schools/${schoolId}/full-data`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
