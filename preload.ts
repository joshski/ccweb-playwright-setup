import { isClaudeCodeWeb, findChromium } from "./index";

if (isClaudeCodeWeb()) {
  const executablePath = findChromium();
  if (executablePath) {
    const { chromium } = await import("playwright");
    const originalLaunch = chromium.launch.bind(chromium);

    const defaultArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ];

    chromium.launch = async (options = {}) => {
      return originalLaunch({
        ...options,
        executablePath: options.executablePath ?? executablePath,
        args: [...defaultArgs, ...(options.args ?? [])],
      });
    };
  }
}
