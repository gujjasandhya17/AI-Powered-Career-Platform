# API Documentation

Base URL (local): `http://localhost:5000/api`

All protected endpoints require header:
`Authorization: Bearer <JWT_TOKEN>`

---

## Health

### GET `/health`

- Description: API health check
- Auth: No
- Response:

```json
{
  "success": true,
  "message": "Career Platform API is running",
  "timestamp": "2026-04-24T00:00:00.000Z"
}
```

---

## Auth

### POST `/auth/signup`

- Description: Register a new user
- Auth: No
- Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### POST `/auth/login`

- Description: Login existing user
- Auth: No
- Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET `/auth/me`

- Description: Get current logged-in user
- Auth: Yes

---

## Dashboard

### GET `/dashboard`

- Description: Fetch dashboard data (user + latest resume + recent quiz attempts)
- Auth: Yes

---

## Resume Analyzer

### POST `/resume/analyze`

- Description: Analyze resume and save result
- Auth: Yes
- Request mode 1 (JSON):

```json
{
  "resumeText": "your resume text..."
}
```

- Request mode 2 (form-data):
  - key: `resume`
  - file: PDF or TXT (max 2MB)

- Response fields:
  - `score` (0-100)
  - `matchedSkills`
  - `missingSkills`
  - `suggestions`

---

## Quiz

### POST `/quiz/questions`

- Description: Create MCQ question
- Auth: Yes
- Body:

```json
{
  "questionText": "What is Node.js?",
  "options": ["Runtime", "Database", "Framework", "Language"],
  "correctAnswerIndex": 0,
  "category": "Node",
  "difficulty": "easy"
}
```

### GET `/quiz/questions`

- Description: Fetch all quiz questions (without answers)
- Auth: Yes

### POST `/quiz/submit`

- Description: Submit quiz answers and compute score
- Auth: Yes
- Body:

```json
{
  "answers": [
    {
      "questionId": "<question_id>",
      "selectedOption": 1
    }
  ]
}
```

### GET `/quiz/history`

- Description: Get logged-in user's quiz attempts
- Auth: Yes

---

## Common Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```
