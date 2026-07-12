# AI Mentor OS - Authentication Service & Security

This package (`@ai-mentor/core`) manages the platform's core security layers, user credentials, database storage, and identity management mechanisms.

---

## 🔒 Security Architectures

The platform prioritizes security-first architectures:

1. **Password Hashing**: Done securely via PBKDF2 with unique, randomly generated salts (`crypto` package) rather than plain-text hashes, protecting against rainbow table lookup vectors.
2. **Session Identification**: Done via simulated JSON Web Tokens (JWT) using encrypted payload sessions.
3. **Role-Based Access Control (RBAC)**: Supports roles for `student`, `mentor`, and `admin` natively with route restrictions and UI layout gates.
4. **Credential Isolation**: Database interactions are strictly encapsulated.

---

## 🛠️ Authentication Actions

The `AuthService` class exposes production-ready endpoints:

- `signUp(email, password, fullName, role)`: Validates input, checks duplicate registration, hashes password, saves record, and issues verification token.
- `login(email, password, rememberMe)`: Verifies hashes and emails, records user sessions, and returns a bearer JWT string.
- `verifyEmail(token)`: Confirms account setup, removing restriction blocks.
- `forgotPassword(email)`: Handles credential recovery, establishing safe, one-hour-only password recovery tokens.
- `resetPassword(token, newPassword)`: Uses the active token to assign a new secure credential set.
- `googleLoginPlaceholder()`: Simulates single sign-on (SSO) with standard OAuth procedures.

---

## 🧪 Testing

Run standard unit tests validating security procedures:

```bash
pnpm test
```

Outputs strict mock checks, ensuring complete structural resilience.
