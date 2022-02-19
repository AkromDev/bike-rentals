module.exports = {
  extends: ['@mantine/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
  },

  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', 
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }
    ],
    "@typescript-eslint/no-use-before-define": 0,
  },
};
