// MIVA AI API Client

export async function sendChatMessage({ message, chatId = 'default', language = 'en', userId = 'u-01', userName = 'Operator' }) {
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chatId, language, userId, userName })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to process message.');
  }

  return response.json();
}

export async function analyzeEquipmentImage({ file, sampleId, query = '', language = 'en', userId = 'u-01', chatId = 'default' }) {
  if (file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('query', query);
    formData.append('language', language);
    formData.append('userId', userId);
    formData.append('chatId', chatId);

    const response = await fetch('/api/vision/analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to analyze equipment image.');
    return response.json();
  } else {
    const response = await fetch('/api/vision/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sampleId, query, language, userId, chatId })
    });

    if (!response.ok) throw new Error('Failed to analyze sample equipment image.');
    return response.json();
  }
}

export async function fetchSampleImages() {
  const res = await fetch('/api/vision/samples');
  if (!res.ok) return [];
  const data = await res.json();
  return data.samples || [];
}

export async function fetchProductionLines() {
  const res = await fetch('/api/knowledge/lines');
  if (!res.ok) return [];
  const data = await res.json();
  return data.lines || [];
}

export async function fetchGovernedDocuments(filter = {}) {
  const queryParams = new URLSearchParams(filter).toString();
  const res = await fetch(`/api/knowledge/documents?${queryParams}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.documents || [];
}

export async function uploadGovernedPDF(formData) {
  const res = await fetch('/api/knowledge/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function updateDocumentStatus(docId, status) {
  const res = await fetch(`/api/knowledge/documents/${docId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function fetchRiskAlerts() {
  const res = await fetch('/api/alerts');
  if (!res.ok) return [];
  const data = await res.json();
  return data.alerts || [];
}

export async function updateRiskAlertStatus(alertId, status, resolvedBy, resolutionNotes) {
  const res = await fetch(`/api/alerts/${alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolvedBy, resolutionNotes })
  });
  return res.json();
}

export async function fetchWorkInstructions() {
  const res = await fetch('/api/work-instructions');
  if (!res.ok) return [];
  const data = await res.json();
  return data.workInstructions || [];
}

export async function reviewWorkInstruction(wiId, action, comments) {
  const res = await fetch(`/api/work-instructions/${wiId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, comments })
  });
  return res.json();
}

export async function runBenchmarkEvaluation() {
  const res = await fetch('/api/evaluation/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Benchmark failed');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch('/api/evaluation/audit-logs');
  if (!res.ok) return [];
  const data = await res.json();
  return data.logs || [];
}

export async function fetchDevelopers() {
  const res = await fetch('/api/developers');
  if (!res.ok) return [];
  const data = await res.json();
  return data.developers || [];
}

export async function updateDeveloper(id, updates) {
  const res = await fetch(`/api/developers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}
