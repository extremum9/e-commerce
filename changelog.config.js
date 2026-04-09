const types = {
  a11y: {
    description: 'An accessibility improvement or fix',
    emoji: '♿',
    value: 'a11y'
  },
  feat: {
    description: 'A new feature',
    emoji: '🎸',
    value: 'feat'
  },
  fix: {
    description: 'A bug fix',
    emoji: '🐛',
    value: 'fix'
  },
  test: {
    description: 'Adding missing or correcting existing tests',
    emoji: '💍',
    value: 'test'
  },
  build: {
    description: 'Changes that affect the build system',
    emoji: '📦',
    value: 'build'
  },
  chore: {
    description: 'Other changes that do not modify src or test files',
    emoji: '🤖',
    value: 'chore'
  },
  perf: {
    description: 'A code change that improves performance',
    emoji: '🚀',
    value: 'perf'
  },
  docs: {
    description: 'Documentation only changes',
    emoji: '✏️',
    value: 'docs'
  },
  refactor: {
    description: 'A code change that neither fixes a bug or adds a feature',
    emoji: '💡',
    value: 'refactor'
  },
  style: {
    description: 'Markup, white-space, formatting, missing semi-colons...',
    emoji: '💄',
    value: 'style'
  },
  ci: {
    description: 'CI related changes',
    emoji: '🎡',
    value: 'ci'
  },
  revert: {
    description: 'Revert a previous commit',
    emoji: '🗑️',
    value: 'revert'
  }
};

module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: Object.keys(types),
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues'],
  scopes: [
    '',
    'linter',
    'styles',
    'e2e',
    'firestore-rules',
    'snackbar',
    'auth',
    'layout',
    'products',
    'wishlist',
    'cart',
    'back-button',
    'confirm-dialog',
    'star-rating'
  ],
  types
};
