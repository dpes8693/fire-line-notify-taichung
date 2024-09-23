//掛載
import express from "express";
import { sendLineNotify } from "../notify/index.js";
import globalConfig from "../config/index.js";
import { main } from "../util/index.js";

//使用
const app = express();

let timer = null;
app.post("/start", express.json(), (req, res) => {
  if (req.body?.at7 === globalConfig.APP_AT7) {
    console.info(`${new Date()}  service start`);
    // 爬蟲定時器
    timer = setInterval(
      main,
      globalConfig.APP_CRAWLER_INTERVAL_MINUTES * 1000 * 60
    );
    if (globalConfig.LINE_NOTICE_ON_START) {
      sendLineNotify(`消防相關通知服務 啟動!`, {
        type: "default",
        title: "service start",
      });
    }

    res.send("ok");
  } else {
    res.send("wrong password");
  }
});

app.post("/stop", express.json(), (req, res) => {
  if (req.body?.at7 === globalConfig.APP_AT7) {
    console.info(`${new Date()} service stop`);
    clearInterval(timer);
    res.send("ok");
  } else {
    res.send("wrong password");
  }
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

//監聽
app.listen(3000, () => console.log("http://localhost:3000/"));
