# Contributing to ClareMesh

Thanks for considering a contribution. This guide covers what we welcome, how to set up, and what to expect from review.

## What we welcome

**Highest leverage:**
- New provider transforms (Sage Intacct, FreshBooks, Zoho Books, Wave, NetSuite improvements)
- Bug reports with a minimal failing test case
- Documentation improvements, especially code examples
- Translations of error messages and schema field labels

**Also welcome:**
- Performance improvements (with benchmarks)
- Schema additions (open an issue first to discuss)
- Tooling around the SDK (CLIs, codegen, IDE plugins)

**Not currently accepted:**
- Closed-source provider integrations
- Changes that would require breaking schema versions without a migration path
- Cosmetic refactors without a functional improvement

## Setup

```bash
git clone https://github.com/Malikfrazier35/ClareMesh.git
cd ClareMesh
npm install

# Build the packages
cd packages/schema && npm run build
cd ../transforms && npm run build

# Run tests
npm test
```

You'll need Node.js 20+ and a recent npm.

## Adding a new provider transform

1. Create a folder under `packages/transforms/src/<provider>/`
2. Implement transforms for at least one of: `Account`, `Transaction`
3. Add unit tests using fixture data from the provider's documentation
4. Update the README's provider coverage table
5. Update `/llms.txt` if the provider is significant

Example structure:
```
packages/transforms/src/yourprovider/
├── index.ts                          # public exports
├── account.ts                        # transformYourproviderAccount
├── transaction.ts                    # transformYourproviderTransaction
├── __fixtures__/
│   ├── account.example.json
│   └── transaction.example.json
└── __tests__/
    ├── account.test.ts
    └── transaction.test.ts
```

## Code style

- TypeScript strict mode
- Prettier-formatted (run `npm run format`)
- ESLint clean (run `npm run lint`)
- Tests via Vitest

## Commit conventions

We use Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `test:` adding tests
- `chore:` maintenance
- `perf:` performance

Example: `feat(transforms): add Sage Intacct account normalization`

## Pull request process

1. Fork the repo, create a feature branch from `main`
2. Make your changes with tests
3. Open a PR with a description of what and why
4. Maintainer review within 5 business days
5. Address feedback, squash if requested, merge

For substantial changes, open a discussion issue first so we can confirm direction before you invest time.

## Schema changes

Schema changes are versioned. Breaking changes (renaming fields, changing types, removing fields) require a major version bump and a migration guide. Additive changes (new optional fields) are minor versions.

If you're proposing a schema change:
1. Open an issue describing the change and rationale
2. Wait for maintainer feedback before implementation
3. Include a migration script if breaking

## License

By contributing, you agree that your contributions will be licensed under the MIT License (for `@claremesh/schema` and `@claremesh/transforms`).

## Questions

Open a [discussion](https://github.com/Malikfrazier35/ClareMesh/discussions) or email malik@claremesh.com.

