import globalConfig from "../config/index.js";
//全域變數用來比對上次資料
let oldData = [];

// 發送LINE通知
export const sendLineNotify = async (message, { type, title }) => {
  const url = "https://notify-api.line.me/api/notify";

  const { LINE_LOG_NOTIFY_TOKEN, LINE_ALERT_NOTIFY_TOKEN } = globalConfig;
  const tokenString =
    type === "log" ? LINE_LOG_NOTIFY_TOKEN : LINE_ALERT_NOTIFY_TOKEN;
  const tokenArr = tokenString.split(",");

  await Promise.all(
    tokenArr.map(async (token) => {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      };

      const body = new URLSearchParams({ message });

      try {
        const response = await fetch(url, { method: "POST", headers, body });
        const data = await response.json();
        if (data.status !== 200) {
          console.log(title, "通知失敗:", data);
        } else {
          console.log(title, "通知成功！");
        }
      } catch (error) {
        console.error("發生錯誤:", error);
      }
    })
  );
};

// 生成通知文字
export const genNotifyText = (notifyData) => {
  return notifyData
    .map((item) => {
      const googleMapAddress = item.發生地點
        ? `https://www.google.com/maps/search/${item.發生地點}`
        : "-";
      return `
  受理時間: ${item.受理時間 || "-"}
  案類: ${item.案類 || "-"}
  案別: ${item.案別 || "-"}
  發生地點: ${item.發生地點 || "-"}
  派遣分隊: ${item.派遣分隊 || "-"}
  執行狀況: ${item.執行狀況 || "-"}
  GoogleMap: ${googleMapAddress}
  =====`;
    })
    .join("");
};

// 比較新舊數據並決定是否通知
export const compareAndNotify = (response) => {
  if (!response.result) return [];

  const newData = response.data;
  const needNotify = [];

  if (oldData.length > 0) {
    newData.forEach((newItem) => {
      const match = oldData.find(
        (oldItem) =>
          oldItem["受理時間"] === newItem["受理時間"] &&
          oldItem["發生地點"] === newItem["發生地點"]
      );
      if (!match) {
        needNotify.push(newItem);
      }
    });
  } else {
    needNotify.push(...newData);
  }

  oldData = [...newData];
  return needNotify;
};
