export async function fetchSection(key, fallbackData) {
  try {
    const res = await fetch(`/api/content/${key}`);
    if (!res.ok) return fallbackData;
    return await res.json();
  } catch {
    return fallbackData;
  }
}

export async function submitInquiry(formData) {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error('Failed to send inquiry');
  return res.json();
}
