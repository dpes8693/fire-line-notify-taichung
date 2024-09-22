import { fetchUrl, parseResponse } from "./crawler/index.js";
import {
  compareAndNotify,
  genNotifyText,
  sendLineNotify,
} from "./notify/index.js";
import globalConfig from "./config/index.js";

// 主函數
const main = async () => {
  const url =
    "https://www.fire.taichung.gov.tw/caselist/index.asp?Parser=99,8,226";
  const json = await fetchUrl(url, parseResponse);

  // 日誌記錄
  if (globalConfig.APP_ENABLE_Log) {
    await sendLineNotify(JSON.stringify(json, null, 2), {
      type: "log",
      title: "raw data",
    });
  }

  // 發送通知
  const notifyData = compareAndNotify(json);
  const notifyString = genNotifyText(notifyData);
  if (notifyString) {
    await sendLineNotify(notifyString, { type: "default", title: "main" });
  }
};

console.info(`${new Date()}`);
// 爬蟲定時器
setInterval(main, globalConfig.APP_CRAWLER_INTERVAL_MINUTES * 1000 * 60);
if (globalConfig.LINE_NOTICE_ON_START) {
  sendLineNotify(`消防相關通知服務 啟動!`, {
    type: "default",
    title: "service start",
  });
}
