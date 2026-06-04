# Backend — UncommonApp

This directory contains a minimal Node.js + Express + Sequelize scaffold for the UncommonApp backend.

Quick start
1. cd backend
2. cp .env.example .env
3. npm install
4. npm run dev

Structure
- src/: application source
  - config/: DB and configuration
  - controllers/: request handlers
  - models/: Sequelize models
  - routes/: Express routers
  - middleware/: Express middleware
- migrations/: Sequelize migrations
- seeders/: Sequelize seed files

Notes
- This creates a small skeleton so you can iterate quickly. Implement models and controllers inside `src/models` and `src/controllers`.
- Do not commit `.env` (use `.env.example` as the template).
