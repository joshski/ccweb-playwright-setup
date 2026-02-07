import { test, expect } from "bun:test";
import { chromium } from "playwright";

test(
  "homepage shows heading",
  async () => {
    const server = Bun.serve({
      port: 0,
      routes: {
        "/": new Response(
          `<!DOCTYPE html><html><head><title>Hello Playwright</title></head><body><h1>Hello, Playwright!</h1></body></html>`,
          { headers: { "Content-Type": "text/html" } }
        ),
      },
    });

    const browser = await chromium.launch({
      executablePath: "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    try {
      const page = await browser.newPage();
      await page.goto(server.url.toString());
      const heading = page.locator("h1");
      expect(await heading.isVisible()).toBe(true);
      expect(await heading.textContent()).toBe("Hello, Playwright!");
    } finally {
      await browser.close();
      server.stop();
    }
  },
  { timeout: 30_000 }
);
