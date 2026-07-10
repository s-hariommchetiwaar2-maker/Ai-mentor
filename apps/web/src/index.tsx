import { BaseLayout, Card, Button } from '@ai-mentor/shared-ui';
import { greetUser } from '@ai-mentor/core';

export function WebApp() {
  const mockUser = {
    id: 'u1',
    name: 'Hariom',
    email: 'hariom@mentor.ai',
    role: 'student' as const,
  };

  const navLinks = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Courses', href: '#courses' },
    { label: 'AI Chat', href: '#chat' },
  ];

  return (
    <BaseLayout brandName="AI Mentor Web" links={navLinks}>
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Student Hub</h1>
        <p className="text-gray-600">{greetUser(mockUser)}</p>

        <Card
          title="Your Core Course"
          subtitle="Introduction to Large Language Models"
        >
          <p className="text-sm text-gray-700 mb-4">
            Learn prompt engineering, retrieval-augmented generation (RAG), and
            model orchestration in this foundational curriculum.
          </p>
          <Button variant="primary">Resume Lesson</Button>
        </Card>
      </div>
    </BaseLayout>
  );
}
