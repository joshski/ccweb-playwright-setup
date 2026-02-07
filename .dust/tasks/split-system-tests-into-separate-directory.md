# Split system tests into separate directory

Move browser/Playwright tests out of `index.test.ts` and into a `./system-tests/` directory, with one file per scenario. Configure separate dust checks so system tests and unit tests run independently.

## Current State

- `index.test.ts` contains one browser test scenario: "homepage shows heading" which launches a Bun server, opens Chromium via Playwright, and asserts an h1 element is visible with the correct text.
- `.dust/config/settings.json` has a single check: `bun test` which runs all tests.
- `bunfig.toml` configures a preload for all tests: `["./preload.ts"]`.

## Changes Required

### 1. Create `./system-tests/` directory

Create the directory `./system-tests/` at the project root.

### 2. Move the browser test scenario

Move the "homepage shows heading" test from `index.test.ts` into a new file `./system-tests/homepage-shows-heading.test.ts`. The file should contain the same test logic (Bun server, Playwright browser launch, h1 assertions). Keep imports and the 30-second timeout.

### 3. Remove browser test from `index.test.ts`

After moving the scenario, delete `index.test.ts` entirely since it only contains the one browser test. If there are no remaining unit tests, that's fine — the unit test check will simply pass with no test files found.

### 4. Update `.dust/config/settings.json`

Replace the single `bun test` check with two separate checks:

```json
{
  "dustCommand": "bunx dust",
  "checks": [
    {
      "name": "test",
      "command": "bun test --ignore=system-tests"
    },
    {
      "name": "system-test",
      "command": "bun test ./system-tests/"
    }
  ]
}
```

The `--ignore` flag in `bun test` excludes paths from the test run by glob pattern. This ensures the default `test` check runs only non-system tests, while `system-test` runs only the browser tests.

### 5. Ensure preload still applies to system tests

Verify that `bunfig.toml`'s preload (`["./preload.ts"]`) still applies when running `bun test ./system-tests/`. Bun's preload is global to the test runner, so it should work without changes. If it doesn't, add a `bunfig.toml` or preload configuration inside `./system-tests/`.

## Goals

(none)

## Blocked By

(none)

## Definition of Done

- [ ] `./system-tests/homepage-shows-heading.test.ts` exists and contains the "homepage shows heading" test scenario
- [ ] `index.test.ts` is deleted (no browser tests remain in the root)
- [ ] `.dust/config/settings.json` has two checks: one for unit tests (excluding system-tests), one for system tests only
- [ ] `bun test ./system-tests/` passes (system tests run successfully)
- [ ] `bun test --ignore=system-tests` passes (unit test check succeeds, even with no test files)
- [ ] The Playwright preload (`preload.ts`) still works for system tests
