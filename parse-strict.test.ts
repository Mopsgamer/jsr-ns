import { assertEquals, assertThrows } from "jsr:@std/assert";
import { parseStrict } from "./main.ts";

const µs = 1000n;
const ms = µs * 1000n;
const s = ms * 1000n;
const m = s * 60n;
const h = m * 60n;
const d = h * 24n;
const w = d * 7n;
const y = d * 365n + h * 6n;
const mo = y / 12n;

Deno.test("parseStrict(string)", async (t) => {
  await t.step("should not throw an error", () => {
    parseStrict("1m");
  });

  await t.step("should preserve ns", () => {
    assertEquals(parseStrict("100"), 100n);
  });

  await t.step("should convert from m to ns", () => {
    assertEquals(parseStrict("1m"), 60000n * ms);
  });

  await t.step("should convert from h to ns", () => {
    assertEquals(parseStrict("1h"), 3600000n * ms);
  });

  await t.step("should convert d to ns", () => {
    assertEquals(parseStrict("2d"), 172800000n * ms);
  });

  await t.step("should convert w to ns", () => {
    assertEquals(parseStrict("3w"), 1814400000n * ms);
  });

  await t.step("should convert s to ns", () => {
    assertEquals(parseStrict("1s"), 1000n * ms);
  });

  await t.step("should convert ms to ns", () => {
    assertEquals(parseStrict("100ms"), 100n * ms);
  });

  await t.step("should convert mo to ns", () => {
    assertEquals(parseStrict("1mo"), 2629800000n * ms);
  });
  await t.step("should convert y to ns", () => {
    assertEquals(parseStrict("1y"), 31557600000n * ms);
  });

  await t.step("should work with ns", () => {
    assertEquals(parseStrict("1.5h"), 5400000n * ms);
  });

  await t.step("should work with multiple spaces", () => {
    assertEquals(parseStrict("1   s"), 1000n * ms);
  });

  await t.step("should return undefined if invalid", () => {
    assertEquals(parseStrict("☃"), undefined);
    assertEquals(parseStrict("10-.5"), undefined);
    assertEquals(parseStrict("foo"), undefined);
  });

  await t.step("should be case-insensitive", () => {
    assertEquals(parseStrict("53 YeArS"), 1672552800000n * ms);
    assertEquals(parseStrict("53 WeEkS"), 32054400000n * ms);
    assertEquals(parseStrict("53 DaYS"), 4579200000n * ms);
    assertEquals(parseStrict("53 HoUrs"), 190800000n * ms);
    assertEquals(parseStrict("53 MiLliSeCondS"), 53n * ms);
    assertEquals(parseStrict("53 MicRoSeCondS"), 53n * µs);
    assertEquals(parseStrict("53 NanOSeCondS"), 53n);
  });

  await t.step("should work with numbers starting with .", () => {
    assertEquals(parseStrict(".5ms"), ms / 2n);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parseStrict("-100ms"), -100n * ms);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parseStrict("-1.5h"), -5400000n * ms);
    assertEquals(parseStrict("-10.5h"), -37800000n * ms);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parseStrict("-.5h"), -1800000n * ms);
  });
});

// long strings

Deno.test("parseStrict(long string)", async (t) => {
  await t.step("should not throw an error", () => {
    parseStrict("53 milliseconds");
  });

  await t.step("should convert nanoseconds to ms", () => {
    assertEquals(parseStrict("53 nanoseconds"), 53n);
  });

  await t.step("should convert microseconds to ms", () => {
    assertEquals(parseStrict("53 microseconds"), 53n * µs);
  });

  await t.step("should convert milliseconds to ms", () => {
    assertEquals(parseStrict("53 milliseconds"), 53n * ms);
  });

  await t.step("should convert msecs to ms", () => {
    assertEquals(parseStrict("17 msecs"), 17n * ms);
  });

  await t.step("should convert sec to ms", () => {
    assertEquals(parseStrict("1 sec"), 1000n * ms);
    assertEquals(parseStrict("1 seconds"), 1000n * ms);
  });

  await t.step("should convert from min to ms", () => {
    assertEquals(parseStrict("1 min"), 60000n * ms);
    assertEquals(parseStrict("1 minutes"), 60000n * ms);
  });

  await t.step("should convert from hr to ms", () => {
    assertEquals(parseStrict("1 hr"), 3600000n * ms);
  });

  await t.step("should convert days to ms", () => {
    assertEquals(parseStrict("2 days"), 172800000n * ms);
  });

  await t.step("should convert weeks to ms", () => {
    assertEquals(parseStrict("1 week"), 604800000n * ms);
  });

  await t.step("should convert months to ms", () => {
    assertEquals(parseStrict("1 month"), 2629800000n * ms);
    assertEquals(parseStrict("1 months"), 2629800000n * ms);
  });

  await t.step("should convert years to ms", () => {
    assertEquals(parseStrict("1 year"), 31557600000n * ms);
  });

  await t.step("should work with decimals", () => {
    assertEquals(parseStrict("1.5 hours"), 5400000n * ms);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parseStrict("-100 milliseconds"), -100n * ms);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parseStrict("-1.5 hours"), -5400000n * ms);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parseStrict("-.5 hr"), -1800000n * ms);
  });
});

// invalid inputs

Deno.test("parseStrict(invalid inputs)", async (t) => {
  await t.step('should throw an error, when parseStrict("")', () => {
    assertThrows(() => {
      parseStrict("");
    });
  });

  await t.step(
    'should throw an error, when parseStrict("...>100 length string...")',
    () => {
      assertThrows(() => {
        parseStrict("▲".repeat(101));
      });
    },
  );

  await t.step("should throw an error, when parseStrict(undefined)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict(undefined);
    });
  });

  await t.step("should throw an error, when parseStrict(null)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict(null);
    });
  });

  await t.step("should throw an error, when parseStrict([])", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict([]);
    });
  });

  await t.step("should throw an error, when parseStrict({})", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict({});
    });
  });

  await t.step("should throw an error, when parseStrict(NaN)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict(NaN);
    });
  });

  await t.step("should throw an error, when parseStrict(Infinity)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict(Infinity);
    });
  });

  await t.step("should throw an error, when parseStrict(-Infinity)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict(-Infinity);
    });
  });
});
