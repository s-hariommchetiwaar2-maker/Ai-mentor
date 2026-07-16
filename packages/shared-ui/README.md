# @ai-mentor/shared-ui

A shared, accessible React component library and layout system designed specifically for the AI Mentor platform. This package is shared by `apps/web` and `apps/admin` to ensure uniform visual styling, accessibility compliance, and high performance.

---

## 📦 Installed UI Components

The shared UI library comes pre-packaged with several highly flexible, responsive components and base layouts:

1. **`BaseLayout`**: Offers a professional shell including a Header, dynamic/responsive navigation bar, and footer alignment.
2. **`Navigation`**: Full navigation bar featuring automatic transition to a mobile hamburger menu on narrow screens.
3. **`Button`**: Highly style-extensible (variants: `primary`, `secondary`, `danger`, `ghost` | sizes: `sm`, `md`, `lg`).
4. **`Card`**: Structured container supporting full headers, titles, subtitles, and internal text wraps.
5. **`Input`**: Standardized, clean forms with clear error-state styling and programmatic labels.
6. **`Spinner`**: Clean circular spinner with adjustable speed, sizing, and colors (`blue`, `gray`, `white`).
7. **`Modal`**: Highly accessible, overlay dialog for complex confirmation or settings actions.
8. **`Toast`**: Contextual pop-up notification (`success`, `error`, `info`) with support for auto-dismiss timers.
9. **`LoadingPage`**: A full-page visual placeholder for state transitions, featuring micro-animations.
10. **`ErrorPage`**: A full-screen user recovery panel designed with standard error codes and call-to-actions.

---

## 🛠️ Usage Example

```tsx
import React from 'react';
import { BaseLayout, Card, Button, Input } from '@ai-mentor/shared-ui';

export function ApplicationPage() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <BaseLayout brandName="AI Mentor" links={links}>
      <Card
        title="Quick Setup"
        subtitle="Fill out the details to initialize the mentorship path."
      >
        <Input label="Desired Topic" placeholder="e.g. LLM Orchestration" />
        <div className="mt-4 flex gap-2">
          <Button variant="primary">Submit</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>
    </BaseLayout>
  );
}
```

---

## 🚀 Building & Modifying

Compile the package output using `tsup`:

```bash
pnpm build
```

The package outputs clean CommonJS (`.js`) and ESM (`.mjs`) builds along with full TypeScript types (`.d.ts`).
