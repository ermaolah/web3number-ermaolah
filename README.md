# web3number

> The web3number-ermaolah npm package simplifies the handling of numerical values within the web3 environment, offering versatile functionalities for converting web3 BigNumber to human-readable formats with options for thousands separators and decimal precision. It also supports rounding down and conversion between BigNumber and ethers wei/ether.

## Install
```
// npm 
npm install web3number-ermaolah --save


// yarn
yarn add web3number-ermaolah
```

## Use
TODO
```

```

- bigNumberify: 将输入的值转换为 ethers.js 的 BigNumber 类型。

- expandDecimals: 将数值扩展为指定小数位数的整数。

- getLimitedDisplay: 获取有限的显示信息，根据指定阈值添加符号。

- trimZeroDecimals: 去掉小数末尾的零。

- limitDecimals: 限制小数位数。

- padDecimals: 补足小数位数。

- formatAmount: 格式化数值，包括小数位数控制、逗号分隔。

- formatUsd: 格式化 USD 数值，可指定小数位数和阈值。

- formatDeltaUsd: 格式化 USD 数值的变化，包括百分比。

- formatPercentage: 格式化百分比。

- formatTokenAmount: 格式化代币数值，支持显示阈值、千位分隔符等。

- formatTokenAmountWithUsd: 格式化带 USD 数值的代币数值。

- parseValue: 解析字符串为 BigNumber。

- numberWithCommas: 数值添加千位分隔符。

- roundUpDivision: 向上舍入的除法。

- applyFactor: 数值乘以因子。

- getBasisPoints: 计算基点数。

- basisPointsToFloat: 将基点数转为浮点数。

- roundToTwoDecimals: 四舍五入到两位小数。

- sumBigNumbers: 多个 BigNumber 求和。

removeTrailingZeros: 移除字符串尾随的零。


# developer
```
npm version patch
npm version minor
npm version major
```