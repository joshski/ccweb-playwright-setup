# Playwright Installation Issues

## Browser Download Fails (DNS Resolution)

Running `bunx playwright install chromium` fails with:

    Error: getaddrinfo EAI_AGAIN storage.googleapis.com

The Playwright browser download cannot reach `storage.googleapis.com` due to DNS
resolution failures in this environment. The download retries multiple times and
ultimately fails.

**Workaround:** A pre-cached Chromium browser exists at
`/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome` (Chromium 141.0.7390.37).
Use `executablePath` to point Playwright at this binary, which allows using any
version of Playwright (including the latest) without downloading browsers.

## Chromium Launch Requires Special Args

Chromium will not work in this container environment without the following launch args:

    --no-sandbox
    --disable-setuid-sandbox
    --disable-dev-shm-usage
    --disable-gpu

Without these flags, the browser either fails to launch or crashes during page
interactions (locator API calls result in "Target page, context or browser has
been closed" errors).

## Working Launch Configuration

Use `executablePath` to bypass browser download requirements entirely:

```ts
const browser = await chromium.launch({
  executablePath: "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
```

This works with the latest Playwright (tested with 1.58.2) despite the cached
browser being from an older revision (1194 / Chromium 141). The `channel` option
is not needed when `executablePath` is specified.

## Playwright Matchers Not Available in bun:test

Playwright's assertion matchers (`toBeVisible()`, `toHaveText()`, etc.) are part of
`@playwright/test` and are not available when using `bun:test`. Use Playwright's
locator API methods (`isVisible()`, `textContent()`) combined with bun:test's
`expect()` instead.
