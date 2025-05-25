export async function fetchSchools(cb) {
  const res = await fetch('/schools');
  const data = await res.json();
  cb(data);
}