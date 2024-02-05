import { bigNumberify } from "../index";
import lv from "../index";

async function main() {
  let bnNum1;
  console.info("字符串转大数");
  bnNum1 = lv.parseValue("100000000.23", 18);
  console.log(lv.parseValue("", 18));
  console.log(bnNum1?.toString());

  console.info("格式化大数");
  console.log(lv.formatAmount(bnNum1, 18, 3, true, "-"));
  console.log(lv.formatAmount(lv.parseValue("", 18), 18, 3, true, "-"));

  console.info("大数转字符串");
  console.log(
    lv.formatTokenAmount(bnNum1, 18, "eth", {
      displayDecimals: 2,
      useCommas: true,
      minThreshold: "0.01",
      maxThreshold: "100000",
    })
  );

  console.info("千分位");
  console.log(lv.numberWithCommas("100000.229"));
  console.log(lv.numberWithCommas(bigNumberify("100000") || ""));
}

main();
