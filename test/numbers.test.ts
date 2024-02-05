import { BigNumber, ethers } from "ethers";
import {
  bigNumberify,
  expandDecimals,
  trimZeroDecimals,
  limitDecimals,
  padDecimals,
  formatAmount,
  formatUsd,
  numberWithCommas,
  parseValue,
  formatTokenAmount,
  formatTokenAmountWithUsd,
} from "../src/numbers";

describe("numbers utility functions", () => {
  test("bigNumberify", () => {
    expect(bigNumberify("123")).toEqual(BigNumber.from("123"));
    expect(bigNumberify(123)).toEqual(BigNumber.from("123"));
    expect(bigNumberify(BigNumber.from("123"))).toEqual(BigNumber.from("123"));
    expect(bigNumberify("abc")).toBeUndefined();
  });

  test("expandDecimals", () => {
    expect(expandDecimals("1", 2)).toEqual(BigNumber.from("100"));
    expect(expandDecimals("123", 0)).toEqual(BigNumber.from("123"));
    expect(expandDecimals("1.23", 1)).toEqual(BigNumber.from("12"));
  });


  test("trimZeroDecimals", () => {
    expect(trimZeroDecimals("123.00")).toEqual("123");
    expect(trimZeroDecimals("123.45")).toEqual("123.45");
  });

  test("limitDecimals", () => {
    expect(limitDecimals("123.456", 2)).toEqual("123.45");
    expect(limitDecimals("123.456", 0)).toEqual("123");
    expect(limitDecimals("123", 2)).toEqual("123");
  });

  test("padDecimals", () => {
    expect(padDecimals("123", 2)).toEqual("123.00");
    expect(padDecimals("123.4", 2)).toEqual("123.40");
    expect(padDecimals("123.456", 2)).toEqual("123.456");
  });

  test("formatAmount", () => {
    expect(formatAmount("123456789", 6, 2, true)).toEqual("123.46");
    expect(formatAmount("123456789", 6, 2, false)).toEqual("123.46");
    expect(formatAmount("123456789", 6, 0, true)).toEqual("123");
  });

  test("formatUsd", () => {
    expect(
      formatUsd(BigNumber.from("123456789"), { displayDecimals: 2 })
    ).toEqual("$1234567.89");
    expect(
      formatUsd(BigNumber.from("123456789"), { displayDecimals: 0 })
    ).toEqual("$1234567");
  });

  test("numberWithCommas", () => {
    const num = numberWithCommas("1000.998");
    expect(num).toEqual("1,000.998");

    const amount = parseValue("9880.5", 18)
    const num2 = formatTokenAmount(amount, 18, '', {displayDecimals: 1});
    expect(
      numberWithCommas(num2 || "") // Ensure num2 is defined
    ).toEqual("9,880.5");

    expect(
      numberWithCommas("")
    ).toEqual("...");
  });

  test("formatTokenAmount", () => {
    const amount = bigNumberify("50000100000000000000000")
    const num2 = formatTokenAmount(amount, 18, '', {displayDecimals: 1, useCommas: true});
    console.log(num2)
    expect(num2).toEqual("9,880.5");
   
  });

  // test("formatTokenAmountWithUsd", () => {
  //   const amount = parseValue("9880.5", 18)
  //   const usdAmount = parseValue("10000.12", 18)
  //   const num2 = formatTokenAmountWithUsd(amount, usdAmount, '',18, '', {displayDecimals: 1, useCommas: true});
  //   console.log(num2)
  // });
  test.only("formatPercentage", () => {
    const t = bigNumberify("-3000000000000000")
    const num2 = formatTokenAmount(t, 18, '', {
      displayDecimals: 2,
      useCommas: true,
      minThreshold: '0.01'
    });
    console.log(num2, t)
    // expect(num2).toEqual("-1.00%");

  });
});
