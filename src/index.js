import path from 'path';
import { createFilter } from '@rollup/pluginutils';
import { transformAsync } from '@babel/core';
import { evacuateFeaturesPlugin } from 'babel-plugin-transform-evacuate-features';
import babelTransformLwcBundlePlugin from './babel-lwc-bundle';

/**
 *
 */
const rollupLwcBundlePlugin = function(options = {}) {
  const { include, exclude, babelOptions = {} } = options;
  const filter = createFilter(include, exclude, { resolve: false });
  return {
    name: 'rollup-lwc-bundle-plugin',
    async renderChunk(_, chunk) {
      if (!filter(chunk.fileName)) {
        return null;
      }
      let { code, map } = await transformAsync(chunk.code, {
        configFile: path.resolve(__dirname, 'lwc-bundle.babel.config.js'),
        filename: name,
        ...babelOptions,
        plugins: [
          babelTransformLwcBundlePlugin,
          ...(babelOptions.plugins || [])
        ],
        inputSourceMap: chunk.map || false,
        minified: true
      });
      return { code, map };
    }
  };
};

export {
  evacuateFeaturesPlugin as babelLwcPreprocessPlugin,
  rollupLwcBundlePlugin
};

export default rollupLwcBundlePlugin;
