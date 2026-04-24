const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, { method = 'GET', token, body, isFormData = false } = {}) {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || 'Unexpected server response.' };
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getDashboard: (token) => request('/dashboard', { token }),
  analyzeResumeByText: (token, resumeText) =>
    request('/resume/analyze', {
      method: 'POST',
      token,
      body: { resumeText },
    }),
  analyzeResumeByFile: (token, file) => {
    const formData = new FormData();
    formData.append('resume', file);

    return request('/resume/analyze', {
      method: 'POST',
      token,
      body: formData,
      isFormData: true,
    });
  },
  getQuizQuestions: (token) => request('/quiz/questions', { token }),
  submitQuiz: (token, answers) => request('/quiz/submit', { method: 'POST', token, body: { answers } }),
  getQuizHistory: (token) => request('/quiz/history', { token }),
};
