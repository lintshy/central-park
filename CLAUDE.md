# CLAUDE.md — Coding Standards & Patterns

> This is the authoritative reference for how code is written in this project.
> All agents and contributors must follow these conventions exactly.

---

## 1. TypeScript — Strict Enterprise Standards

### Compiler Settings (do not change)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Rules

```ts
// ✅ Explicit return types on all exported functions
export function formatCurrency(amount: number, currency: string): string { ... }

// ✅ Interfaces for object shapes; type aliases for unions/intersections
interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ✅ Generic constraints instead of any
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// ❌ Never
const data: any = response;
const user = {} as UserProfile;  // casting to bypass type checking
```

### Nullability
- Never use non-null assertion (`!`) except in test files.
- Handle `null` and `undefined` explicitly — use optional chaining (`?.`) and nullish coalescing (`??`).
- Arrays from APIs must be typed as potentially empty: `User[]`, not `[User, ...User[]]` unless truly guaranteed.

---

## 2. Component Patterns

### Functional Components Only
```tsx
// ✅ Correct
interface Props {
  title: string;
  onPress: () => void;
  isDisabled?: boolean;
}

export function PrimaryButton({ title, onPress, isDisabled = false }: Props): React.JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// ❌ No default exports for components (named exports only)
// ❌ No React.FC<Props> (use explicit return type instead)
// ❌ No class components
```

### Component File Structure
```tsx
// 1. Imports (external → internal → relative)
// 2. Types/Interfaces
// 3. Constants local to this file
// 4. Component definition
// 5. Styles (StyleSheet.create at the bottom)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### Props Discipline
- All props must be typed — no prop-spreading (`{...props}`) onto native elements without an explicit interface.
- Callback props named `on<Event>` (e.g. `onPress`, `onChangeText`).
- Boolean props use `is` or `has` prefix (`isLoading`, `hasError`).

---

## 3. Hooks

```ts
// ✅ Every custom hook has explicit return type
export function useAuthUser(): { user: UserProfile | null; isLoading: boolean } {
  ...
}

// ✅ Hooks only call other hooks at the top level — no conditional hook calls
// ✅ Hooks live in /hooks (global) or /features/<name>/hooks (feature-scoped)
// ✅ Name: use<PascalCase>
```

---

## 4. State Management

- **Server state**: React Query (`@tanstack/react-query`). All API calls go through query/mutation hooks.
- **Global client state**: Zustand. One slice per feature in `features/<name>/store/`.
- **Local UI state**: `useState` / `useReducer` — keep it in the component or a dedicated hook.
- Do NOT mix React Query cache with Zustand for the same data.

### React Query Pattern
```ts
// services/userService.ts — pure async functions, no hooks
export async function fetchUserProfile(userId: string): Promise<UserProfile> { ... }

// features/profile/hooks/useUserProfile.ts — hook wrapping the service
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## 5. Navigation (Expo Router)

- All routes are file-based under `/app/`.
- Use typed routes — never pass untyped strings to `router.push()`.
- Route params are validated at the entry point of the screen using a schema (zod).
- Navigation logic belongs in hooks or screen components — not in shared components.

```tsx
// ✅
import { router } from 'expo-router';
router.push({ pathname: '/profile/[id]', params: { id: user.id } });

// ❌
router.push('/profile/' + userId);  // untyped string concatenation
```

---

## 6. Styling

- All design tokens (colours, spacing, font sizes, radii) live in `/theme/`.
- Use `StyleSheet.create()` — no inline style objects in JSX (except truly dynamic values).
- No hardcoded hex colours or pixel values inline.

```tsx
// ✅
import { theme } from '@/theme';
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.card,
  },
});

// ❌
style={{ backgroundColor: '#ffffff', padding: 16 }}
```

---

## 7. Error Handling

```ts
// ✅ Services throw typed errors
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ React Query error boundaries handle UI error states
// ✅ Never swallow errors silently
try {
  await doThing();
} catch (error) {
  logger.error('doThing failed', { error });  // always log
  throw error;                                 // re-throw unless you have a recovery path
}
```

---

## 8. File & Import Conventions

```ts
// Import order (enforced by ESLint):
// 1. React / React Native
// 2. Expo packages
// 3. Third-party packages
// 4. Internal absolute paths (@/components, @/hooks, etc.)
// 5. Relative paths

// ✅ Use path aliases (configured in tsconfig.json)
import { PrimaryButton } from '@/components/PrimaryButton';

// ❌ Deep relative paths
import { PrimaryButton } from '../../../../components/PrimaryButton';
```

### Naming
| Thing | Convention | Example |
|---|---|---|
| Component file | PascalCase | `UserCard.tsx` |
| Hook file | camelCase prefixed `use` | `useAuthUser.ts` |
| Utility file | camelCase | `formatDate.ts` |
| Type file | camelCase | `userTypes.ts` or `types.ts` |
| Constant file | camelCase | `apiEndpoints.ts` |
| Test file | mirrors source + `.test` | `UserCard.test.tsx` |

---

## 9. Constants — Zero Magic Values

```ts
// ✅ constants/api.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const REQUEST_TIMEOUT_MS = 10_000;

// ✅ constants/storage.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

// ❌ Never inline
AsyncStorage.getItem('auth_token')  // hardcoded string
```

---

## 10. Environment Variables

- All env vars accessed via `process.env.EXPO_PUBLIC_*` for client-side values.
- Validated at startup with zod in `lib/env.ts` — the app must not boot with missing required vars.
- Never commit `.env` files — use `.env.example` as the template.

---

## 11. Logging

```ts
import { logger } from '@/lib/logger';

logger.info('Screen mounted', { screen: 'ProfileScreen', userId });
logger.warn('Stale cache detected', { key });
logger.error('Payment failed', { error, orderId });

// ❌ console.log / console.error in production code
```

---

## 12. Platform-Specific Code

```ts
// ✅ Use Platform.select for small differences
const hitSlop = Platform.select({ ios: 8, android: 12, default: 8 });

// ✅ Use .ios.tsx / .android.tsx file extensions for large divergences
// UserAvatar.ios.tsx
// UserAvatar.android.tsx

// ❌ Nested Platform.OS === 'ios' chains deeper than 2 levels — extract to platform file
```

---

## 13. Performance Guardrails

- Wrap expensive list items with `React.memo`.
- Use `useCallback` for callbacks passed to memoized children.
- Use `useMemo` for expensive derived values — not for trivial computations.
- `FlatList` for any list that can exceed ~20 items — never `ScrollView` + `.map()` for long lists.
- No anonymous functions declared inside JSX that could cause unnecessary re-renders in performance-sensitive components.

---

## 14. Security

- Never log tokens, passwords, or PII.
- All network requests go through the centralized service layer — no `fetch` calls scattered in components.
- Validate all external data (API responses, deep link params, push notification payloads) with zod before using.
- Sensitive values stored only via `expo-secure-store`, not `AsyncStorage`.

---

## 15. Quick Reference — Dos and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Named exports everywhere | Default exports for components |
| Explicit return types on exports | Let TypeScript infer public API types |
| Typed errors | `catch (e: any)` |
| Zod for runtime validation | Trust external data shapes blindly |
| `StyleSheet.create` | Inline style objects |
| `expo-secure-store` for secrets | `AsyncStorage` for tokens |
| One component per file | Multiple exported components in one file |
| Feature-scoped state in feature slice | God-object global store |
| Path aliases (`@/`) | Deep relative imports |
