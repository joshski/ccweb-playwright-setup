import { existsSync, readdirSync } from "fs";
import { join } from "path";

const PLAYWRIGHT_CACHE = "/root/.cache/ms-playwright";

const DEFAULT_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

export function isClaudeCodeWeb(): boolean {
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint === "remote_desktop" || entrypoint === "remote";
}

export function findChromium(): string | undefined {
  if (!existsSync(PLAYWRIGHT_CACHE)) return undefined;

  const entries = readdirSync(PLAYWRIGHT_CACHE).sort().reverse();

  // Prefer full chromium over headless shell
  for (const pattern of [/^chromium-\d+$/, /^chromium_headless_shell-\d+$/]) {
    for (const entry of entries) {
      if (!pattern.test(entry)) continue;
      const candidates = [
        join(PLAYWRIGHT_CACHE, entry, "chrome-linux", "chrome"),
        join(PLAYWRIGHT_CACHE, entry, "chrome-linux", "headless_shell"),
      ];
      for (const path of candidates) {
        if (existsSync(path)) return path;
      }
    }
  }

  return undefined;
}

export function launchOptions(): {
  executablePath?: string;
  args?: string[];
} {
  if (!isClaudeCodeWeb()) return {};
  const executablePath = findChromium();
  if (!executablePath) return {};
  return { executablePath, args: DEFAULT_ARGS };
}
