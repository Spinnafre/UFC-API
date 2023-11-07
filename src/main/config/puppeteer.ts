export const puppeterrConfig = {
  launchConfig: {
    headless: "new",
    defaultViewport: { width: 640, height: 480 },
    timeout: 40000,
    waitForInitialPage: true,
    args: [
      "--disable-web-security",
      "--no-sandbox",
      "--single-process",
      "--disable-setuid-sandbox",
      "--no-zygote",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  },
  timeoutToRequest: 10000,
};
