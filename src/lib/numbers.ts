import Big from "big.js";

export const formatNumberUSD = (
  number: number | string | bigint,
  opts?: { digits?: number; decimals?: number }
) => {
  opts = opts ?? { decimals: 0 };
  opts.decimals = opts.decimals ?? 0;

  const n = toBigWithDecimals(number, -opts.decimals);
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.digits,
    maximumFractionDigits: opts.digits,
  }).format(n.toNumber());
};

export const formatNumber = (
  number: number | string | bigint,
  opts?: { digits?: number; decimals?: number }
) => {
  opts = opts ?? { decimals: 0 };
  opts.decimals = opts.decimals ?? 0;

  const n = Big(String(number));
  const maximumFractionDigits =
    typeof opts.digits === "undefined" ? (n.lt(1) ? 8 : 4) : opts.digits;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(n.times(Math.pow(10, -opts.decimals)).toNumber());
};

/** Returns the given number multiplied by 10 ^ decimals, as a Big */
export const toBigWithDecimals = (
  n: number | string | bigint,
  decimals: number
) => Big(String(n)).times(Math.pow(10, decimals));

/** Returns the given number multiplied by 10 ^ decimals, as a BigInt */
export const toBigIntWithDecimals = (
  n: number | string | bigint,
  decimals: number
) => {
  return BigInt(toBigWithDecimals(n, decimals).toFixed(0));
};

export const pluralize = (str: string, n: number) =>
  n === 1 ? str : str + "s";
