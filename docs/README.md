# SportswearERP — Frontend Documentation

## Overview

This is the React frontend for the SportswearERP system — a multi-module ERP application built for sportswear businesses.  
The frontend is a **single-page application (SPA)** powered by Vite + React 18.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (default port 5175)
npm run dev -- --port 5175

# Production build
npm run build

# Preview production build
npm run preview
```

### Test Credentials

| Email                  | Password    |
| ---------------------- | ----------- |
| `admin@sportswear.erp` | `Admin@123` |

---

## Tech Stack

| Tool             | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| React            | 18.3    | UI framework            |
| Vite             | 5.2     | Build tool & dev server |
| React Router DOM | 6.22    | Client-side routing     |
| Tailwind CSS     | 3.4     | Utility-first styling   |
| Framer Motion    | 12      | Animations              |
| Lucide React     | 0.344   | Icon library            |

---

## Documentation Index

| File                                           | What it covers                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| [Project-Structure.md](./Project-Structure.md) | Folder layout and what each file does                            |
| [Routing.md](./Routing.md)                     | How routes are defined, protected routes, how to add a new route |
| [Contexts.md](./Contexts.md)                   | All React contexts — Auth, Notification, Animation               |
| [Sidebar.md](./Sidebar.md)                     | NAV tree schema, how to add/nest nav items                       |
| [Dashboard.md](./Dashboard.md)                 | Shell layout, sidebar modes, responsive behavior                 |
| [Styling.md](./Styling.md)                     | Tailwind tokens, color system, custom utilities                  |
| [Animations.md](./Animations.md)               | AnimationContext, Framer Motion variants, adding new animations  |
| [Auth.md](./Auth.md)                           | Auth utilities, sessions, permissions, replacing with a real API |
| [Adding-a-Module.md](./Adding-a-Module.md)     | Step-by-step guide to add a new feature module end-to-end        |
