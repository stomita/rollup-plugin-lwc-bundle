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
    async renderChunk(inputCode, chunk) {
      if (!filter(chunk.fileName)) {
        return null;
      }
      const { code, map } = await transformAsync(inputCode, {
        configFile: path.resolve(__dirname, 'lwc-bundle.babel.config.js'),
        filename: chunk.fileName,
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
