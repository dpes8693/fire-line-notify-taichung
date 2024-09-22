//!! Node.js 18 LTS or later !!
// npm i cheerio
import * as cheerio from "cheerio";
import globalConfig from "../config/index.js";

// 獲取URL內容
export const fetchUrl = async (url, func) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const body = await response.text();
    return func(body);
  } catch (error) {
    console.error("Fetch error:", error);
    return { result: false, message: error.message };
  }
};

// 解析爬蟲回應
export const parseResponse = (body) => {
  const $ = cheerio.load(body);
  const dataList = [];

  const listItems = $(".rwd-table > li:not(.list_head)");

  listItems.each((_, element) => {
    const fields = $(element).find("span");
    const data = {
      受理時間: $(fields[0]).text().trim(),
      案類: $(fields[1]).text().trim(),
      案別: $(fields[2]).text().trim(),
      發生地點: $(fields[3]).find("button").attr("js_addr").trim(),
      派遣分隊: $(fields[5]).text().trim(),
      執行狀況: $(fields[6]).text().trim(),
    };

    const includeClass = globalConfig.APP_CRAWLER_INCLUDE_CLASS;
    const isMatch = includeClass.split(",").includes(data.案類);
    if (!isMatch || dataList.length >= 5) {
      return;
    }

    dataList.push(data);
  });

  return {
    result: dataList.length > 0,
    message: dataList.length > 0 ? "ok" : "無資料",
    data: dataList,
  };
};
