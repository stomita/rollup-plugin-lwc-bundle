import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import { babelLwcPreprocessPlugin, rollupLwcBundlePlugin } from '../src';

describe('rollup lwc bundle', () => {
  async function bundle(input, rollupOptions = {}) {
    const bundle = await rollup({
      input,
      plugins: [
        babel({
          babelrc: false,
          plugins: [babelLwcPreprocessPlugin],
          parserOpts: {
            plugins: ['classProperties', 'decorators-legacy'],
          }
        }),
        rollupLwcBundlePlugin()
      ],
      external: ['lwc'],
      output: { format: 'es' },
      ...rollupOptions
    });
    const {
      output: [generated]
    } = await bundle.generate({});
    return generated;
  }

  const testdirs = fs.readdirSync(path.resolve(__dirname, 'fixtures'));
  for (const testdir of testdirs) {
    test(testdir, async () => {
      const inputFile = path.resolve(__dirname, `fixtures/${testdir}/input.js`);
      const outputFile = path.resolve(__dirname, `fixtures/${testdir}/output.js`);
      const { code } = await bundle(inputFile);
      let expected;
      try {
        expected = fs.readFileSync(outputFile, 'utf8');
      } catch(e) {
        fs.writeFileSync(outputFile, code, 'utf8');
      }
      if (expected) {
        expect(code).toBe(expected);
      }
    });
  }
});
