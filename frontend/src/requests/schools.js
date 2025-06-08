export async function fetchSchools(cb) {
  const res = await fetch('/api/schools');
  const data = await res.json();
  cb(data);
}

export async function addSchool({ name }, cb) {
  const res = await fetch('/api/schools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  cb(data);
}