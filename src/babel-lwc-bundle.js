import * as t from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import { unevacuateFeaturesPlugin } from 'babel-plugin-transform-evacuate-features';

/**
 *
 */
const LWC_DECORATORS = ['track', 'api', 'wire'];

/**
 *
 */
const babelTransformLwcBundlePlugin = declare((api, options) => {
  api.assertVersion(7);
  const plugin = unevacuateFeaturesPlugin(api, options);
  return {
    ...plugin,
    name: 'transform-lwc-bundle',
    visitor: {
      ...plugin.visitor,
      ImportDeclaration(path) {
        const { node } = path;
        if (node.source.value === 'lwc') {
          node.specifiers = [
            ...node.specifiers.filter(
              spec => !LWC_DECORATORS.includes(spec.imported)
            ),
            ...LWC_DECORATORS.map(decorator =>
              t.importSpecifier(
                t.identifier(decorator),
                t.identifier(decorator)
              )
            )
          ];
        }
      }
    }
  };
});

export default babelTransformLwcBundlePlugin;
