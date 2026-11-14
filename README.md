## Coding Standards & Conventions

All developers must follow these rules when writing or modifying code. The goal is to keep the codebase consistent, readable, maintainable, and easy to extend.

### 1. Naming Conventions

#### 1.1. Folders & Files

- All folder names must use `kebab-case`.
- All file names must use `kebab-case`.
- File names must include a suffix that identifies their purpose or type.

Examples:

```text
src/
├── common/
│   ├── constants/
│   ├── enums/
│   ├── interfaces/
│   ├── types/
└── configs/
    ├── logger.config.ts
    └── database.config.ts
```

File naming examples:

```text
user-status.enum.ts
user.interface.ts
user.type.ts
user.service.ts
user.controller.ts
user.module.ts
user.constants.ts
```

#### 1.2. Classes

All classes must use `PascalCase`.

```typescript
class UserService {}
class DatabaseConnection {}
class AuthenticationGuard {}
```

#### 1.3. Methods & Functions

All methods and functions must use `camelCase`.

```typescript
function getUserById() {}

class UserService {
    createUser() {}
    updateUserStatus() {}
    deleteUser() {}
}
```

#### 1.4. Constants

Shared and global constants must use `UPPER_SNAKE_CASE`.

Use underscores (`_`) to separate words.

```typescript
const MAX_RETRY_COUNT = 5
const DEFAULT_PAGE_SIZE = 20
const API_BASE_URL = 'https://example.com'
```

Local variables declared with `const` must still use `camelCase`.

```typescript
const userName = 'John'
const maxRetryCount = 5
```

#### 1.5. Enums

All enum names must end with the `Enum` suffix.

```typescript
enum UserStatusEnum {
    ACTIVE = 1,
    INACTIVE = 2,
    SUSPENDED = 3,
}
```

#### 1.6. Types

All custom TypeScript type names must end with the `T` suffix.

The `T` suffix must always be placed at the end of the name.

```typescript
type UserT = {
    id: number
    username: string
}

type UserStatusT = 'active' | 'inactive'
```

#### 1.7. Interfaces

All interface names must end with the `I` suffix.

The `I` suffix must always be placed at the end of the name.

```typescript
interface UserI {
    id: number
    username: string
}

interface UserRepositoryI {
    findById(id: number): Promise<UserI | null>
}
```

---

### 2. Static Values & Magic Numbers

Avoid hardcoding values that have a specific meaning or may need to be reused.

Use the appropriate structure to define shared values:

- Constants
- Enums
- Configuration files
- Environment variables

**Incorrect:**

```typescript
if (user.status === 1) {
    // ...
}

if (retryCount > 5) {
    // ...
}

setTimeout(callback, 3000)
```

**Correct:**

```typescript
const MAX_RETRY_COUNT = 5
const REQUEST_TIMEOUT = 3000

if (user.status === UserStatusEnum.ACTIVE) {
    // ...
}

if (retryCount > MAX_RETRY_COUNT) {
    // ...
}

setTimeout(callback, REQUEST_TIMEOUT)
```

Do not create constants for every literal value. Values that are part of normal language syntax or have no independent meaning do not need to be extracted.

---

### 3. Type Safety

- Avoid using `any`. Use `unknown` when the type is not known.
- Always validate and narrow `unknown` values before using them.
- Prefer proper TypeScript types over type assertions.
- Avoid unnecessary use of `as`.
- Do not use `@ts-ignore` or disable lint rules without a valid reason.
- Validate all data received from external sources.

---

### 4. Code Quality

- Avoid code duplication. Extract shared logic when appropriate.
- Keep functions and methods small and focused on a single responsibility.
- Avoid deeply nested conditions and unnecessary complexity.
- Use meaningful names for variables, functions, methods, and classes.
- Write comments to explain why something is done, not simply what the code does.
- Avoid unnecessary abstractions and overengineering.
- Handle errors explicitly and appropriately.
- Avoid circular dependencies.

---

### 5. Configuration Management

- All environment-specific settings must be managed through configuration files or environment variables.
- Do not access `process.env` directly throughout the application.
- Use a centralized configuration layer ( EnvLoaderService ) to access environment variables.
- Never hardcode environment-specific values.
- Keep configuration files inside the `configs` directory.

---

### 6. Imports & Dependencies

- Use configured path aliases instead of long relative import paths whenever possible.
- Avoid unnecessary dependencies.
- Avoid circular imports.
- Import only what is needed.
- Keep module dependencies clear and organized.

---

### 7. Logging & Error Handling

- Do not use `console.log`, `console.error`, or other console methods in application code.
- Use the centralized logging service.
- Use meaningful log messages.
- Do not silently catch or ignore errors.

---

### 8. General Rules

- Follow the existing project structure and conventions.
- Do not introduce new patterns without a clear reason.
- Keep changes focused and avoid unrelated modifications.
- Ensure code passes TypeScript checks and lint rules before committing.
- Keep the code readable and maintainable rather than optimizing prematurely.

----



## Notes
> **Note:** The encryption key must contain at least 16 characters.