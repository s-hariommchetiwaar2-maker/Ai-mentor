import React from 'react';
import { BaseLayout, Card, Button, Spinner } from '@ai-mentor/shared-ui';

export function AdminApp() {
  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'User Management', href: '#users' },
    { label: 'AI Metrics', href: '#metrics' },
  ];

  return (
    <BaseLayout brandName="AI Mentor Admin" links={navLinks}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Console
          </h1>
          <Spinner size="sm" color="blue" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="System Performance" subtitle="Real-time request metrics">
            <p className="text-sm text-gray-700 mb-4">
              Monitor LLM response times, token throughput, and routing error
              rates instantly.
            </p>
            <Button variant="secondary">View Full Report</Button>
          </Card>

          <Card
            title="Mentor Content Review"
            subtitle="Pending curriculum modules"
          >
            <p className="text-sm text-gray-700 mb-4">
              We currently have 3 custom mentor templates pending review from
              the editorial board.
            </p>
            <Button variant="primary">Review Pending</Button>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
