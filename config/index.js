import dotenv from "dotenv";

const { env } = process;

// env.NODE_ENV ? `.env.${env.NODE_ENV}` : ".env",
dotenv.config({
  path: ".env",
});

const config = Object.freeze({
  APP_ENABLE_Log: env.APP_ENABLE_Log === "true" || false,
  LINE_NOTICE_ON_START: env.APP_CRAWLER_NOTICE_ON_START === "true" || true,
  LINE_LOG_NOTIFY_TOKEN: env.LINE_LOG_NOTIFY_TOKEN || "",
  LINE_ALERT_NOTIFY_TOKEN: env.LINE_ALERT_NOTIFY_TOKEN || "",
  APP_AT7: env.APP_AT7 || "",
  APP_CRAWLER_INCLUDE_CLASS: env.APP_CRAWLER_INCLUDE_CLASS || "火災",
  APP_CRAWLER_INTERVAL_MINUTES: Number(env.APP_CRAWLER_INTERVAL_MINUTES) || 1,
});

export default config;
