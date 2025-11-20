namespace unit {
  export const µs = 1000n;
  export const ms = µs * 1000n;
  export const s = ms * 1000n;
  export const m = s * 60n;
  export const h = m * 60n;
  export const d = h * 24n;
  export const w = d * 7n;
  export const y = d * 365n + h * 6n;
  export const mo = y / 12n;
}

type Years = "years" | "year" | "yrs" | "yr" | "y";
type Months = "months" | "month" | "mo";
type Weeks = "weeks" | "week" | "w";
type Days = "days" | "day" | "d";
type Hours = "hours" | "hour" | "hrs" | "hr" | "h";
type Minutes = "minutes" | "minute" | "mins" | "min" | "m";
type Seconds = "seconds" | "second" | "secs" | "sec" | "s";
type Milliseconds = "milliseconds" | "millisecond" | "msecs" | "msec" | "ms";
type Microseconds = "microseconds" | "microsecond" | "µsecs" | "µsec" | "µs";
type Nanoseconds = "nanoseconds" | "nanosecond" | "nsecs" | "nsec" | "ns";
type Unit =
  | Years
  | Months
  | Weeks
  | Days
  | Hours
  | Minutes
  | Seconds
  | Milliseconds
  | Microseconds
  | Nanoseconds;

type UnitAnyCase = Capitalize<Unit> | Uppercase<Unit> | Unit;

/**
 * A typesafe string value representing a duration.
 */
export type StringValue =
  | `${bigint}`
  | `${bigint}${UnitAnyCase}`
  | `${bigint} ${UnitAnyCase}`
  | string & {};

interface Options {
  /**
   * Set to `true` to use verbose formatting. Defaults to `false`.
   */
  long?: boolean;
}

/**
 * Parse or format the given value.
 *
 * @param value - The string or bigint to convert
 * @param options - Options for the conversion
 * @throws Error if `value` is not a non-empty string or a bigint
 */
export function ns(value: StringValue, options?: Options): bigint;
export function ns(value: bigint, options?: Options): string;
export function ns(
  value: StringValue | bigint,
  options?: Options,
): bigint | string {
  if (typeof value === "string") {
    const parsed = parse(value);
    if (parsed !== undefined) {
      return parsed;
    }
  } else if (typeof value === "bigint") {
    return format(value, options);
  }
  throw new Error(
    `Value provided to ns() must be a string or bigint. value=${
      JSON.stringify(value)
    }`,
  );
}

/**
 * Parse or format the given value.
 *
 * @param value - The string or number to convert
 * @param options - Options for the conversion
 * @throws Error if `value` is not a non-empty string or a number
 */
export function ms(value: StringValue, options?: Options): number;
export function ms(value: number, options?: Options): string;
export function ms(
  value: StringValue | number,
  options?: Options,
): number | string {
  if (typeof value === "string") {
    const parsed = parse(value);
    if (parsed !== undefined) {
      return Number(parsed / unit.ms);
    }
  } else if (typeof value === "number") {
    return format(BigInt(value) * unit.ms, options);
  }
  throw new Error(
    `Value provided to ms() must be a string or number. value=${
      JSON.stringify(value)
    }`,
  );
}

/**
 * Parse the given string and return nanoseconds.
 *
 * @param str - A string to parse to nanoseconds
 * @returns The parsed value in nanoseconds, or `undefined` if the string can't be
 * parsed
 */
export function parse(str: string): bigint | undefined {
  if (typeof str !== "string" || str.length === 0 || str.length > 100) {
    throw new Error(
      `Value provided to ns.parse() must be a string with length between 1 and 99. value=${
        JSON.stringify(str)
      }`,
    );
  }
  const match =
    /^(?<value>-?\d+|-?\d*\.?(?<frac>\d+)) *(?<unit>nanoseconds?|nsecs?|ns|microseconds?|µsecs?|µs|milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i
      .exec(
        str,
      );

  if (!match?.groups) {
    return undefined;
  }

  // Named capture groups need to be manually typed today.
  // https://github.com/microsoft/TypeScript/issues/32098
  const { value, frac = "", unit: mod = "ns" } = match.groups as {
    frac: string | undefined;
    value: string;
    unit: string | undefined;
  };

  const fraclen = 10n ** BigInt(frac.length);
  const n = BigInt(value.replace(".", ""));

  const matchUnit = mod.toLowerCase() as Lowercase<Unit>;

  switch (matchUnit) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * unit.y / fraclen;
    case "months":
    case "month":
    case "mo":
      return n * unit.mo / fraclen;
    case "weeks":
    case "week":
    case "w":
      return n * unit.w / fraclen;
    case "days":
    case "day":
    case "d":
      return n * unit.d / fraclen;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * unit.h / fraclen;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * unit.m / fraclen;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * unit.s / fraclen;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n * unit.ms / fraclen;
    case "microseconds":
    case "microsecond":
    case "µsecs":
    case "µsec":
    case "µs":
      return n * unit.µs / fraclen;
    case "nanoseconds":
    case "nanosecond":
    case "nsecs":
    case "nsec":
    case "ns":
      return n / fraclen;
    // deno-coverage-ignore-start
    default:
      matchUnit satisfies never;
      throw new Error(
        `Unknown unit "${matchUnit}" provided to ns.parse(). value=${
          JSON.stringify(str)
        }`,
      );
      // deno-coverage-ignore-stop
  }
}

/**
 * Parse the given StringValue and return nanoseconds.
 *
 * @param value - A typesafe StringValue to parse to nanoseconds
 * @returns The parsed value in nanoseconds, or `undefined` if the string can't be
 * parsed
 */
export function parseStrict(value: StringValue): bigint | undefined {
  return parse(value);
}

function divRound(a: bigint, b: bigint): bigint {
  return (a >= 0n) ? (a + b / 2n) / b : (a - b / 2n) / b;
}

/**
 * Short format for `ns`.
 */
function fmtShort(ns: bigint): StringValue {
  const msAbs = ns < 0n ? -ns : ns;
  if (msAbs >= unit.y) {
    return `${divRound(ns, unit.y)}y`;
  }
  if (msAbs >= unit.mo) {
    return `${divRound(ns, unit.mo)}mo`;
  }
  if (msAbs >= unit.w) {
    return `${divRound(ns, unit.w)}w`;
  }
  if (msAbs >= unit.d) {
    return `${divRound(ns, unit.d)}d`;
  }
  if (msAbs >= unit.h) {
    return `${divRound(ns, unit.h)}h`;
  }
  if (msAbs >= unit.m) {
    return `${divRound(ns, unit.m)}m`;
  }
  if (msAbs >= unit.s) {
    return `${divRound(ns, unit.s)}s`;
  }
  if (msAbs >= unit.ms) {
    return `${divRound(ns, unit.ms)}ms`;
  }
  if (msAbs >= unit.µs) {
    return `${divRound(ns, unit.µs)}µs`;
  }
  return `${ns}ns`;
}

/**
 * Long format for `ms`.
 */
function fmtLong(ns: bigint): StringValue {
  const msAbs = ns < 0n ? -ns : ns;
  if (msAbs >= unit.y) {
    return plural(ns, msAbs, unit.y, "year");
  }
  if (msAbs >= unit.mo) {
    return plural(ns, msAbs, unit.mo, "month");
  }
  if (msAbs >= unit.w) {
    return plural(ns, msAbs, unit.w, "week");
  }
  if (msAbs >= unit.d) {
    return plural(ns, msAbs, unit.d, "day");
  }
  if (msAbs >= unit.h) {
    return plural(ns, msAbs, unit.h, "hour");
  }
  if (msAbs >= unit.m) {
    return plural(ns, msAbs, unit.m, "minute");
  }
  if (msAbs >= unit.s) {
    return plural(ns, msAbs, unit.s, "second");
  }
  if (msAbs >= unit.ms) {
    return `${ns / unit.ms} ms`;
  }
  if (msAbs >= unit.µs) {
    return `${ns / unit.µs} µs`;
  }
  return `${ns} ns`;
}

/**
 * Format the given bigint as a string.
 *
 * @param ns - nanoseconds
 * @param options - Options for the conversion
 * @returns The formatted string
 */
export function format(ns: bigint, options?: Options): string {
  if (typeof ns !== "bigint") {
    throw new Error("Value provided to ms.format() must be of type bigint.");
  }

  return options?.long ? fmtLong(ns) : fmtShort(ns);
}

/**
 * Pluralization helper.
 */
function plural(
  ns: bigint,
  nsAbs: bigint,
  n: bigint,
  name: string,
): StringValue {
  const isPlural = nsAbs * 2n >= n * 3n;
  return `${divRound(ns, n)} ${name}${isPlural ? "s" : ""}` as StringValue;
}
