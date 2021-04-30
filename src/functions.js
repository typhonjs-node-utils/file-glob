import fs         from 'fs';
import path       from 'path';

import glob       from 'glob';
import isGlob     from 'is-glob';

/**
 * Hydrates a list of files finally defined as globs. Bare directory paths will be converted to globs.
 *
 * @param {string|Array<string>} globs - A string or array of strings defining file globs. Any entry which is not
 *                                       a glob will be converted to an all inclusive glob.
 *
 * @returns {{files: string[], globs: string[]}}   An object with files and actual globs.
 */
export function hydrateGlob(globs)
{
   if (!Array.isArray(globs) && typeof globs !== 'string')
   {
      throw new TypeError(`'globs' is not a 'string' or an 'array'.`);
   }

   // If not an array then convert globEntry to an array.
   const globArray = Array.isArray(globs) ? globs : [globs];

   // Verify that all entries are strings.
   for (let cntr = 0; cntr < globArray.length; cntr++)
   {
      if (typeof globArray[cntr] !== 'string')
      {
         throw new TypeError(`'globs[${cntr}]: '${globArray[cntr]}' is not a 'string'.`);
      }
   }

   const actualGlobs = [];

   // Process glob array and if any entry is not a glob then convert it to an all inclusive glob.
   let files = [].concat(...globArray.map((entry) =>
   {
      // Convert raw file path to glob as necessary.
      if (!isGlob(entry))
      {
         // Determine if any included trailing path separator is included.
         const results = (/([\\/])$/).exec(entry);
         const pathSep = results !== null ? results[0] : path.sep;

         // Build all inclusive glob based on bare path and covert it into an array containing it.
         entry = entry.endsWith(pathSep) ? `${entry}**${pathSep}*` : `${entry}${pathSep}**${pathSep}*`;
      }

      // Store all glob entries to catch any ones converted to globs above.
      actualGlobs.push(entry);

      return glob.sync(path.resolve(entry));
   }));

   // Filter out non-files; IE directories
   files = files.filter((file) => fs.statSync(file).isFile());

   return { files, globs: actualGlobs };
}
