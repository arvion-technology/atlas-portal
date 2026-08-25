# Contributing

Thanks for taking a look. This project is maintained by
[Arvion Technologies](https://arviontech.net) and contributions are welcome.

## Development

```bash
git clone https://github.com/arvion-technology/atlas-portal.git
cd atlas-portal
npm ci        # installs Next, React and TypeScript from the lockfile
```

## Before you open a pull request

1. `npm test` passes locally.
2. `npm run build` succeeds; the static export is part of the contract.
3. New behaviour has tests and (if user-facing) documentation.
4. Run `npm run build && npm run prepare-demo` if a page changed, and commit the regenerated `demo/` output.
5. The diff stays focused: one concern per pull request.
6. Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`).

## Reporting bugs

Open an issue with reproduction steps, expected vs actual behaviour, and your
environment. For security issues see [SECURITY.md](SECURITY.md).
