# Creaflo – AI Content Assistant (Backend)

Creaflo is an AI-powered content assistant for creators, marketers, and small businesses.  
This repository contains the **backend API** for Creaflo: it receives prompts from the frontend, talks to the AI provider (e.g. OpenAI), and returns generated hooks, captions, and hashtags.

---

## ✨ Features

- REST API to generate:
  - Hooks / scroll-stoppers
  - Captions
  - Hashtags
- Supports multiple tones / platforms (depending on your implementation)
- Simple JSON-based request & response
- CORS-ready for frontend integration
- Optional persistence (PostgreSQL/Supabase) for history & analytics

---

## 💿 Tech Stack

- Node.js
- Express
- TypeScript
- OpenAI API
- PostgreSQL / Neon Postgres

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/creaflo-backend.git
cd creaflo-backend
npm install
```

### 2. Environment Variables

Create a .env file in the project root:

```bash
PORT = <your_port>
DATABASE_URL= <your_db_url>
JWT_SECRET = <your_jwt_secret>
OPENAI_API_KEY= <your-openai-api-key>
```

### 3. Run Locally

```bash
npm run dev
```

The api will be available at: http://localhost:<your-port>/api/v1
