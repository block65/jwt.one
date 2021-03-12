module.exports = {
  extends: ['@block65', '@block65/eslint-config/react'],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
