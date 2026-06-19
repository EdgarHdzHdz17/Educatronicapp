// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/no-unknown-property': [
        'warn',
        {
          ignore: [
            'args',
            'attach',
            'castShadow',
            'color',
            'dispose',
            'fog',
            'geometry',
            'intensity',
            'linewidth',
            'map',
            'material',
            'metalness',
            'object',
            'opacity',
            'position',
            'receiveShadow',
            'rotation',
            'roughness',
            'scale',
            'side',
            'toneMapped',
            'transparent',
            'visible',
            'wireframe',
          ],
        },
      ],
    },
  },
]);
