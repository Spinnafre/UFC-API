const serverConfig = {
  port: process.env.PORT || 8080,
  logsLevels: process.env.LOG_LEVEL || "info",
  isProduction: process.env.NODE_ENV === "production" ? true : false,
};

export { serverConfig };
