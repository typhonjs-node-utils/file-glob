import path             from 'path';

import { assert }       from 'chai';

import { hydrateGlob }  from '../../src/index.js';
import Plugin           from '../../src/index.js';

import PluginManager    from '@typhonjs-plugin/manager';

const ps = path.sep;

describe('Globs:', () =>
{
   describe('function:', () =>
   {
      it('hydrateGlob', () =>
      {
         // Glob upgrade for bare path / all inclusive
         let { files, globs } = hydrateGlob(`.${ps}test${ps}fixture${ps}`);

         files = files.map((file) => path.parse(file).base);

         assert.strictEqual(JSON.stringify(files), globVerifyFiles);
         assert.strictEqual(JSON.stringify(globs), globVerifyGlobs);

         ({ files, globs } = hydrateGlob([`.${ps}test${ps}fixture${ps}*.gz`, `.${ps}test${ps}fixture${ps}*.js`]));

         files = files.map((file) => path.parse(file).base);

         assert.strictEqual(JSON.stringify(files), globVerifyFiles);
         assert.strictEqual(JSON.stringify(globs), globVerifyGlobs2);
      });

      it('hydrateGlob (throws)', () =>
      {
         assert.throws(() => hydrateGlob());
         assert.throws(() => hydrateGlob(true));
         assert.throws(() => hydrateGlob(['string', true]));
      });
   });

   // `esm` used on Node 12.2.0 test doesn't like the minified distribution for `@typhonjs-plugin/manager`.
   if (process.version !== 'v12.2.0')
   {
      describe('plugin:', () =>
      {
         it('hydrateGlob', async () =>
         {
            const pluginManager = new PluginManager();
            const eventbus = pluginManager.getEventbus();

            await pluginManager.add({ name: '@typhonjs-utils/file-glob', instance: Plugin });

            // Glob upgrade for bare path / all inclusive
            let { files, globs } = eventbus.triggerSync('typhonjs:utils:file:glob:hydrate', `.${ps}test${ps}fixture`);

            files = files.map((file) => path.parse(file).base);

            assert.strictEqual(JSON.stringify(files), globVerifyFiles);
            assert.strictEqual(JSON.stringify(globs), globVerifyGlobs);

            ({ files, globs } = eventbus.triggerSync('typhonjs:utils:file:glob:hydrate',
               [`.${ps}test${ps}fixture${ps}*.gz`, `.${ps}test${ps}fixture${ps}*.js`]));

            files = files.map((file) => path.parse(file).base);

            assert.strictEqual(JSON.stringify(files), globVerifyFiles);
            assert.strictEqual(JSON.stringify(globs), globVerifyGlobs2);
         });
      });
   }
});

const globVerifyFiles = '["archive.tar.gz","archive2.tar.gz","test.js","test2.js","test3.js"]';
const globVerifyGlobs = `[".${ps}test${ps}fixture${ps}**${ps}*"]`;

const globVerifyGlobs2 = `[".${ps}test${ps}fixture${ps}*.gz",".${ps}test${ps}fixture${ps}*.js"]`;
