import { hydrateGlob }  from './functions.js';

export default class FileGlobPlugin
{
   /**
    * Wires up FileUtil functions on the plugin eventbus.
    *
    * @param {object} ev - PluginInvokeEvent - The plugin event.
    *
    * @see https://www.npmjs.com/package/@typhonjs-plugin/manager
    */
   static onPluginLoad(ev)
   {
      const eventbus = ev.eventbus;

      eventbus.on(`typhonjs:utils:file:glob:hydrate`, hydrateGlob, hydrateGlob, true);
   }
}
