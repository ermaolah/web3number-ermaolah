import { BigNumber, BigNumberish, ethers } from "ethers";

// 预设值
export const PRECISION: BigNumber = expandDecimals(1, 30);
export const USD_DECIMALS: number = 30;
export const BASIS_POINTS_DIVISOR: number = 10000;
export const TRIGGER_PREFIX_ABOVE: string = ">";
export const TRIGGER_PREFIX_BELOW: string = "<";

// 阈值
const MAX_EXCEEDING_THRESHOLD: string = "1000000000";
const MIN_EXCEEDING_THRESHOLD: string = "0.01";

// 将输入的值转换为 ethers.js 的 BigNumber 类型
export function bigNumberify(n?: BigNumberish): BigNumber {
  try {
    return BigNumber.from(n);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("bigNumberify error", e);
    return BigNumber.from(0); // or handle error appropriately
  }
}

// 将数值扩展为指定小数位数的整数
export function expandDecimals(n: BigNumberish, decimals: number): BigNumber {
  return bigNumberify(n).mul(bigNumberify(10).pow(decimals));
}

// 获取有限的显示信息，根据指定阈值添加符号
function getLimitedDisplay(
  amount: BigNumber,
  tokenDecimals: number,
  opts: { maxThreshold?: string; minThreshold?: string } = {}
): { symbol: string; value: BigNumber } {
  const {
    maxThreshold = MAX_EXCEEDING_THRESHOLD,
    minThreshold = MIN_EXCEEDING_THRESHOLD,
  }: {
    maxThreshold?: string;
    minThreshold?: string;
  } = opts;

  const max: BigNumber = expandDecimals(maxThreshold, tokenDecimals);
  const min: BigNumber = ethers.utils.parseUnits(minThreshold, tokenDecimals);
  const absAmount: BigNumber = amount.abs();

  if (absAmount.eq(0)) {
    return {
      symbol: "",
      value: absAmount,
    };
  }

  const symbol: string = absAmount.gt(max)
    ? TRIGGER_PREFIX_ABOVE
    : absAmount.lt(min)
    ? TRIGGER_PREFIX_BELOW
    : "";
  const value: BigNumber = absAmount.gt(max)
    ? max
    : absAmount.lt(min)
    ? min
    : absAmount;

  return {
    symbol,
    value,
  };
}

// 去掉小数末尾的零
export const trimZeroDecimals = (amount: string): string => {
  if (parseFloat(amount) === parseInt(amount)) {
    return parseInt(amount).toString();
  }
  return amount;
};

// 限制小数位数
export const limitDecimals = (
  amount: BigNumberish,
  maxDecimals?: number
): string => {
  let amountStr: string = amount.toString();
  if (maxDecimals === undefined) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex: number = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    let decimals: number = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals)
      );
    }
  }

  return amountStr;
};

// 补足小数位数
export const padDecimals = (
  amount: BigNumberish,
  minDecimals: number
): string => {
  let amountStr: string = amount.toString();
  const dotIndex: number = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals: number = amountStr.length - dotIndex - 1;
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(
        amountStr.length + (minDecimals - decimals),
        "0"
      );
    }
  } else {
    amountStr = amountStr + ".0000";
  }
  return amountStr;
};

// 格式化数值
export const formatAmount = (
  amount: BigNumberish | undefined,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas?: boolean,
  defaultValue?: string
): string => {
  // 默认值
  if (!defaultValue) {
    defaultValue = "...";
  }
  // 未定义或空字符串返回默认值
  if (amount === undefined || amount.toString().length === 0) {
    return defaultValue;
  }
  // 默认显示小数位数
  if (displayDecimals === undefined) {
    displayDecimals = 4;
  }
  // 格式化数值
  let amountStr: string = ethers.utils.formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  // 是否使用逗号分隔
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
};

// 格式化键值对中的数值
export const formatKeyAmount = (
  map: any,
  key: string,
  tokenDecimals: number,
  displayDecimals: number,
  useCommas?: boolean
): string => {
  if (!map || !map[key]) {
    return "...";
  }

  return formatAmount(map[key], tokenDecimals, displayDecimals, useCommas);
};

// 格式化数组中指定位置的数值
export const formatArrayAmount = (
  arr: any[],
  index: number,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas?: boolean
): string => {
  if (!arr || !arr[index]) {
    return "...";
  }

  return formatAmount(arr[index], tokenDecimals, displayDecimals, useCommas);
};

// 格式化数值，去掉尾随零
export const formatAmountFree = (
  amount: BigNumberish,
  tokenDecimals: number,
  displayDecimals?: number
): string => {
  if (!amount) {
    return "...";
  }
  let amountStr: string = ethers.utils.formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  return trimZeroDecimals(amountStr);
};

// 格式化 USD 数值
export function formatUsd(
  usd?: BigNumber,
  opts: {
    fallbackToZero?: boolean;
    displayDecimals?: number;
    maxThreshold?: string;
    minThreshold?: string;
  } = {}
): string | undefined {
  const { fallbackToZero = false, displayDecimals = 2 } = opts;

  if (!usd) {
    if (fallbackToZero) {
      usd = BigNumber.from(0);
    } else {
      return undefined;
    }
  }

  const exceedingInfo: { symbol: string; value: BigNumber } = getLimitedDisplay(
    usd,
    USD_DECIMALS,
    opts
  );
  const sign: string = usd.lt(0) ? "-" : "";
  const displayUsd: string = formatAmount(
    exceedingInfo.value,
    USD_DECIMALS,
    displayDecimals,
    true
  );
  return `${exceedingInfo.symbol}${
    exceedingInfo.symbol ? " " : ""
  }${sign}$${displayUsd}`;
}

// 格式化 USD 数值的变化
export function formatDeltaUsd(
  deltaUsd?: BigNumber,
  percentage?: BigNumber,
  opts: { fallbackToZero?: boolean; showPlusForZero?: boolean } = {}
): string | undefined {
  if (!deltaUsd) {
    if (opts.fallbackToZero) {
      return `${formatUsd(BigNumber.from(0))} (${formatAmount(
        BigNumber.from(0),
        2,
        2
      )}%)`;
    }

    return undefined;
  }

  let sign: string = "";
  if (!deltaUsd.eq(0)) {
    sign = deltaUsd?.gt(0) ? "+" : "-";
  } else if (opts.showPlusForZero) {
    sign = "+";
  }
  const exceedingInfo: { symbol: string; value: BigNumber } = getLimitedDisplay(
    deltaUsd,
    USD_DECIMALS
  );
  const percentageStr: string = percentage
    ? ` (${sign}${formatPercentage(percentage.abs())})`
    : "";
  const deltaUsdStr: string = formatAmount(
    exceedingInfo.value,
    USD_DECIMALS,
    2,
    true
  );

  return `${exceedingInfo.symbol} ${sign}$${deltaUsdStr}${percentageStr}`;
}

// 格式化百分比
export function formatPercentage(
  percentage?: BigNumber,
  opts: { fallbackToZero?: boolean; signed?: boolean } = {}
): string | undefined {
  const { fallbackToZero = false, signed = false } = opts;

  if (!percentage) {
    if (fallbackToZero) {
      return `${formatAmount(BigNumber.from(0), 2, 2)}%`;
    }

    return undefined;
  }

  let sign: string = "";

  if (signed && !percentage.eq(0)) {
    sign = percentage?.gt(0) ? "+" : "-";
  }

  return `${sign}${formatAmount(percentage.abs(), 2, 2)}%`;
}

// 格式化代币数值
export function formatTokenAmount(
  amount?: BigNumber,
  tokenDecimals?: number,
  symbol?: string,
  opts: {
    showAllSignificant?: boolean;
    displayDecimals?: number;
    fallbackToZero?: boolean;
    useCommas?: boolean;
    minThreshold?: string;
    maxThreshold?: string;
  } = {}
): string | undefined {
  const {
    displayDecimals = 4,
    showAllSignificant = false,
    fallbackToZero = false,
    useCommas = false,
    minThreshold = "0",
    maxThreshold,
  } = opts;

  const symbolStr: string = symbol ? ` ${symbol}` : "";

  if (!amount || !tokenDecimals) {
    if (fallbackToZero) {
      amount = BigNumber.from(0);
      tokenDecimals = displayDecimals;
    } else {
      return undefined;
    }
  }

  let amountStr: string;

  if (showAllSignificant) {
    amountStr = formatAmountFree(amount, tokenDecimals, tokenDecimals);
  } else {
    const exceedingInfo: { symbol: string; value: BigNumber } =
      getLimitedDisplay(amount, tokenDecimals, {
        maxThreshold,
        minThreshold,
      });
    const symbol: string = exceedingInfo.symbol
      ? `${exceedingInfo.symbol} `
      : "";
    amountStr = `${symbol}${formatAmount(
      exceedingInfo.value,
      tokenDecimals,
      displayDecimals,
      useCommas
    )}`;
  }

  return `${amountStr}${symbolStr}`;
}

// 格式化带 USD 数值的代币数值
export function formatTokenAmountWithUsd(
  tokenAmount?: BigNumber,
  usdAmount?: BigNumber,
  tokenSymbol?: string,
  tokenDecimals?: number,
  opts: {
    fallbackToZero?: boolean;
    displayDecimals?: number;
  } = {}
): string | undefined {
  if (!tokenAmount || !usdAmount || !tokenSymbol || !tokenDecimals) {
    if (!opts.fallbackToZero) {
      return undefined;
    }
  }

  const tokenStr = formatTokenAmount(tokenAmount, tokenDecimals, tokenSymbol, {
    ...opts,
    useCommas: true,
  });

  const usdStr = formatUsd(usdAmount, {
    fallbackToZero: opts.fallbackToZero,
  });

  return `${tokenStr} (${usdStr})`;
}

// 解析字符串为 BigNumber
export const parseValue = (
  value: string,
  tokenDecimals: number
): BigNumber | undefined => {
  const pValue: number = parseFloat(value);

  if (isNaN(pValue)) {
    return undefined;
  }
  value = limitDecimals(value, tokenDecimals);
  const amount: BigNumber = ethers.utils.parseUnits(value, tokenDecimals);
  return bigNumberify(amount);
};

// 数值添加千位分隔符
export function numberWithCommas(x: BigNumberish): string {
  if (!x) {
    return "...";
  }

  const parts: string[] = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// 向上舍入的除法
export function roundUpDivision(a: BigNumber, b: BigNumber): BigNumber {
  return a.add(b).sub(1).div(b);
}

// 带方向的向上舍入的除法
export function roundUpMagnitudeDivision(
  a: BigNumber,
  b: BigNumber
): BigNumber {
  if (a.lt(0)) {
    return a.sub(b).add(1).div(b);
  }

  return a.add(b).sub(1).div(b);
}

// 数值乘以因子
export function applyFactor(value: BigNumber, factor: BigNumber): BigNumber {
  return value.mul(factor).div(PRECISION);
}

// 计算基点数
export function getBasisPoints(
  numerator: BigNumber,
  denominator: BigNumber,
  shouldRoundUp = false
): BigNumber {
  const result: BigNumber = numerator
    .mul(BASIS_POINTS_DIVISOR)
    .div(denominator);

  if (shouldRoundUp) {
    const remainder: BigNumber = numerator
      .mul(BASIS_POINTS_DIVISOR)
      .mod(denominator);
    if (!remainder.isZero()) {
      return result.isNegative() ? result.sub(1) : result.add(1);
    }
  }

  return result;
}

// 将基点数转为浮点数
export function basisPointsToFloat(basisPoints: BigNumber): BigNumber {
  return basisPoints.mul(PRECISION).div(BASIS_POINTS_DIVISOR);
}

// 四舍五入到两位小数
export function roundToTwoDecimals(n: number): number {
  return Math.round(n * 100) / 100;
}

// 多个 BigNumber 求和
export function sumBigNumbers(...args: BigNumber[]): BigNumber {
  return args
    .filter((value) => !isNaN(Number(value)))
    .reduce((acc, value) => acc.add(value || 0), BigNumber.from(0));
}

// 移除字符串尾随的零
export function removeTrailingZeros(amount: string | number): string | number {
  const amountWithoutZeros: number = Number(amount);
  if (!amountWithoutZeros) return amount;
  return amountWithoutZeros;
}
