import path             from 'path';

import { assert }       from 'chai';

import { hydrateGlob }  from '../../src/index.js';
import Plugin           from '../../src/index.js';

import PluginManager    from '@typhonjs-plugin/manager';

describe('Globs:', () =>
{
   describe('function:', () =>
   {
      it('hydrateGlob', () =>
      {
         // Glob upgrade for bare path / all inclusive
         let { files, globs } = hydrateGlob('./test/fixture/');

         files = files.map((file) => path.parse(file).base);

         assert.strictEqual(JSON.stringify(files), globVerifyFiles);
         assert.strictEqual(JSON.stringify(globs), globVerifyGlobs);

         ({ files, globs } = hydrateGlob(['./test/fixture/*.gz', './test/fixture/*.js']));

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

   describe('plugin:', () =>
   {
      it('hydrateGlob', async () =>
      {
         const pluginManager = new PluginManager();
         const eventbus = pluginManager.getEventbus();

         await pluginManager.add({ name: '@typhonjs-utils/file-glob', instance: Plugin });

         // Glob upgrade for bare path / all inclusive
         let { files, globs } = eventbus.triggerSync('typhonjs:utils:file:glob:hydrate', './test/fixture');

         files = files.map((file) => path.parse(file).base);

         assert.strictEqual(JSON.stringify(files), globVerifyFiles);
         assert.strictEqual(JSON.stringify(globs), globVerifyGlobs);

         ({ files, globs } = eventbus.triggerSync('typhonjs:utils:file:glob:hydrate',
          ['./test/fixture/*.gz', './test/fixture/*.js']));

         files = files.map((file) => path.parse(file).base);

         assert.strictEqual(JSON.stringify(files), globVerifyFiles);
         assert.strictEqual(JSON.stringify(globs), globVerifyGlobs2);
      });
   });
});

const globVerifyFiles = '["archive.tar.gz","archive2.tar.gz","test.js","test2.js","test3.js"]';
const globVerifyGlobs = '["./test/fixture/**/*"]';

const globVerifyGlobs2 = '["./test/fixture/*.gz","./test/fixture/*.js"]';
