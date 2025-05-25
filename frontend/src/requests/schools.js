export async function fetchSchools(cb) {
  const res = await fetch('/api/schools');
  const data = await res.json();
  cb(data);
}