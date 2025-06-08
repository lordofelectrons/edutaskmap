export async function fetchTasks(classId, cb) {
  const res = await fetch(`/api/classes/${classId}/tasks`);
  const data = await res.json();
  cb(data);
}