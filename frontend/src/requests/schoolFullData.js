import { API_BASE_URL } from '../config/api';

/**
 * Fetch all data for a school in a single request
 * Returns: { school, competencies, classes (with nested tasks) }
 */
export async function fetchSchoolFullData(schoolId, cb) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schools/${schoolId}/full-data`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    cb(data);
  } catch (error) {
    console.error('Error fetching full school data:', error);
    cb(null);
  }
}
