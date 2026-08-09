# TherapySync — Frontend

React 19 SPA for a telehealth appointment platform. Supports two portals — Patient and Therapist — with secure session management, a full slot-booking wizard, recurring appointment series, and a role-aware dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router DOM 7 |
| Server state | TanStack React Query 5 |
| Client state | Zustand 5 |
| Forms | React Hook Form 7 + Zod |
| HTTP | Axios 1.19 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 13 |
| Testing | Vitest 4 + Testing Library |
| Linting | ESLint + oxlint + Prettier (Husky pre-commit) |

---

## Project Structure

```
src/
├── api/
│   └── axiosClient.ts              # Axios instance with silent-refresh interceptor
├── app/
│   ├── App.tsx                     # Root component tree
│   ├── QueryProvider.tsx           # TanStack Query client provider
│   └── SessionProvider.tsx        # Runs session bootstrap on mount
├── config/
│   ├── env.ts                      # Zod-validated import.meta.env
│   ├── routes.ts                   # All route path constants
│   ├── queryKeys.ts                # Centralised React Query key factory
│   ├── patientNavigation.ts        # Patient sidebar nav config
│   └── therapistNavigation.ts      # Therapist sidebar nav config
├── components/
│   ├── common/                     # DataTable, EmptyState, Logo, UserProfileBadge
│   ├── feedback/                   # ErrorBoundary, PageSpinner, ToastContainer
│   ├── layout/
│   │   ├── patient/                # Sidebar, desktop/mobile headers, bottom nav
│   │   └── therapist/              # Sidebar, desktop/mobile headers, bottom nav
│   └── ui/                         # Button, Input, Card, Badge, Modal, Select, Skeleton, etc.
├── features/
│   ├── auth/
│   │   ├── api/                    # authApi (login, register, refresh, logout, me)
│   │   ├── components/             # LoginForm, RegisterForm
│   │   ├── hooks/                  # useLogin, useLogout, useRegister, useSessionBootstrap
│   │   ├── schemas/                # Zod schemas for login and register forms
│   │   └── types/                  # Auth-specific TypeScript types
│   ├── appointments/
│   │   ├── api/                    # appointmentsApi (availability, hold, pay, cancel)
│   │   ├── components/             # DatePickerBar, SlotGrid, RecurringRuleSelector,
│   │   │                           # TherapistSelector, CheckoutModal, HoldCountdownBanner
│   │   └── hooks/                  # useAvailability, useSlotHold, useBookAppointment,
│   │                               # useBookRecurringAppointment
│   ├── patient/
│   │   ├── api/                    # patientApi (appointments, cancel, cancel series)
│   │   ├── components/             # AppointmentCard, PatientStatsGrid, AppointmentList
│   │   ├── hooks/                  # useCancelAppointment, usePatientAppointments
│   │   └── types/                  # Patient-specific types
│   ├── therapist/
│   │   ├── api/                    # therapistApi (schedule, agenda, stats, status update)
│   │   ├── components/             # WeeklyScheduleForm, AgendaList, WeeklyAvailabilityCalendar,
│   │   │                           # TherapistStatsGrid, ClinicalNotesModal
│   │   └── hooks/                  # useTherapistSchedule, useTherapistAgenda,
│   │                               # useUpdateAppointmentStatus, useTherapistCalendar
│   └── dashboard/
│       ├── api/                    # dashboardApi (role-aware GET /dashboard)
│       └── hooks/                  # useDashboard
├── hooks/
│   └── useNow.ts                   # Reactive current-time hook (for countdowns)
├── layouts/
│   ├── AuthLayout.tsx              # Unauthenticated shell
│   ├── PatientLayout.tsx           # Patient app shell
│   └── TherapistLayout.tsx         # Therapist app shell
├── pages/
│   ├── auth/                       # LoginPage, RegisterPage
│   ├── patient/                    # Dashboard, BookAppointment, Messages, Payments, Profile, Settings
│   └── therapist/                  # Dashboard, Appointments, Schedule, Availability, Patients,
│                                   # Messages, Reports, Settings
├── routes/
│   ├── index.tsx                   # createBrowserRouter — all routes, lazy-loaded pages
│   ├── ProtectedRoute.tsx          # Auth + role guard
│   └── PublicOnlyRoute.tsx         # Redirects authenticated users to their dashboard
├── stores/
│   ├── authStore.ts                # user, token, isAuthenticated + sessionStorage hint flag
│   ├── uiStore.ts                  # Modal state + toast queue
│   └── therapistStatusStore.ts     # Online/offline toggle (persisted to sessionStorage)
├── types/
│   ├── api.ts                      # CustomApiError, generic API types
│   └── auth.ts                     # User, UserRole
└── utils/
    ├── cn.ts                        # clsx + tailwind-merge
    └── formatters.ts               # Date/time formatters, booking error classifier
```

---

## Pages & Routes

| Path | Page | Access | Status |
|---|---|---|---|
| `/` | — | Public | Redirects to `/login` |
| `/login` | `LoginPage` | Public only | Email/password login |
| `/register` | `RegisterPage` | Public only | New patient registration |
| `/patient/dashboard` | `PatientDashboardPage` | PATIENT | Stats, upcoming session, active holds, appointments |
| `/patient/book` | `BookAppointmentPage` | PATIENT | Full slot booking wizard |
| `/patient/messages` | `PatientMessagesPage` | PATIENT | Coming soon |
| `/patient/payments` | `PatientPaymentsPage` | PATIENT | Coming soon |
| `/patient/profile` | `PatientProfilePage` | PATIENT | Coming soon |
| `/patient/settings` | `PatientSettingsPage` | PATIENT | Coming soon |
| `/therapist/dashboard` | `TherapistDashboardPage` | THERAPIST | Stats, today's agenda |
| `/therapist/appointments` | `TherapistAppointmentsPage` | THERAPIST | Appointment list + status updates |
| `/therapist/schedule` | `ScheduleManagementPage` | THERAPIST | Weekly schedule editor |
| `/therapist/availability` | `TherapistAvailabilityPage` | THERAPIST | Weekly calendar view |
| `/therapist/patients` | `TherapistPatientsPage` | THERAPIST | Coming soon |
| `/therapist/messages` | `TherapistMessagesPage` | THERAPIST | Coming soon |
| `/therapist/reports` | `TherapistReportsPage` | THERAPIST | Coming soon |
| `/therapist/settings` | `TherapistSettingsPage` | THERAPIST | Coming soon |

All pages are **lazy-loaded** via React `Suspense` for optimal bundle splitting.

---

## Auth & Session Flow

### Login / Register

`LoginForm` and `RegisterForm` use React Hook Form + Zod validation. On submit, `authApi.login()` / `authApi.register()` is called. On success:

- `authStore.setAuth(user, token)` stores the user and access token in memory.
- A `session_active = "1"` flag is written to `sessionStorage` as a signal that an httpOnly refresh cookie exists.
- The user is navigated to their role-appropriate dashboard.

### Session Bootstrap (Page Refresh)

`SessionProvider` runs `useSessionBootstrap` once on mount. The hook:

1. Checks `sessionStorage` for the `session_active` flag.
2. If **absent** — user has never logged in or explicitly logged out. `isBootstrapping = false` immediately. Login page renders instantly with no spinner.
3. If **present** — a refresh cookie likely exists. Calls `authApi.refresh()` (raw Axios, bypasses the interceptor to avoid circular refresh loops), then `authApi.getCurrentUser()` to rehydrate the store.
4. On success: `setAuth(user, token)` — user lands back on their dashboard.
5. On failure: `logout()` clears the flag and the user sees the login page.

A **module-level singleton promise** (`bootstrapPromise`) ensures the refresh call runs exactly once even under React Strict Mode's double-invoke of effects.

### Silent Refresh (In-App)

`axiosClient` response interceptor handles 401 errors:

1. If the failed request is not a retry and `refreshHasFailed` circuit is not tripped, all in-flight requests are **queued**.
2. A single `POST /auth/refresh` is made.
3. On success: the new token is stored, all queued requests are retried with the new `Authorization` header.
4. On failure: the `refreshHasFailed` circuit breaker is set, session is cleared, user is redirected to `/login`.

### Logout

`useLogout` calls `authApi.logout()` (fires and always resolves), then `authStore.logout()` which clears `session_active` from sessionStorage and resets all store state. TanStack Query cache is cleared to prevent stale data leaking between sessions.

### Route Protection

**`ProtectedRoute`** — Shows "Getting things ready..." spinner during bootstrap. Redirects to `/login` if not authenticated. Redirects to the user's own dashboard if they navigate to the wrong role's routes.

**`PublicOnlyRoute`** — Redirects already-authenticated users away from `/login` and `/register` to their dashboard.

---

## Patient Booking Flow

The booking wizard lives at `/patient/book` and follows these steps:

### 1. Select Therapist

`TherapistSelector` fetches `GET /therapists` (paginated). Each therapist card shows enriched profile data (specialisation, bio, avatar).

### 2. Select Date & Slots

`DatePickerBar` lets the patient navigate by day. `SlotGrid` calls `GET /appointments/availability?therapistId=&startDate=&endDate=` and renders available time slots as selectable cards.

### 3. Hold the Slot

Clicking a slot triggers `useSlotHold.startHold(slot, therapistId)`, which calls `POST /appointments/hold` with:

```json
{
  "therapistId": "...",
  "startTime": "2026-08-10T09:00:00.000Z",
  "endTime": "2026-08-10T09:30:00.000Z",
  "bookingType": "ONE_TIME"
}
```

The backend atomically acquires advisory locks and creates the `Appointment` row in `HOLD` status with a TTL. A `HoldCountdownBanner` displays the remaining seconds.

### 4. Recurring Booking (Optional)

`RecurringRuleSelector` lets the patient choose frequency (`WEEKLY`, `BI_WEEKLY`, etc.) and an end date. On confirm, `useBookRecurringAppointment`:

1. Calls `POST /appointments/hold` with `bookingType: RECURRING` and `recurrenceFrequency` + `recurrenceEndDate` — the backend creates `HOLD` rows for every occurrence in one atomic transaction.
2. Calls `POST /appointments/series/:seriesId/pay` — the backend confirms all holds to `SCHEDULED` in one atomic transaction.

### 5. Checkout

`CheckoutModal` shows the appointment summary. For one-time bookings, `POST /appointments/:holdId/pay` confirms the single appointment.

### 6. Confirmation

On success, TanStack Query cache is invalidated (dashboard, appointments, availability keys), a success toast is shown, and the user is navigated to the dashboard.

### 7. Cancel

- Single: `POST /appointments/:id/cancel`
- Series: `POST /appointments/series/:seriesId/cancel`

Both are accessible from the patient's appointment list.

---

## Therapist Flow

### Dashboard

`TherapistDashboardPage` fetches `GET /dashboard`. Displays:
- Stats grid: today's sessions, upcoming appointments, pending holds, total active patients, completed sessions.
- Today's agenda (`AgendaList`): chronological list of today's appointments with patient name, time, and status.

### Appointments

`TherapistAppointmentsPage` fetches `GET /appointments/therapist` with optional filters (status, date range). Therapists can:

- Mark appointments as `COMPLETED` or `NO_SHOW` via `PATCH /appointments/:id/status`.
- Add clinical session notes via `ClinicalNotesModal`.

### Schedule Management

`ScheduleManagementPage` fetches `GET /therapists/:id/schedule-config`. `WeeklyScheduleForm` lets therapists:

- Toggle which days of the week they work.
- Set start/end times for each day.
- Set a break window (start/end).
- Configure slot duration (e.g., 30 or 60 minutes).
- Configure buffer duration between slots (default 10 minutes).

Saved via `PUT /therapists/:id/schedule-config`.

### Availability Calendar

`TherapistAvailabilityPage` renders `WeeklyAvailabilityCalendar` — a visual weekly calendar view of the therapist's available and booked slots.

### Online Status

A toggle in the therapist header sets `therapistStatusStore.isOnline`. Persisted to `sessionStorage` — resets when the browser window is closed.

---

## State Management

| Store | What it holds | Persistence |
|---|---|---|
| `authStore` | `user`, `token`, `isAuthenticated` | In-memory. `session_active` flag in `sessionStorage` as bootstrap hint |
| `uiStore` | Active modal, modal data, toast queue | In-memory |
| `therapistStatusStore` | `isOnline` toggle | `sessionStorage` via Zustand `persist` middleware |

The access token is **never** written to `localStorage` or `sessionStorage` — it lives only in memory (`authStore`). Only the `session_active` hint flag (no sensitive data) is written to `sessionStorage`.

---

## API Layer

`axiosClient` is a configured Axios instance (`baseURL = VITE_API_BASE_URL`, `withCredentials: true`, 15s timeout):

- **Request interceptor**: attaches `Authorization: Bearer <token>` from `authStore` if a token is present.
- **Response interceptor**: unwraps the standard backend envelope `{ status, message, data }` — callers receive `data` directly. Handles 401 → silent refresh → retry. Transforms all errors into a typed `CustomApiError` with `message`, `errorCode`, `errors`, and `status` fields.

All API modules return typed responses. Errors propagate as `CustomApiError` and are handled in hooks via TanStack Query's `onError` / React Query `error` state.

---

## Environment Variables

Create a `.env` file from `.env.example`:

```env
# Backend API base URL — must include /v1 suffix
# Local dev:
VITE_API_BASE_URL=http://localhost:4000/api/v1
# Cross-origin HTTPS (DevTunnel, ngrok, staging):
# VITE_API_BASE_URL=https://your-tunnel.devtunnels.ms/api/v1

VITE_APP_ENV=development            # development | staging | production

# Must match SLOT_HOLD_DURATION_SECONDS in the backend
VITE_SLOT_HOLD_DURATION_SECONDS=60
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL

# Start development server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

---

## Design Decisions

**Why `sessionStorage` flag instead of persisting the token?**
Storing JWT access tokens in `localStorage` or `sessionStorage` exposes them to XSS attacks. The token lives only in memory (Zustand). The `session_active` flag carries no sensitive data — it's just a hint that tells the bootstrap logic "a refresh cookie probably exists, try to restore the session." If the flag is present but the cookie is gone (expired, cleared), the refresh call returns 401 and the flag is cleared.

**Why a module-level singleton promise for bootstrap?**
React Strict Mode intentionally mounts and unmounts effects twice in development. Without the singleton, the first effect run would start the refresh call, get cancelled by the cleanup, and the second run would either duplicate the call or skip it entirely. The module-level promise ensures exactly one refresh call per page load regardless of how many times React re-runs the effect.

**Why TanStack Query for server state + Zustand for client state?**
TanStack Query handles caching, background refetching, loading/error states, and cache invalidation for all server data. Zustand handles UI-only state (auth, toasts, modals) that doesn't need to be fetched or cached. Mixing them into one solution would create unnecessary complexity.

**Why lazy-load all pages?**
Splitting at the page level keeps the initial bundle small. The auth pages load immediately; the patient and therapist app shells are separate chunks that only load when navigated to.

**Why clear the TanStack Query cache on logout?**
React Query caches are keyed by query keys but stored in memory. Without clearing, a second user logging in on the same browser session could briefly see the previous user's data while the new queries are in flight.

**Why `withCredentials: true` on Axios?**
The refresh token is stored in an httpOnly cookie. Browsers only send cookies on cross-origin requests when `withCredentials: true` is set on the request and the server responds with `Access-Control-Allow-Credentials: true`. Without this, the silent refresh mechanism would never receive the cookie.
