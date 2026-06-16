# ConnectUs — Complete Architectural Audit Report

> **Audited:** 2026-06-15  
> **Frontend:** Next.js 15 (App Router) — `ConnectUs_Frontend`  
> **Backend:** Express.js 5 + MongoDB + Socket.IO — `ConnectUs_Backend`

---

## Architecture Separation Score: **82 / 100**

The separation is fundamentally complete. All database models, controllers, routes, and server-side socket logic live exclusively in the backend. The frontend communicates only via HTTP APIs and `socket.io-client`. There are no critical architectural violations, but several medium-severity issues remain from the migration that need cleanup.

---

## 1. Architecture Separation Audit

### ✅ Passed Checks

| Check | Status |
|---|---|
| MongoDB / Mongoose in frontend | ✅ None found |
| Database queries in frontend | ✅ None found |
| JWT generation in frontend | ✅ None found |
| Password hashing (bcrypt) in frontend | ✅ None found |
| Cloudinary uploads in frontend | ✅ None found |
| Express-specific code in frontend | ✅ None found |
| Socket.IO **server** in frontend | ✅ None found |
| Server-side business logic in frontend | ✅ None found |

### ⚠️ Remaining Issues


---

## 2. API Layer Audit

### ✅ Passed Checks

- All CRUD operations go through `axios` → backend HTTP API ✅
- No direct database access in frontend ✅
- `withCredentials: true` used consistently on all authenticated requests ✅
- Error handling follows `try/catch` + `toast.error()` pattern ✅

### ⚠️ Issues




---

## 3. Authentication Audit

### ✅ Passed Checks

| Flow | Status |
|---|---|
| Login (`POST /api/auth/login`) | ✅ Sets httpOnly cookie, returns user data |
| Signup (`POST /api/auth/signup`) | ✅ Fixed: now sends `withCredentials: true` |
| Logout (`GET /api/auth/logout`) | ✅ Clears cookie, disconnects socket |
| Backend `protect` middleware | ✅ Verifies JWT on all `/api/*` routes except auth |
| Frontend middleware | ✅ Redirects unauthenticated users from `/home/*` |

### ⚠️ Issues

#### Issue 7: Frontend middleware only checks cookie existence, not validity

| | |
|---|---|
| **File** | [middleware.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/src/middleware.js#L6-L12) |
| **Problem** | A user can set a fake `token=anything` cookie and access `/home/*` pages. The backend API calls will fail with 401, but the user will see a broken page instead of being redirected to login. |
| **Impact** | Medium — UX degradation, not a security hole (backend still validates). |
| **Fix** | Either: (a) Re-add `jwtVerify` to middleware for proper client-side validation, or (b) Add a global auth check component that catches 401s from API calls and redirects to `/`. |



#### Issue 9: JWT expires in 1 hour with no refresh mechanism

| | |
|---|---|
| **File** | [jwt.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/utils/jwt.js#L16) |
| **Problem** | Token expires in 1h. There is no refresh token mechanism. After 1h, all API calls silently fail with 401. The user sees broken data rather than a login redirect. |
| **Impact** | Medium — poor UX for extended sessions. |
| **Fix** | Either extend token expiry to `7d` for a simpler flow, or implement a refresh token system. |

---

## 4. Socket.IO Audit

### ✅ Passed Checks

| Check | Status |
|---|---|
| Socket server only in backend | ✅ |
| Frontend uses only `socket.io-client` | ✅ |
| Room management (join/leave post, profile, chat) | ✅ |
| Reconnection logic with room re-joining | ✅ |
| Typing indicator with auto-expiry fail-safe | ✅ |
| Socket cleanup on disconnect | ✅ |
| Abort controller for resync API calls | ✅ |

### ⚠️ Issues

#### Issue 10: Socket CORS only allows `process.env.FRONTEND_URL`

| | |
|---|---|
| **File** | [socket/index.js:8-12](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/socket/index.js#L7-L12) |
| **Problem** | The Express CORS allows both `"http://localhost:3000"` and `process.env.FRONTEND_URL`. But the Socket.IO CORS only allows `process.env.FRONTEND_URL`. If `FRONTEND_URL` is different from `http://localhost:3000`, socket connections from localhost will fail even though API calls succeed. |
| **Impact** | Medium — inconsistent CORS between HTTP and WebSocket layers. |
| **Fix** | Align socket CORS with Express CORS: `origin: ["http://localhost:3000", process.env.FRONTEND_URL]`. |


#### Issue 12: Event listeners are registered inside `socket.on("connect")` — duplication risk

| | |
|---|---|
| **File** | [socket.js:176-322](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/src/lib/socket.js#L176-L322) |
| **Problem** | All `socket.on("get")`, `socket.on("post-like")`, etc. listeners are inside the `socket.on("connect")` callback. Every reconnect re-registers them without first removing old ones. This causes duplicate event handlers accumulating over time. |
| **Impact** | **High** — After N reconnections, each event fires N times. Messages appear duplicated, likes count multiply. This is a memory leak and functional bug. |
| **Fix** | Move all `socket.on(...)` listeners outside the `"connect"` handler (after `socket = io(...)` at line 39), or add `socket.off()` before re-registering inside the connect handler. |

---

## 5. Environment Variables Audit

### Frontend ([.env](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/.env))

| Variable | Status |
|---|---|
| `PORT=3000` | ✅ Matches backend CORS |
| `NODE_ENV=development` | ✅ |
| `process.env.NEXT_PUBLIC_API_URL` | ✅ Points to backend `localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | ✅ Points to backend `localhost:5000` |

> [!TIP]
> The commented-out lines (`# MONGODB_URI`, `# API_URL`, `# NEXT_PUBLIC_SOCKET_URL`) are harmless but should be cleaned up. No secrets are exposed.

### Backend ([.env](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/.env))

| Variable | Status |
|---|---|
| `PORT=5000` | ✅ |
| `FRONTEND_URL` | ✅ |
| `MONGODB_URI` | ✅ Server-only |
| `JWT_SECRET` | ⚠️ `qwertyuiop` is trivially guessable |
| `CLOUDINARY_*` | ✅ Server-only |

#### Issue 13: Weak JWT secret

| | |
|---|---|
| **File** | [ConnectUs_Backend/.env](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/.env#L4) |
| **Problem** | `JWT_SECRET=qwertyuiop` is a dictionary word. Anyone can forge valid JWTs. |
| **Impact** | **Critical for production** — full authentication bypass. |
| **Fix** | Use a cryptographically random secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

---

## 6. Dependency Audit

### Frontend `package.json`

| Package | Status | Note |
|---|---|---|
| `mongoose` | ✅ Removed | |
| `bcryptjs` | ✅ Removed | |
| `jsonwebtoken` | ✅ Removed | |
| `cloudinary` | ✅ Removed | |
| `socket.io` (server) | ✅ Removed | |
| `formidable` | ✅ Removed | |
| `socket.io-client` | ✅ Correct | |
| `dotenv` | ⚠️ **Should remove** | Not needed in Next.js — `NEXT_PUBLIC_*` vars are injected at build time |
| `jose` | ⚠️ **Unused** | Imported in middleware but `jwtVerify` is no longer called. Remove unless you plan to re-add verification. |

### Backend `package.json`

| Package | Status |
|---|---|
| `express` | ✅ |
| `mongoose` | ✅ |
| `bcryptjs` | ✅ |
| `jsonwebtoken` | ✅ |
| `cloudinary` | ✅ |
| `socket.io` | ✅ |
| `cookie-parser` | ✅ |
| `cors` | ✅ |
| `multer` | ✅ |
| `nodemon` | ⚠️ Should be in `devDependencies` |
| `helmet` | ❌ **Missing** — no security headers |
| `express-rate-limit` | ❌ **Missing** — no rate limiting |
| `express-mongo-sanitize` | ❌ **Missing** — no NoSQL injection protection |

---

## 7. File Structure Audit

### Backend — ✅ Well organized

```
ConnectUs_Backend/
├── server.js
├── src/
│   ├── config/       (db.js, cloudinary.js)
│   ├── controllers/  (auth, chat, follow, notification, post, user)
│   ├── middleware/    (auth.js, multer.js)
│   ├── models/       (user, post, chat, comment, message, notification)
│   ├── routes/       (auth, chat, follow, notification, post, user)
│   ├── socket/       (index.js, onlineUsers.js, getPresenceSubscribers.js)
│   └── utils/        (cloudinary.js, eventBus.js, jwt.js, notification.js)
```

> Clean MVC structure. The `eventBus` pattern for decoupling controllers from socket emissions is a good architectural choice.

### Frontend — ✅ Reasonable structure

```
ConnectUs_Frontend/
├── src/
│   ├── app/           (pages using App Router)
│   ├── components/
│   │   ├── common/    (shared components)
│   │   ├── layout/    (Main, LeftSideBar, RightSideBar)
│   │   ├── pages/     (page-level components)
│   │   ├── providers/ (ThemeProvider)
│   │   └── ui/        (shadcn/ui primitives)
│   ├── constants/     (constant.js)
│   ├── lib/           (socket.js, utils.js)
│   ├── middleware.js
│   └── store/         (Redux slices)
```

#### Suggestion: Create an `api/` service layer

Currently, every component makes raw `axios` calls with manual `withCredentials`, URL construction, and error handling. A centralized API layer would:
- Eliminate `withCredentials: true` repetition
- Centralize error handling and 401 redirect logic
- Make API endpoint changes easier

```
src/lib/api.js  →  axios instance with baseURL + interceptors
src/services/   →  auth.service.js, post.service.js, chat.service.js, etc.
```

---

## 8. Security Audit

### 🔴 Critical

| # | Finding | File |
|---|---|---|
| S1 | **Weak JWT secret** (`qwertyuiop`) — trivially guessable, allows token forgery | [.env:4](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/.env#L4) |
| S2 | **Cookie `sameSite: "strict"`** — will break auth in production cross-domain deployment | [auth.controller.js:52-57](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/controllers/auth.controller.js#L52-L57) |

### 🟠 High

| # | Finding | File |
|---|---|---|
| S3 | **No rate limiting** on login/signup — brute force possible | [auth.routes.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/routes/auth.routes.js) |
| S4 | **No input sanitization** — MongoDB NoSQL injection possible on all endpoints | All controllers |
| S5 | **No security headers** (Helmet) — XSS, clickjacking, MIME sniffing exposure | [server.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/server.js) |
| S6 | **No file upload validation** in multer — any file type/size accepted | [multer.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/middleware/multer.js) |
| S7 | **Socket has no authentication** — any userId can be passed in the handshake query, no JWT check | [socket/index.js:18](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/socket/index.js#L18) |

### 🟡 Medium

| # | Finding | File |
|---|---|---|
| S8 | **Cloudinary secrets in `.env` not in `.gitignore`** — verify `.gitignore` covers `.env` | [.gitignore](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/.gitignore) |
| S9 | **Username uniqueness not enforced at DB index level** — race condition possible | [user.model.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/models/user.model.js#L9-L10) |

### 🟢 Low

| # | Finding | File |
|---|---|---|
| S10 | `getShortProfile` returns entire user document including followers/following arrays — over-exposure | [user.controller.js:417-443](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/controllers/user.controller.js#L417-L443) |

---

## 9. Performance Audit

### 🟠 High

| # | Finding | File | Fix |
|---|---|---|---|
| P1 | **Duplicate socket event listeners on reconnect** — handlers multiply each reconnection | [socket.js:176-322](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/src/lib/socket.js#L176-L322) | Move listeners outside `connect` handler |
| P2 | **`getPresenceSubscribers` runs 2 DB queries per connect/disconnect** — called for every socket connect and disconnect event. With many concurrent users, this creates heavy DB load. | [getPresenceSubscribers.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/socket/getPresenceSubscribers.js) | Add short-TTL caching (e.g., 30s in-memory cache per userId) |
| P3 | **`toggleFollow` does 4 separate DB operations** (2 finds + 2 saves) — race condition risk | [follow.controller.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/controllers/follow.controller.js#L24-L82) | Use `$addToSet` / `$pull` atomic updates |

### 🟡 Medium

| # | Finding | File | Fix |
|---|---|---|---|
| P4 | **Home feed resync on every reconnect** fetches up to `Math.max(10, posts.length)` posts from the API | [socket.js:136-148](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/src/lib/socket.js#L136-L148) | Only resync if disconnect lasted > 30s |
| P5 | **`getHomePosts` has no index hint** — queries `Post` sorted by `createdAt: -1` with cursor pagination, but no compound index is defined | [post.controller.js:156-165](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/controllers/post.controller.js#L156-L165) | Add `{ createdAt: -1 }` index on `posts` collection |
| P6 | **No `lean()` on populated queries** — many controllers return full Mongoose documents instead of plain objects | Multiple controllers | Add `.lean()` where documents aren't modified |

### 🟢 Low

| # | Finding | File | Fix |
|---|---|---|---|
| P7 | `deletePost` does 4 sequential DB operations — could be parallelized | [post.controller.js:386-428](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Backend/src/controllers/post.controller.js#L386-L428) | Use `Promise.all` for independent operations |

---

## 10. Production Readiness Audit

| Check | Status | Notes |
|---|---|---|
| **Frontend builds** | ✅ | `next build` / `next start` configured |
| **Backend starts** | ✅ | `node server.js` with DB connection |
| **Socket deployment** | ⚠️ | Socket.IO runs on same HTTP server — works on Render/Railway, needs sticky sessions on multi-instance |
| **CORS for production** | ❌ | Hardcoded `localhost:3000` — needs dynamic origin from env |
| **Cookie for production** | ❌ | `sameSite: "strict"` breaks cross-domain, `secure` is conditional |
| **JWT for production** | ❌ | Secret is `qwertyuiop` |
| **Error handling** | ⚠️ | No global error handler in Express — uncaught errors crash the server |
| **Logging** | ⚠️ | Only `console.log/error` — no structured logging (Winston/Pino) |
| **Monitoring** | ❌ | No health check beyond `/health` — no readiness/liveness probes |
| **Graceful shutdown** | ❌ | No `SIGTERM` handler — abrupt termination drops socket connections |
| **Environment validation** | ⚠️ | Some env vars checked (`JWT_SECRET`, `MONGODB_URI`), but no systematic validation on startup |

---

## Critical Issues Summary

| # | Issue | Severity | Section |
|---|---|---|---|
| 1 | `global.onlineUsers` never assigned — profile online status always `false` | 🔴 High | §2, Issue 6 |
| 2 | Socket event listeners duplicate on every reconnect | 🔴 High | §4, Issue 12 |
| 3 | Weak JWT secret (`qwertyuiop`) | 🔴 Critical (prod) | §5, Issue 13 |
| 4 | Cookie `sameSite: "strict"` breaks production deployment | 🔴 Critical (prod) | §3, Issue 8 |
| 5 | No socket authentication — userId accepted without verification | 🟠 High | §8, S7 |
| 6 | No rate limiting on auth endpoints | 🟠 High | §8, S3 |
| 7 | Socket CORS mismatch with Express CORS | 🟡 Medium | §4, Issue 10 |

---

## Missing Pieces

| Feature | Priority | Description |
|---|---|---|
| Axios interceptor / API service layer | Medium | Centralize `withCredentials`, base URL, and 401 handling |
| Global 401 redirect | Medium | When any API call returns 401, auto-redirect to login |
| Refresh token or extended session | Medium | 1h JWT expiry with no renewal is poor UX |
| Express global error handler | High | `app.use((err, req, res, next) => ...)` to prevent crashes |
| Graceful shutdown handler | Medium | Handle `SIGTERM` for clean socket disconnects |
| Socket authentication middleware | High | Verify JWT in socket handshake before accepting connections |
| File upload validation | High | Restrict file types and size in multer config |

---

## Dependency Cleanup Suggestions

### Frontend — Remove

| Package | Reason |
|---|---|
| `dotenv` | Next.js handles `NEXT_PUBLIC_*` natively |
| `jose` | No longer used after middleware simplification (unless re-added) |

### Backend — Add

| Package | Reason |
|---|---|
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting on auth endpoints |
| `express-mongo-sanitize` | NoSQL injection protection |

### Backend — Move to devDependencies

| Package | Reason |
|---|---|
| `nodemon` | Development-only tool |

---

## File Structure Improvements

1. **Frontend**: Create `src/lib/api.js` as an Axios instance with `baseURL` and interceptors, replacing raw `axios.get/post` calls with `withCredentials` in every component.

2. **Frontend**: Rename `process.env.NEXT_PUBLIC_API_URL` to `API_URL` across all 23 import sites.

3. **Frontend**: Clean up [constant.js](file:///d:/Development/Projects/Working/ConnectUs_New/ConnectUs_Frontend/src/constants/constant.js) — remove commented code, remove dotenv import:
   ```javascript
   export const API_URL = process.env.process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
   ```

4. **Backend**: Import `onlineUsers` in `user.controller.js` directly instead of relying on `global.onlineUsers`.

---

## Production Readiness Assessment

| Area | Ready? |
|---|---|
| Frontend deployment | ✅ Yes (Vercel/Netlify ready) |
| Backend deployment | ⚠️ Needs cookie/CORS/secret fixes first |
| Socket deployment | ⚠️ Needs auth + CORS alignment |
| Database | ⚠️ Needs indexes and sanitization |
| Security | ❌ Multiple high-severity issues |

---

## Final Verdict

### **Separated but Requires Major Fixes**

The core architectural separation is **done correctly** — there is no backend logic leaking into the frontend. All database operations, authentication, file uploads, and socket management live exclusively in the backend. The frontend is a pure client-side Next.js app that communicates via HTTP APIs and `socket.io-client`.

However, the following **must be fixed before production deployment**:

1. **Socket event listener duplication on reconnect** (functional bug)
2. **`global.onlineUsers` bug** (broken feature)
3. **Cookie `sameSite` configuration** (authentication will fail in production)
4. **JWT secret strength** (security critical)
5. **Socket authentication** (impersonation possible)
6. **Security middleware** (helmet, rate limiting, sanitization)

For **local development**, the app works correctly today. For **production**, budget ~4-8 hours to address the critical and high-severity items listed above.
