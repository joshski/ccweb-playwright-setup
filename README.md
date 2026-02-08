# ccweb-playwright-setup

Transparent Playwright setup for [Claude Code web](https://docs.anthropic.com/en/docs/claude-code). Makes `chromium.launch()` work without any configuration.

## What it does

Claude Code web runs in a container with a pre-cached Chromium binary that requires specific launch flags. This package detects the environment and patches Playwright's `chromium.launch()` to inject the correct `executablePath` and args automatically.

Outside Claude Code web, it does nothing.

## Setup

Install alongside Playwright:

```bash
bun add ccweb-playwright-setup playwright
```

Add the preload to `bunfig.toml`:

```toml
[test]
preload = ["ccweb-playwright-setup/preload"]
```

## Usage

Write normal Playwright code — no special imports or config needed:

```ts
import { test, expect } from "bun:test";
import { chromium } from "playwright";

test("my app works", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  expect(await page.locator("h1").isVisible()).toBe(true);
  await browser.close();
});
```

The same test works locally (using your normal Playwright install) and on Claude Code web (using the preload).

## Manual usage

If you prefer explicit control instead of the preload:

```ts
import { launchOptions } from "ccweb-playwright-setup";
import { chromium } from "playwright";

const browser = await chromium.launch(launchOptions());
```

`launchOptions()` returns `{ executablePath, args }` on Claude Code web, or `{}` elsewhere.

## How it works

The preload script:

1. Checks `CLAUDE_CODE_REMOTE` to detect Claude Code web
2. Finds the pre-cached Chromium binary
3. Wraps `chromium.launch()` to inject `executablePath` and container-required args (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`)
4. Preserves any options you pass — your overrides take priority

## Exports

- `isClaudeCodeWeb()` — returns `true` if running in Claude Code web
- `findChromium()` — returns the path to the cached Chromium binary, or `undefined`
- `launchOptions()` — returns Playwright-compatible launch options for the current environment
