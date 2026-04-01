# Project Structure

```
erp-frontend/
├── public/
│   └── app-logo.png              # App logo image served at /app-logo.png
│
├── src/
│   ├── main.jsx                  # Entry point — mounts <App /> into #root
│   ├── App.jsx                   # Router, provider tree, route definitions
│   ├── index.css                 # Tailwind base + custom utility classes
│   │
│   ├── contexts/                 # Global React contexts (state shared app-wide)
│   │   ├── AuthContext.jsx       # User session state (login / logout / register)
│   │   ├── NotificationContext.jsx  # TopBar flash message system
│   │   └── AnimationContext.jsx  # Framer Motion variants + easing presets
│   │
│   ├── utils/
│   │   └── auth.js               # Auth helper functions (mock implementation)
│   │
│   └── components/
│       ├── AppLogo.jsx           # <AppLogo /> image component
│       ├── LandingPage.jsx       # Public marketing / landing page
│       ├── NotFound.jsx          # 404 page used inside the dashboard shell
│       │
│       ├── auth/
│       │   ├── LoginPage.jsx     # Split-panel login form
│       │   └── RegisterPage.jsx  # Registration form
│       │
│       ├── dashboard/
│       │   ├── Dashboard.jsx     # Shell layout — sidebar + topbar + <Outlet>
│       │   ├── Sidebar.jsx       # Responsive nav sidebar (3 modes)
│       │   └── TopBar.jsx        # Top header bar
│       │
│       └── modules/              # One sub-folder per ERP module
│           └── Password.jsx      # Password module page (placeholder)
│
├── docs/                         # ← You are here — project documentation
│
├── tailwind.config.js            # Design tokens, color palette
├── postcss.config.js             # PostCSS pipeline (Tailwind + Autoprefixer)
├── vite.config.js                # Vite build config
├── package.json                  # Dependencies and npm scripts
├── index.html                    # HTML shell (Vite entry point)
└── .gitignore
```

---

## Key Relationships

```
main.jsx
  └── App.jsx
        ├── AnimationProvider     (outermost — no router dependency)
        │   └── NotificationProvider
        │       └── AuthProvider
        │           └── BrowserRouter
        │               └── AppRoutes (route definitions)
        │                     ├── LandingPage       /
        │                     ├── LoginPage         /login
        │                     ├── RegisterPage      /register
        │                     └── Dashboard         /dashboard  ← protected
        │                           ├── Password    /dashboard/password
        │                           └── NotFound    /dashboard/*
```

---

## Adding a New File

| What                 | Where                                   |
| -------------------- | --------------------------------------- |
| New ERP module page  | `src/components/modules/YourModule.jsx` |
| New shared component | `src/components/YourComponent.jsx`      |
| New context          | `src/contexts/YourContext.jsx`          |
| New utility function | `src/utils/yourUtil.js`                 |
| New auth page        | `src/components/auth/YourAuthPage.jsx`  |
