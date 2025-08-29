export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Custom rules for better Italian/English support
    'type-enum': [
      2,
      'always',
      [
        'build',      // Changes that affect the build system or external dependencies
        'chore',      // Other changes that don't modify src or test files
        'ci',         // Changes to our CI configuration files and scripts
        'docs',       // Documentation only changes
        'feat',       // A new feature
        'fix',        // A bug fix
        'perf',       // A code change that improves performance
        'refactor',   // A code change that neither fixes a bug nor adds a feature
        'revert',     // Reverts a previous commit
        'style',      // Changes that do not affect the meaning of the code
        'test',       // Adding missing tests or correcting existing tests
        'wip',        // Work in progress (for development)
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [0], // Allow empty scopes
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0], // Allow any case for subject
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};