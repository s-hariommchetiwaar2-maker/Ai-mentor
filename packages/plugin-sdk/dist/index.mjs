// src/index.ts
function registerPlugin(plugin) {
  console.log(
    `[Plugin SDK] Registering plugin: ${plugin.name} (v${plugin.version})`
  );
  plugin.onInitialize();
}
export {
  registerPlugin
};
