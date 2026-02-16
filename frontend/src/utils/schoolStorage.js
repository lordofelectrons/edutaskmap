// Utility functions for persisting selected school in localStorage

const STORAGE_KEY = 'selectedSchoolId';

/**
 * Save the selected school ID to localStorage
 * @param {number} schoolId - The ID of the school to save
 */
export function saveSelectedSchoolId(schoolId) {
  try {
    if (schoolId) {
      localStorage.setItem(STORAGE_KEY, String(schoolId));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving selected school to localStorage:', error);
  }
}

/**
 * Get the saved school ID from localStorage
 * @returns {number|null} The saved school ID or null if not found
 */
export function getSavedSchoolId() {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY);
    return savedId ? parseInt(savedId, 10) : null;
  } catch (error) {
    console.error('Error reading selected school from localStorage:', error);
    return null;
  }
}

/**
 * Clear the saved school ID from localStorage
 */
export function clearSavedSchoolId() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing selected school from localStorage:', error);
  }
}
