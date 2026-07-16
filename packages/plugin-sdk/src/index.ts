export interface MentorPlugin {
  id: string;
  name: string;
  version: string;
  onInitialize: () => void;
  onExecute: (context: unknown) => unknown;
}

export function registerPlugin(plugin: MentorPlugin): void {
  console.log(
    `[Plugin SDK] Registering plugin: ${plugin.name} (v${plugin.version})`
  );
  plugin.onInitialize();
}
