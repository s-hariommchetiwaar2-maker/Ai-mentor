# AGENTS.md — Permanent Development & Architecture Guide

Welcome, Agent! This document serves as the single source of truth for the codebase architecture, module ownership, development standards, and operations workflows. **All future tasks, agents, and human contributors must strictly adhere to the guidelines set in this document.**

---

## 1. Repository Architecture

The project is structured as a high-performance **Node.js & TypeScript Monorepo** powered by `pnpm` workspaces. It comprises a decoupled frontend layer, standalone client applications, core shared logic, and an advanced AI orchestrator.

```
.
├── apps/                         # Standalone Applications
│   ├── admin/                    # Admin Dashboard (React + TypeScript)
│   ├── mobile/                   # Mobile Client (React + TypeScript)
│   └── web/                      # Legacy/Sandbox Client Web Application
├── packages/                     # Reusable Libraries & Engines
│   ├── ai-engine/                # AI Orchestration, Prompt & Memory Engine
│   ├── core/                     # Auth, Payments, Security, and Database Connectors
│   ├── plugin-sdk/               # SDK for third-party extensions/tools
│   └── shared-ui/                # Shared Component Library (React 19 + Tailwind)
├── src/                          # NEXT.JS APP ROUTER FRONTEND (Root Application)
│   ├── app/                      # App Router Routes & Static Generator Endpoints
│   ├── components/               # High-Fidelity Responsive UI Components
│   └── data/                     # Unified Regional Data & Static Directories
├── public/                       # Static Assets (Logos, Icons, Offline Assets)
├── vercel.json                   # Vercel Deployment configuration (Static Outbound)
├── next.config.ts                # Next.js configurations
└── pnpm-workspace.yaml           # Monorepo Workspace Definitions
```

---

## 2. Module Ownership & Status

| Module / Package | Purpose | Status | Owner | Special Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Root Application (`src/app`)** | "Gov Jobs, Tenders & Funding" High-Performance Portal | **Completed (Phase 1)** | Core Platform Team | Dynamic & Static build pre-rendering. **No dynamic server runtime.** |
| **`packages/core`** | Security, PBKDF2 Hashing, Session signing, Razorpay API payments | **Completed** | Security & Finance | Read-only. Strictly guarded by unit tests. |
| **`packages/ai-engine`** | Multi-provider LLM abstractions, Sliding context, Queue runner | **Completed** | AI Infrastructure | Multi-provider fallback support required. |
| **`packages/shared-ui`** | Design-system standard components, buttons, inputs | **Completed** | UI/UX Team | React 19 + Tailwind CSS compliant. |
| **`apps/admin`** | Administration panels | **In Progress** | Ops Team | Must utilize `@ai-mentor/shared-ui` for layout blocks. |
| **`apps/mobile`** | Mobile frontend | **Pending** | Mobile Team | Non-blocking. |
| **`apps/web`** | Legacy Web client | **Read-Only / Legacy** | Core Platform Team | Do not alter unless requested by explicit prompt overrides. |

---

## 3. Read-Only Modules

The following packages are considered **production-stabilized** and should not be modified unless the task explicitly demands changes to core library functions:
- `packages/core` (Auth services, Hashing, Security logic)
- `packages/plugin-sdk` (Base interfaces for pluggable tools)
- `apps/web` (Simulated Sandbox layouts and 5-tier client subscriptions)

---

## 4. Coding & Design Standards

### **TypeScript & Strict Safety**
- Set `"strict": true` in all TS configs.
- **Avoid `any`** at all costs. Prefer strong type parameters, union types, or `unknown` with runtime type assertions.
- Ensure all imports use modern **ESM standards** (`"type": "module"` in `package.json`).

### **Next.js & App Router Standards**
- Prioritize **Static Prerendering** using `generateStaticParams()` where applicable.
- Design files to compile cleanly using `"output": "export"` (static export mode) for ultimate SEO indexing and speed.
- All non-static assets and layouts must be compatible with React 19 rules.

### **Component Principles (React & Tailwind)**
- Always design **mobile-first**, fully responsive layouts (validated down to 320px screen width).
- Follow clean semantic structure: `<header>`, `<main>`, `<section>`, `<footer>`.
- Use **Lucide Icons** exclusively for consistent design aesthetics.
- Incorporate clean color palettes matching public portal aesthetics.

---

## 5. Deployment Workflow & Static Hosting Alignment

To enable instant edge delivery and SEO-friendly discovery, the platform utilizes Next.js static exports.

### **Critical Vercel Configuration**
Never deviate from or override the following settings:
- **`next.config.ts`**: Must declare `output: "export"` and `unoptimized: true` for remote assets (such as images).
- **`vercel.json`**: Must declare `"outputDirectory": "out"` to map output targets.
- **Git Tracking**: Always track production assets in `public/` and prevent build target directories (`/.next`, `/out`) from leaking into commits by enforcing the `.gitignore` setup.

---

## 6. Prompt Guidelines for Future Tasks

When formulating plans or writing features:
1. **Explore First**: Always run `list_files` or `grep` to understand the monorepo workspace environment before planning.
2. **Build Isolation**: To check if changes break workspace packages, compile them using `pnpm build:all` (executing recursive builds) before building individual packages.
3. **No Mocks**: Do not introduce fake data models. Always reference standard static structures (e.g. `src/data/states.ts` or `src/data/categories.ts`).
4. **Disclaimers**: When building features referencing official sources or government directories, prominently display official source disclaimers to prevent user confusion.

---

## 7. Module-by-Module Development Rules

### **A. Core App (`src/`)**
- Static pre-rendering only.
- State directories must support all 28 Indian States and 3 Union Territories.
- Structured schemas (Schema.org / JSON-LD) must be dynamically injected into metadata tags for every route.

### **B. Shared UI (`packages/shared-ui`)**
- Standardized UI blocks. Ensure any layout change does not affect dependent packages (`apps/admin`, `apps/mobile`, etc.).
- Compiles via `tsup`. Run `pnpm --filter @ai-mentor/shared-ui build` to generate artifacts.

### **C. Core Engine (`packages/core`)**
- High-level security implementations (PBKDF2 SHA-512, HMAC-SHA256).
- All payment transactions must adhere to secure cryptographic signature checks.

---

## 8. Commit & Verification Checklist

Before submitting any code changes, verify the following checklist sequentially:

- [ ] **Dependency Cleanliness**: Stale dependencies removed; no peer dependency mismatches.
- [ ] **Workspace Compilation**: `pnpm build:all` passes without any TypeScript or compile errors.
- [ ] **Root Next.js Compilation**: `pnpm build` compiles 41/41 pages and successfully exports them to `/out`.
- [ ] **ESLint & Code Format**: Code adheres to monorepo rules with no block-level style warnings.
- [ ] **Static Assets Integrity**: `.gitignore` correctly blocks `/out/` and `/.next/` while tracking necessary public files.
- [ ] **Test Coverage**: All test runners (`pnpm test:all`) pass with 100% success.
- [ ] **Vercel Alignment**: `vercel.json` exists with correct build output paths.

---

*This document is permanent. Do not delete or modify core sections unless directed by explicit user override.*
