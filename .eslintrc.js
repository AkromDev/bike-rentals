module.exports = {
  extends: [
  '@mantine/eslint-config',     
  "plugin:react-hooks/recommended"
  ],
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
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
