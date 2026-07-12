interface MentorPlugin {
    id: string;
    name: string;
    version: string;
    onInitialize: () => void;
    onExecute: (context: unknown) => unknown;
}
declare function registerPlugin(plugin: MentorPlugin): void;

export { type MentorPlugin, registerPlugin };
