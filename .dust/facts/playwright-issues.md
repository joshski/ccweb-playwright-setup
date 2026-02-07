# Playwright Installation Issues

## Browser Download Fails (DNS Resolution)

Running `bunx playwright install chromium` fails with:

    Error: getaddrinfo EAI_AGAIN storage.googleapis.com

The Playwright browser download cannot reach `storage.googleapis.com` due to DNS
resolution failures in this environment. The download retries multiple times and
ultimately fails.

**Workaround:** A pre-cached Chromium browser exists at
`/root/.cache/ms-playwright/chromium-1194/` (Chromium 141.0.7390.37). Installing
`playwright@1.56.1` (instead of the latest) matches this cached browser revision
(1194), so no download is needed.

## Chromium Launch Requires Special Args

Chromium will not work in this container environment without the following launch args:

    --no-sandbox
    --disable-setuid-sandbox
    --disable-dev-shm-usage
    --disable-gpu

Without these flags, the browser either fails to launch or crashes during page
interactions (locator API calls result in "Target page, context or browser has
been closed" errors).

## Channel Option Required

The `channel: "chromium"` option must be passed to `chromium.launch()`. Without
it, the Playwright locator API (e.g., `heading.textContent()`, `heading.isVisible()`)
causes the page to crash, even though `page.evaluate()` works. Setting the channel
resolves this.

## Playwright Matchers Not Available in bun:test

Playwright's assertion matchers (`toBeVisible()`, `toHaveText()`, etc.) are part of
`@playwright/test` and are not available when using `bun:test`. Use Playwright's
locator API methods (`isVisible()`, `textContent()`) combined with bun:test's
`expect()` instead.
