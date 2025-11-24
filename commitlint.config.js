module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'a11y',
        'feat',
        'fix',
        'test',
        'build',
        'chore',
        'perf',
        'docs',
        'refactor',
        'style',
        'ci',
        'revert',
      ],
    ],
  },
};
