# Portfolio Backend

A RESTful API backend for a personal portfolio website, built with Node.js, Express, TypeScript, and MongoDB. Deployed on Render.

---

## Tech Stack

- **Runtime** — Node.js
- **Language** — TypeScript
- **Framework** — Express.js
- **Database** — MongoDB (Mongoose)
- **Auth** — JWT Middleware
- **Email** — Nodemailer (mail config + templates)
- **Deployment** — Render

---

## Features

| Feature        | Description                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio Data | Serves education, experience, project, and skill data from JSON files                                                                                 |
| Blog           | Markdown-based blog posts (Bug Report, Playwright, Rest Assured setup guides)                                                                         |
| Contact        | Contact form with email notification via Nodemailer                                                                                                   |
| Skills         | Categorised skill sets — language, security, testing (API, DB, performance, security, UI), web (backend, DB, deployment, frontend, monitoring, tools) |
| Music          | Private music feature (not open source — see licence)                                                                                                 |
| Auth           | JWT-based authentication middleware                                                                                                                   |

---

## Folder Structure

```
portfolio-backend/
├── public/
│   ├── blogs/              # Markdown blog posts
│   ├── education/          # Education data (JSON)
│   ├── experience/         # Experience data (JSON)
│   ├── projects/           # Project data (JSON)
│   └── skills/             # Skill sets by category (JSON)
│       ├── language/
│       ├── security/
│       ├── test/           # api, database, performance, security, ui
│       └── web/            # backend, database, deployment, frontend, monitoring, tools
└── src/
    ├── configs/            # DB and mail configuration
    ├── controllers/        # Route controllers (contact, music, user)
    ├── middlewares/        # Auth middleware
    ├── models/             # Mongoose models
    ├── routes/             # Express route definitions
    ├── schemas/            # Validation schemas
    ├── service/            # Business logic / services
    ├── templates/          # Email templates
    ├── types/              # TypeScript type definitions
    ├── utils/              # Utility helpers
    ├── validators/         # Request validators
    ├── app.ts              # Express app setup
    └── index.ts            # Server entry point
```

---

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB instance

**1. Clone the repository**

```bash
git clone https://github.com/GyanaprakashKhandual/portfolio-backend.git
cd portfolio-backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.local .env
```

Fill in the required values (see `.env` for keys).

**4. Run in development**

```bash
npm run dev
```

**5. Build for production**

```bash
npm run build
npm start
```

---

## Environment Files

| File              | Purpose             |
| ----------------- | ------------------- |
| `.env.local`      | Local development   |
| `.env.staging`    | Staging environment |
| `.env.production` | Production (Render) |

---

## Deployment

This project is deployed on **Render**. Connect your GitHub repository to a Render Web Service and configure environment variables in the Render dashboard.

---

## Licence

This project is open source under the MIT Licence — see [LICENSE](./LICENSE) for details.

**Exception:** The music feature (`src/controllers/music.controller.ts`, `src/routes/music.route.ts`, `src/models/music.model.ts`, `src/schemas/music.schema.ts`, `src/types/music.type.ts`) is **not open source** and all rights are reserved.

---

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
