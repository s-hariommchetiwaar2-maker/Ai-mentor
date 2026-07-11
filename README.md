# AI Mentor 🚀

Welcome to the **AI Mentor** repository! AI Mentor is an advanced, AI-powered personalized mentorship and interactive learning platform. By combining state-of-the-art Large Language Models (LLMs) with custom curriculum mappings, real-time code execution, and rich multi-platform client applications, AI Mentor delivers an exceptional, tailored educational experience to students, developers, and professionals worldwide.

---

## 📖 Project Vision

Education is not one-size-fits-all. Every student has unique background knowledge, learning speed, interests, and pain points. **AI Mentor** aims to solve this by providing:

- **Hyper-personalized learning paths:** Dynamically adjusting content based on real-time feedback, assessment performance, and user goals.
- **Contextual mentoring:** An AI companion that is aware of your workspace, code, or context, assisting you directly with step-by-step guidance rather than simple answers.
- **Unified multi-platform experience:** Learn anywhere, whether on a desktop browser, on-the-go via mobile, or through custom admin portals for curriculum managers.
- **Plugin extensibility:** Enabling a vibrant ecosystem of third-party educational providers, corporate trainers, and school boards to customize learning modules.

---

## 🏛️ Monorepo Architecture

This project is built as a professional, unified monorepo using **pnpm workspaces** to manage external and internal dependencies cleanly.

```
AI Mentor Monorepo/
├── apps/                        # Frontend and application clients
│   ├── web/                     # Web-based interactive student interface and AI Dashboard
│   ├── mobile/                  # Mobile client for learning on-the-go (React Native/Expo)
│   └── admin/                   # Administrative panel for managing curricula & user analytics
├── packages/                    # Modular shared packages
│   ├── core/                    # Shared business logic, database wrappers, auth orchestrators
│   ├── shared-ui/               # Core design system and reusable visual components
│   ├── ai-engine/               # LLM wrappers, routing, system prompts, vector store integrations
│   └── plugin-sdk/              # Software Development Kit for extending mentor modules
├── docs/                        # Architectural and developer guides
└── package.json                 # Monorepo workspace configuration
```

### Module Descriptions

1. **`apps/web`**: Responsive main application offering complete dashboard views, active AI chat interfaces, progress trackers, and real-time workspaces. Supports path alias (`@/*`).
2. **`apps/mobile`**: Streamlined native/mobile build maximizing engagement with notification-driven learning, daily flashcards, and quick-reply AI. Supports path alias (`@/*`).
3. **`apps/admin`**: Enterprise-grade backoffice for managing content schemas, overseeing model fine-tunes, monitoring system latency, and checking mentorship analytics. Supports path alias (`@/*`).
4. **`packages/core`**: The single source of truth for schema validation, database clients, authentication adapters, and user billing logic.
5. **`packages/shared-ui`**: A strict component library containing a full visual design system (Button, Card, Input, Modal, Toast, Spinner, Navigation, BaseLayout, LoadingPage, ErrorPage).
6. **`packages/ai-engine`**: Advanced prompt management, fallback handling between OpenAI/Claude/Llama models, and specialized retrieval-augmented generation (RAG) orchestration.
7. **`packages/plugin-sdk`**: A standardized API framework permitting developers to compile and mount sandbox micro-apps into the main AI Mentor container.

---

## 📊 AI Mentor Dashboard & Workspace

The platform features an advanced interactive dashboard:

- **Sidebar & Top Navigation**: Clean layout supporting rapid routing.
- **Interactive AI Chat**: Searchable chat sessions, active conversing thread, and toggleable Favorite lists.
- **Workspace Sandbox**: Browse projects (e.g. Neural Network Sandbox), view simulated file specifications, and bookmark files instantly.
- **Notebook & Bookmarks**: Dynamic custom note creation and unified bookmark managers.
- **Interactive Courseboards**: Monitor overall learning metrics (completion meters, active lessons).

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (>= v20)
- `pnpm` (>= v9)

### Installation

Clone this repository and install dependencies from the root directory:

```bash
pnpm install
```

### Environment Configurations

Rename `.env.example` to `.env` and fill out your variables:

```bash
cp .env.example .env
```

### Build Workspace

To compile and build all the shared packages and application typescript bundles:

```bash
pnpm build
```

### Running Tests

To run all test suites across the workspace:

```bash
pnpm test
```

### Code Quality (ESLint & Prettier)

To lint and format files across all projects:

```bash
pnpm exec eslint .
pnpm exec prettier --write .
```

For more guides and documentation, check out the [Docs](./docs/) folder.
