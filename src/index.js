import path from 'path';
import { transformAsync } from '@babel/core';
import { evacuateFeaturesPlugin } from 'babel-plugin-transform-evacuate-features';
import babelTransformLwcBundlePlugin from './babel-lwc-bundle';

/**
 *
 */
const rollupLwcBundlePlugin = function({ babelOptions = {} } = {}) {
  return {
    name: 'rollup-lwc-bundle-plugin',
    async generateBundle(_, bundle) {
      for (const name of Object.keys(bundle)) {
        const info = bundle[name];
        const { code, map } = await transformAsync(info.code, {
          configFile: path.resolve(__dirname, 'lwc-bundle.babel.config.js'),
          filename: name,
          ...babelOptions,
          plugins: [
            babelTransformLwcBundlePlugin,
            ...(babelOptions.plugins || []),
          ],
          inputSourceMap: info.map || false,
          minified: true,
        });
        info.code = code;
        if (map) {
          info.map = map;
        }
      }
      return null;
    }
  };
};

export {
  evacuateFeaturesPlugin as babelLwcPreprocessPlugin,
  rollupLwcBundlePlugin
};

export default rollupLwcBundlePlugin;
