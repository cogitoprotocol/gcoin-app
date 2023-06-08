export const formatNumberUSD = (number: any, digits: number = 2) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
};

export const formatNumber = (
  number: any,
  opts?: { digits?: number; decimals?: number }
) => {
  opts = opts ?? { decimals: 0 };
  opts.decimals = opts.decimals ?? 0;

  let n = number;
  if (typeof number !== "number") {
    n = Number(n);
  }
  n /= Math.pow(10, opts.decimals);
  const maximumFractionDigits =
    typeof opts.digits === "undefined" ? (number < 1 ? 8 : 4) : opts.digits;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(n);
};

/** Returns a BigInt from the given number, multiplied or divided by 10 ^ decimals */
export const withDecimals = (n: number | string | bigint, decimals: number) => {
  const s = String(n);
  let sepIdx = s.indexOf(".");
  if (sepIdx == -1) sepIdx = s.length;
  if (decimals < 0) {
    return BigInt(s.substring(0, sepIdx + decimals));
  }

  const remaining = Math.max(0, s.length - sepIdx - 1);
  const out =
    s.substring(0, sepIdx) +
    s.substring(sepIdx + 1, sepIdx + 1 + Math.min(remaining, decimals)) +
    "0".repeat(Math.max(0, decimals - remaining));
  return BigInt(out);
};

export const pluralize = (str: string, n: number) =>
  n === 1 ? str : str + "s";
