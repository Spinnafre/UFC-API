export default {
  launchConfig: {
    headless: true,
    defaultViewport: null,
    timeout: null,
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
