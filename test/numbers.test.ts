import { BigNumber, ethers } from "ethers";
import lv from "../index";

describe("web3number 测试用例", () => {
  test("字符串转大数 - parseValue", () => {
    expect(lv.parseValue("100.12", 18)).toEqual(
      ethers.utils.parseUnits("100.12", 18)
    );
    expect(lv.parseValue("", 18)).toBeUndefined();
  });

  test("格式化大数 - formatAmount", () => {
    const bnNum1 = ethers.utils.parseUnits("1000.123456", 18);
    expect(lv.formatAmount(bnNum1, 18, 4, true, "-")).toEqual("1,000.1234");
    expect(lv.formatAmount(undefined, 18, 3, true, "-")).toEqual("-");
  });

  test("格式化大数并添加最大最小值限制 - formatTokenAmount", () => {
    expect(
      lv.formatTokenAmount(
        ethers.utils.parseUnits("10000.123456", 18),
        18,
        "eth",
        {
          displayDecimals: 4,
          useCommas: true,
          minThreshold: "0.01",
          maxThreshold: "100000",
        }
      )
    ).toEqual("10,000.1234 eth");

    expect(
      lv.formatTokenAmount(
        ethers.utils.parseUnits("10000.123456", 18),
        18,
        "eth",
        {
          displayDecimals: 2,
          useCommas: true,
          minThreshold: "0.01",
          maxThreshold: "1000",
        }
      )
    ).toEqual("> 1,000.00 eth");

    expect(
      lv.formatTokenAmount(ethers.utils.parseUnits("0.00988", 18), 18, "eth", {
        displayDecimals: 2,
        useCommas: true,
        minThreshold: "0.01",
        maxThreshold: "1000",
      })
    ).toEqual("< 0.01 eth");
  });

  test("格式化百分百 - formatPercentage", () => {
    expect(lv.formatPercentage(ethers.utils.parseUnits("100.12", 18), {})).toEqual("12.3456%");
  });


});
