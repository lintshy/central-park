# AGENTS.md — React Native Expo Project

> Ground rules for every AI agent (Claude Code, Codex, Copilot, Cursor, etc.) working in this repository.
> Read this file **in full** before writing or modifying any code.

---

## 0. Prime Directive — No Hallucination

**If you do not know something with certainty, you must say so.**

- Do NOT invent API surface, component props, hook signatures, or library features.
- Do NOT assume a package version supports a feature — check `package.json` first.
- Do NOT generate import paths you have not verified exist in the file tree.
- If a file, module, or type is referenced but not yet read, **read it before using it**.
- Prefer `// TODO: verify <X>` over a confident but wrong implementation.

---

## 1. Repository Map — Read Before Touching Anything

```
/
├── app/                    # Expo Router file-based routes (pages/screens)
│   ├── (tabs)/             # Tab navigator screens
│   ├── _layout.tsx         # Root layout
│   └── ...
├── components/             # Shared UI components (dumb/presentational)
├── features/               # Feature slices (logic + local components)
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── store/          # Zustand slice or React Query config
│       └── types.ts
├── hooks/                  # Global custom hooks
├── lib/                    # Pure utility functions (no React)
├── services/               # API clients and third-party integrations
├── store/                  # Global Zustand store
├── theme/                  # Design tokens, colours, typography, spacing
├── types/                  # Shared TypeScript types & interfaces
├── constants/              # App-wide constants (never magic strings inline)
├── assets/                 # Static assets (images, fonts, icons)
├── __tests__/              # Jest + React Native Testing Library tests
├── app.json                # Expo config
├── babel.config.js
├── tsconfig.json           # Strict mode enabled — do not relax settings
├── AGENTS.md               # This file
└── CLAUDE.md               # Coding standards & patterns reference
```

**Before creating a new file**, confirm the correct folder by this map.
**Before adding a new dependency**, check `package.json` and ask if it already exists.

---

## 2. Mandatory Checks Before Every Code Change

Run the following (in your head or literally) before submitting code:

1. **Does the file I'm editing already exist?** (`view` or `ls` first)
2. **Have I read every file I import from?** If not, read it.
3. **Have I checked `package.json`** for the actual installed version of any library I'm using?
4. **Do all types compile?** — mentally trace types or note where explicit checks are needed.
5. **Is there an existing pattern for this?** — search `/components`, `/hooks`, `/features` before creating net-new abstractions.
6. **Am I adding a magic string?** — move it to `/constants` instead.

---

## 3. Workflow

### Understand First
- Read the relevant existing code *completely* before proposing changes.
- If the task is ambiguous, ask one clarifying question rather than assuming.
- Map out which files will be touched; list them before touching any.

### Plan Then Execute
- For tasks involving ≥ 3 files: produce a written plan first, wait for approval.
- For bug fixes: identify the root cause explicitly before writing any fix.
- Do not make speculative "while I'm here" changes outside the stated scope.

### After Every Change
- Ensure TypeScript compiles with zero new errors (`npx tsc --noEmit`).
- Ensure the linter passes (`npx eslint . --ext .ts,.tsx`).
- If logic changed, note which unit tests need updating or adding.

---

## 4. What Agents Must NOT Do

| ❌ Prohibited | ✅ Correct Alternative |
|---|---|
| Install new packages without explicit approval | List the package + reason; wait for go-ahead |
| Modify `tsconfig.json` or `babel.config.js` | Flag the need; do not change |
| Rename or move existing files unilaterally | Propose the rename; wait for approval |
| Generate placeholder/stub data inside production code | Use proper mock files or test fixtures |
| Use `any` type | Use `unknown`, proper generics, or a named interface |
| Use `// @ts-ignore` or `// @ts-expect-error` | Fix the underlying type error |
| Inline hardcoded strings (colours, URLs, copy) | Use constants, theme tokens, or i18n keys |
| Write `console.log` in production code | Use the project logger (`lib/logger.ts`) |
| Assume Expo SDK version — always verify | Read `app.json` → `expo.sdkVersion` |
| Generate code for an import path that doesn't exist | Create the file first, then import |

---

## 5. Scope Discipline

- **One task, one PR surface.** Do not fix unrelated issues in the same change.
- **Do not refactor while fixing.** Refactors are separate, planned tasks.
- If you notice a bug while working on something else, add a `// FIXME:` comment and report it — don't silently fix it.

---

## 6. Testing

- Every new hook or utility function requires a unit test in `__tests__/`.
- Every new screen requires at minimum a smoke-render test.
- Tests live adjacent to or in `__tests__/` mirroring the source path.
- Use React Native Testing Library (`@testing-library/react-native`) — no Enzyme.
- Mock native modules via `__mocks__/` — never mock React itself.

---

## 7. When You Are Uncertain

Say one of the following explicitly:

- *"I need to read `<file>` before proceeding — I don't have its contents."*
- *"I'm not certain `<library>` supports this API at the version in `package.json` — please verify."*
- *"This requires a native module — I need to check `app.json`/`app.config.ts` for the plugin."*

Never fill uncertainty with confident-sounding code. A clear `TODO` is always better than a hallucinated implementation.
