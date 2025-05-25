export async function fetchClassesBySchoolAndGrade(school_name, grade, cb) {
  const res = await fetch(`/classes/by-school-and-grade?school_name=${encodeURIComponent(school_name)}&grade=${grade}`);
  const data = await res.json();
  cb(data);
}

export async function addClass({ grade, name, school_id }, cb) {
  const res = await fetch('classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade, name, school_id }),
  });
  const data = await res.json();
  cb(data);
}