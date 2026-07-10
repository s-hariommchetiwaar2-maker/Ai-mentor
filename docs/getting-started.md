# Getting Started Guide

This guide helps developers set up their workspace environment and begin contributing to the **AI Mentor** codebase.

## Quickstart

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd ai-mentor
   ```

2. **Install Workspace Dependencies**
   We use PNPM to optimize package installation and module resolution.

   ```bash
   pnpm install
   ```

3. **Verify the Structure**
   Ensure all packages are recognized by running:

   ```bash
   pnpm -r exec pwd
   ```

4. **Verify Tests**
   ```bash
   pnpm test
   ```

## Creating a New Package or Application

When adding a new service or client:

1. Put it under either `apps/` or `packages/` based on whether it is an end-user interface or reusable library.
2. Ensure its `package.json` specifies the name with correct prefixing (e.g. `@ai-mentor/<name>`).
3. Add a basic description, main file entry, and test script.
4. Reference the package in your target application using workspace syntax: `"@ai-mentor/<name>": "workspace:*"`.
