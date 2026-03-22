# EduTaskMap - Worker Plan

## Team

| Role | Responsibility |
|------|---------------|
| **Developer (DEV)** | Implements all changes. Writes code, tests locally, creates PRs. |
| **Product Manager (PM)** | Reviews every PR for functional parity. Verifies that no existing feature is broken or changed in behavior. Signs off before merge. |
| **Code Reviewer (CR)** | Reviews every PR for code quality, performance, and correctness. If CR raises a concern, DEV must either fix it or respond in writing with why it's not relevant. CR re-reviews until satisfied or accepts the explanation. |

## Process

1. DEV creates a feature branch per phase (e.g., `phase-1-docker-setup`).
2. DEV opens a PR when the phase is complete.
3. CR reviews code. DEV addresses or explains every comment.
4. PM tests the deployed preview / localhost to verify functional parity.
5. PM signs off. PR is merged to `main`.
6. Next phase begins.

---

## Phase 0: Docker Compose Local Environment
**Branch:** `phase-0-docker-setup`
**Goal:** One command (`docker compose up`) starts everything needed for local development.

### Tasks

- [ ] **0.1** Create `Dockerfile` for the backend
  - Base image: `node:20-alpine`
  - Copy `backend/` source, install deps, expose port 3001
  - CMD: `node src/server.js`

- [ ] **0.2** Create `Dockerfile` for the frontend
  - Base image: `node:20-alpine`
  - Copy `frontend/` source, install deps, expose port 3000
  - CMD: `npx react-scripts start`
  - ENV: `REACT_APP_API_BASE_URL=http://localhost:3001`

- [ ] **0.3** Rewrite `docker-compose.yml` with 3 services
  ```
  services:
    db:
      image: postgres:15
      ports: 3001 is backend, so db stays internal or forwards 5432
      environment: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
      volumes: db_data
      healthcheck: pg_isready

    backend:
      build: ./backend
      ports: "3001:3001"
      environment:
        DB_HOST: db
        DB_USER: admin
        DB_PASSWORD: admin
        DB_NAME: edutaskmap
        DB_PORT: 5432
      depends_on:
        db:
          condition: service_healthy

    frontend:
      build: ./frontend
      ports: "3000:3000"
      environment:
        REACT_APP_API_BASE_URL: http://localhost:3001
      depends_on:
        - backend
  ```

- [ ] **0.4** Add `.dockerignore` files to `frontend/` and `backend/` (node_modules, .git, build artifacts)

- [ ] **0.5** Test: `docker compose up --build` starts all 3 services, frontend is accessible at `http://localhost:3000`, API at `http://localhost:3001`

- [ ] **0.6** Update root `README` (or create one) with local setup instructions: prerequisites (Docker), single command to run, ports, how to stop

### PM Checklist
- [ ] All existing features work identically on `localhost:3000`
- [ ] Data persists across `docker compose down` / `docker compose up` (volume)
- [ ] No hardcoded URLs leaked into the image (production URLs stay in Vercel env vars)

### CR Focus
- Dockerfiles follow best practices (multi-stage if needed, .dockerignore, non-root user)
- No secrets baked into images
- docker-compose healthchecks are correct

---

## Phase 1: Performance Quick Wins
**Branch:** `phase-1-perf-quickwins`
**Goal:** Fix the highest-impact performance issues that require minimal code changes.

### Tasks

- [ ] **1.1** Remove `* { transition: all 0.2s ease }` from `index.css`
  - Add targeted transitions only where needed (card hover effects, button states)
  - Affected files: `index.css`, potentially `CompetencyCard.js`, `ClassCard.js`, `GradeClasses.js`

- [ ] **1.2** Remove dead CSS from `index.css`
  - Delete unused classes: `.task-list`, `.add-task-button`, `.cancel-button`, `.add-task-form`, `.loading-spinner`
  - Verify none of these classes are referenced anywhere in the codebase (grep first)

- [ ] **1.3** Fix `TaskList` unnecessary re-renders
  - Remove the `useEffect` that copies `preloadedTasks` into local state
  - Use `preloadedTasks` prop directly instead of duplicating into state
  - Remove `const [tasks, setTasks] = useState([])` and `const [loading, setLoading]` from TaskList

- [ ] **1.4** Memoize grade data in `EduTaskMap.js`
  - Wrap `classesByGrade` construction in `useMemo` so child components don't get new array references on every render

### PM Checklist
- [ ] All hover effects still work (cards lift, buttons change color)
- [ ] Task lists still display correctly
- [ ] Adding/deleting items still works

### CR Focus
- No regressions in animation behavior
- Verify removed CSS is truly unused
- Verify `preloadedTasks` direct usage doesn't cause stale data issues

---

## Phase 2: Layout Fixes
**Branch:** `phase-2-layout`
**Goal:** Fix the structural layout problems without changing features.

### Tasks

- [ ] **2.1** Make SchoolDrawer responsive
  - Change `width: '40vw'` to `{ xs: '85vw', sm: '60vw', md: '40vw', lg: '30vw' }`

- [ ] **2.2** Fix grade card heights
  - Replace `height: min(70vh, 600px)` with `minHeight: 200px` (or remove fixed height)
  - Same for ClassCard: remove `height: min(500px, 60vh)`, use natural sizing
  - Empty grades should take minimal space

- [ ] **2.3** Group grades into school levels
  - Add section headers: "Початкова школа (1-4)", "Основна школа (5-9)", "Старша школа (10-11)"
  - Each section is collapsible (MUI `Accordion` or simple toggle)
  - Default: all expanded (preserves current behavior, but gives structure)

- [ ] **2.4** Fix nested scroll
  - Remove `overflowY: 'auto'` from grade cards and class cards
  - Let the page be the single scroll container
  - Cards grow to fit their content naturally

- [ ] **2.5** Fix title gradient-on-gradient
  - Simplify to `color: 'white'` — remove the unused `backgroundClip` / `WebkitTextFillColor` workaround

- [ ] **2.6** Fix competency card `maxWidth: 350px`
  - Remove the constraint, let grid cells control width

### PM Checklist
- [ ] School drawer opens and works on mobile-width browser (DevTools responsive mode)
- [ ] All 11 grades are still visible and usable
- [ ] Grade grouping doesn't hide any content by default
- [ ] Competencies display correctly at various screen widths
- [ ] Scroll behavior feels natural — no confusing nested scrolls

### CR Focus
- Responsive breakpoints are reasonable
- Accordion state doesn't cause layout shifts
- No overflow/clipping issues at edge-case widths

---

## Phase 3: Design Cleanup
**Branch:** `phase-3-design`
**Goal:** Clean up visual noise and improve consistency.

### Tasks

- [ ] **3.1** Remove all "Активна" / "Активний" status chips
  - `CompetencyCard.js` — remove "Активна" chip
  - `ClassCard.js` — remove "Активний" chip
  - `SchoolDrawer.js` — remove "Активний" chip from each school list item

- [ ] **3.2** Hide delete buttons behind hover
  - Show delete `IconButton` only on `:hover` of the parent element (card/list item)
  - On mobile (touch), show a subtle "..." icon that opens a menu with "Видалити"
  - Affected: `CompetencyCard`, `ClassCard`, `TaskCard` (both variants), `SchoolDrawer`

- [ ] **3.3** Replace `window.confirm()` with a custom MUI Dialog
  - Create a reusable `ConfirmDialog` component: title, message, confirm/cancel buttons
  - Replace all 4 `window.confirm()` calls:
    - `SchoolDrawer.js` (delete school)
    - `ClassCard.js` (delete class)
    - `TaskList.js` (delete task)
    - `CompetencyCard.js` (delete competency)

- [ ] **3.4** Reduce gradient palette
  - Keep purple gradient for primary actions (buttons, drawer header)
  - Change class card header from amber gradient to a neutral subtle style (light gray with colored left border, matching the grade color)
  - Task "add" buttons: use outlined style instead of green gradient

- [ ] **3.5** Add empty state for grades with no subjects
  - Simple: icon + "Додайте перший предмет" text + the existing "Додати предмет" button centered
  - No need for illustrations — keep it minimal

### PM Checklist
- [ ] Deletion still works for all entity types (school, class, competency, task)
- [ ] Confirmation dialog appears before every delete
- [ ] All "add" buttons are still easily discoverable
- [ ] Empty states guide the user to add content
- [ ] No feature removed — only visual presentation changed

### CR Focus
- `ConfirmDialog` is truly reusable (no hardcoded strings)
- Hover-to-show delete works on both mouse and touch
- Color changes maintain sufficient contrast (WCAG AA)

---

## Phase 4: API & Data Layer
**Branch:** `phase-4-api`
**Goal:** Fix the data fetching patterns for reliability and performance.

### Tasks

- [ ] **4.1** Convert all API functions from callbacks to async/await
  - Rewrite `requests/schools.js`, `competencies.js`, `classes.js`, `tasks.js`, `schoolFullData.js`
  - Each function returns a Promise, throws on error
  - Update all call sites in components

- [ ] **4.2** Add proper error handling to all components
  - Show error messages via MUI `Snackbar` or `Alert` instead of `console.error` + `alert()`
  - Create a simple error notification context or component

- [ ] **4.3** Implement optimistic updates for delete operations
  - Remove item from local state immediately on delete
  - If the API call fails, re-add the item and show an error notification
  - Eliminates full refetch on delete

- [ ] **4.4** Implement optimistic updates for add operations
  - Add item to local state immediately using the API response
  - Only refetch full data if the response indicates something unexpected
  - Eliminates full refetch on add

- [ ] **4.5** Add request cancellation with AbortController
  - When switching schools, cancel any in-flight `fetchFullSchoolData` request
  - Pass `AbortController.signal` to `fetch()` calls
  - Ignore `AbortError` in catch blocks

- [ ] **4.6** Add basic client-side cache for school data
  - Cache `fetchFullSchoolData` responses keyed by school ID
  - On school switch: show cached data immediately, refetch in background
  - Invalidate cache entry after a mutation to that school

### PM Checklist
- [ ] Adding a school/class/competency/task still works
- [ ] Deleting still works
- [ ] Switching schools shows data instantly (if previously loaded)
- [ ] Rapid school switching doesn't show wrong data
- [ ] Network errors show a user-friendly message (not just console)

### CR Focus
- Promises are properly awaited everywhere (no floating promises)
- AbortController cleanup in useEffect return
- Optimistic rollback actually works (test with network throttling)
- Cache invalidation is correct — stale data is worse than no cache

---

## Phase 5: Build Toolchain Migration
**Branch:** `phase-5-vite`
**Goal:** Migrate from CRA to Vite for faster dev experience.

### Tasks

- [ ] **5.1** Install Vite and dependencies
  - `vite`, `@vitejs/plugin-react`
  - Remove `react-scripts` from dependencies

- [ ] **5.2** Create `vite.config.js`
  - Configure React plugin
  - Set dev server port to 3000
  - Configure proxy for `/api` to `http://localhost:3001` (replaces `REACT_APP_API_BASE_URL` in dev)

- [ ] **5.3** Migrate entry point
  - Rename `index.js` to `main.jsx` (or keep .js with config)
  - Move `<script>` tag in `index.html` from CRA auto-inject to explicit `<script type="module" src="/src/main.jsx">`
  - Move `index.html` from `public/` to project root

- [ ] **5.4** Update environment variables
  - Replace `REACT_APP_*` prefix with `VITE_*` prefix
  - Update `config/api.js` to use `import.meta.env.VITE_API_BASE_URL`

- [ ] **5.5** Update Docker frontend config
  - Update `Dockerfile` for Vite dev server
  - Update `docker-compose.yml` environment variable names

- [ ] **5.6** Update Vercel frontend config
  - Update `vercel.json` build settings for Vite
  - Test deployment preview

- [ ] **5.7** Remove CRA artifacts
  - Delete `reportWebVitals.js`
  - Remove `react-scripts` and `@testing-library/*` from package.json (if not needed)
  - Clean up any CRA-specific config

### PM Checklist
- [ ] `localhost:3000` works identically to before migration
- [ ] Production build (`npm run build`) produces working output
- [ ] Vercel deployment still works
- [ ] Docker setup still works

### CR Focus
- Vite config is minimal and correct
- No CRA artifacts left behind
- Environment variable migration is complete (grep for `REACT_APP_`)
- Build output is correct (check `dist/` folder structure)

---

## Timeline Estimate

| Phase | Description | Estimated Duration |
|-------|-------------|-------------------|
| 0 | Docker Compose setup | 1 day |
| 1 | Performance quick wins | 0.5 day |
| 2 | Layout fixes | 1.5 days |
| 3 | Design cleanup | 2 days |
| 4 | API & data layer | 2 days |
| 5 | Vite migration | 1 day |
| | **Total** | **~8 working days** |

Each phase includes time for CR review cycles and PM sign-off. Phases are sequential — each builds on the previous. If blocked on review, DEV can start reading/planning the next phase but should not branch off unmerged work.

---

## Definition of Done (per phase)

1. All tasks in the phase are checked off
2. CR has approved (or accepted DEV's explanations for all concerns)
3. PM has verified functional parity on localhost
4. PR is merged to `main`
5. Vercel preview deployment works (phases 1-5)
