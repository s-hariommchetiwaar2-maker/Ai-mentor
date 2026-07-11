export interface PromptTemplate {
  name: string;
  systemPrompt: string;
  userTemplate: string;
}

export function formatPrompt(
  template: PromptTemplate,
  variables: Record<string, string>
): string {
  let formatted = template.userTemplate;
  for (const [key, val] of Object.entries(variables)) {
    formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), val);
  }
  return formatted;
}

export const defaultMentorTemplate: PromptTemplate = {
  name: 'Default Mentor',
  systemPrompt:
    'You are an expert AI software engineering mentor. Help the student think step-by-step.',
  userTemplate: 'Explain this topic in detail: {{topic}}',
};
