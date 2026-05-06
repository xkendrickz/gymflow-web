# GymFlow Web

Frontend web application for the GymFlow Gym Management System, built with Vue.js 3 and Vuetify.

## Tech Stack

- **Vue.js 3** — Progressive JavaScript framework
- **TypeScript** — Type safety
- **Vuetify 3** — Material Design component library
- **Pinia** — State management
- **Vue Router** — Client-side routing
- **Axios** — HTTP client
- **Vue Toastification** — Toast notifications

## User Roles

| Role | Access |
|---|---|
| **Admin** | Instructor management |
| **Kasir** | Member management, activation, deposits, attendance |
| **Manajer Operasional** | Schedules, leave requests, operational reports |

## Prerequisites

- Node.js 18+
- npm or yarn
- [gymflow-api](https://github.com/xkendrickz/gymflow-api) running

## Getting Started
```bash
# Clone the repository
git clone https://github.com/xkendrickz/gymflow-web.git
cd gymflow-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```
```bash
# Run development server
npm run dev
```

App runs at `http://localhost:5173`

## Project Structure
```
src/
├── components/          # Reusable components
│   ├── AdminDashboard.vue
│   ├── KasirDashboard.vue
│   ├── MODashboard.vue
│   └── DashboardLayout.vue
├── views/               # Page components
│   ├── Admin/
│   ├── Kasir/
│   └── manajerOperasional/
├── stores/              # Pinia stores
│   └── auth.ts
├── router/              # Vue Router config
│   └── index.ts
└── lib/
    └── axios.ts         # Axios instance with interceptors
```

## Build for Production
```bash
npm run build
```

## Related Repositories

- [gymflow-api](https://github.com/xkendrickz/gymflow-api) — Laravel REST API backend
- [gymflow-mobile](https://github.com/xkendrickz/gymflow-android) — Kotlin Android app
- [gymflow](https://github.com/xkendrickz/gymflow) — Project overview
