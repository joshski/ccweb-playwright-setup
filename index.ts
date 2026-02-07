import { existsSync } from "fs";

const CHROMIUM_SEARCH_PATHS = [
  "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
  "/root/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell",
];

const DEFAULT_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

export function isClaudeCodeWeb(): boolean {
  return process.env.CLAUDE_CODE_ENTRYPOINT === "remote_desktop";
}

export function findChromium(): string | undefined {
  for (const path of CHROMIUM_SEARCH_PATHS) {
    if (existsSync(path)) return path;
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
