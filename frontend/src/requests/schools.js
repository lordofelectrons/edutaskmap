export function fetchSchools(callback) {
    fetch('http://localhost:3001/schools')
      .then(res => res.json())
      .then(data => callback)
      .catch(err => console.error('Failed to fetch schools:', err));
}