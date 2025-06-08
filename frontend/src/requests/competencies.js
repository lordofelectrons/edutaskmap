export async function fetchCompetencies(cb) {
  const res = await fetch('/api/competencies');
  const data = await res.json();
  cb(data);
}

export async function fetchCompetenciesBySchoolId(school_id, cb) {
  const res = await fetch(`/api/competencies?school_id=${school_id}`);
  const data = await res.json();
  cb(data);
}

export async function addCompetency({ name, school_id }, cb) {
  const res = await fetch('/api/competencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, school_id }),
  });
  const data = await res.json();
  cb(data);
}