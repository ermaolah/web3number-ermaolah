"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const numbers_1 = require("../src/numbers");
describe("numbers utility functions", () => {
    test("bigNumberify", () => {
        expect((0, numbers_1.bigNumberify)("123")).toEqual(ethers_1.BigNumber.from("123"));
        expect((0, numbers_1.bigNumberify)(123)).toEqual(ethers_1.BigNumber.from("123"));
        expect((0, numbers_1.bigNumberify)(ethers_1.BigNumber.from("123"))).toEqual(ethers_1.BigNumber.from("123"));
        expect((0, numbers_1.bigNumberify)("abc")).toBeUndefined();
    });
    test("expandDecimals", () => {
        expect((0, numbers_1.expandDecimals)("1", 2)).toEqual(ethers_1.BigNumber.from("100"));
        expect((0, numbers_1.expandDecimals)("123", 0)).toEqual(ethers_1.BigNumber.from("123"));
        expect((0, numbers_1.expandDecimals)("1.23", 1)).toEqual(ethers_1.BigNumber.from("12"));
    });
    test("trimZeroDecimals", () => {
        expect((0, numbers_1.trimZeroDecimals)("123.00")).toEqual("123");
        expect((0, numbers_1.trimZeroDecimals)("123.45")).toEqual("123.45");
    });
    test("limitDecimals", () => {
        expect((0, numbers_1.limitDecimals)("123.456", 2)).toEqual("123.45");
        expect((0, numbers_1.limitDecimals)("123.456", 0)).toEqual("123");
        expect((0, numbers_1.limitDecimals)("123", 2)).toEqual("123");
    });
    test("padDecimals", () => {
        expect((0, numbers_1.padDecimals)("123", 2)).toEqual("123.00");
        expect((0, numbers_1.padDecimals)("123.4", 2)).toEqual("123.40");
        expect((0, numbers_1.padDecimals)("123.456", 2)).toEqual("123.456");
    });
    test("formatAmount", () => {
        expect((0, numbers_1.formatAmount)("123456789", 6, 2, true)).toEqual("123.46");
        expect((0, numbers_1.formatAmount)("123456789", 6, 2, false)).toEqual("123.46");
        expect((0, numbers_1.formatAmount)("123456789", 6, 0, true)).toEqual("123");
    });
    test("formatUsd", () => {
        expect((0, numbers_1.formatUsd)(ethers_1.BigNumber.from("123456789"), { displayDecimals: 2 })).toEqual("$1234567.89");
        expect((0, numbers_1.formatUsd)(ethers_1.BigNumber.from("123456789"), { displayDecimals: 0 })).toEqual("$1234567");
    });
    test("numberWithCommas", () => {
        const num = (0, numbers_1.numberWithCommas)("1000.998");
        expect(num).toEqual("1,000.998");
        const amount = (0, numbers_1.parseValue)("9880.5", 18);
        const num2 = (0, numbers_1.formatTokenAmount)(amount, 18, '', { displayDecimals: 1 });
        expect((0, numbers_1.numberWithCommas)(num2 || "") // Ensure num2 is defined
        ).toEqual("9,880.5");
        expect((0, numbers_1.numberWithCommas)("")).toEqual("...");
    });
    test("formatTokenAmount", () => {
        const amount = (0, numbers_1.bigNumberify)("50000100000000000000000");
        const num2 = (0, numbers_1.formatTokenAmount)(amount, 18, '', { displayDecimals: 1, useCommas: true });
        console.log(num2);
        expect(num2).toEqual("9,880.5");
    });
    // test("formatTokenAmountWithUsd", () => {
    //   const amount = parseValue("9880.5", 18)
    //   const usdAmount = parseValue("10000.12", 18)
    //   const num2 = formatTokenAmountWithUsd(amount, usdAmount, '',18, '', {displayDecimals: 1, useCommas: true});
    //   console.log(num2)
    // });
    test.only("formatPercentage", () => {
        const t = (0, numbers_1.bigNumberify)("-3000000000000000");
        const num2 = (0, numbers_1.formatTokenAmount)(t, 18, '', {
            displayDecimals: 2,
            useCommas: true,
            minThreshold: '0.01'
        });
        console.log(num2, t);
        // expect(num2).toEqual("-1.00%");
    });
});
