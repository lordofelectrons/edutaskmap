export async function fetchTasks(classId, cb) {
  const res = await fetch(`/api/classes/${classId}/tasks`);
  const data = await res.json();
  cb(data);
}

export async function addTask({ description, classId }, cb) {
  const res = await fetch(`/api/classes/${classId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  const data = await res.json();
  cb();
}