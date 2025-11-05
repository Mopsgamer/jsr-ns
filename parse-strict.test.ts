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

  await t.step("should preserve ms", () => {
    assertEquals(parseStrict("100"), 100n);
  });

  await t.step("should convert from m to ms", () => {
    assertEquals(parseStrict("1m"), 60000n * ms);
  });

  await t.step("should convert from h to ms", () => {
    assertEquals(parseStrict("1h"), 3600000n * ms);
  });

  await t.step("should convert d to ms", () => {
    assertEquals(parseStrict("2d"), 172800000n * ms);
  });

  await t.step("should convert w to ms", () => {
    assertEquals(parseStrict("3w"), 1814400000n * ms);
  });

  await t.step("should convert s to ms", () => {
    assertEquals(parseStrict("1s"), 1000n * ms);
  });

  await t.step("should convert ms to ms", () => {
    assertEquals(parseStrict("100ms"), 100n * ms);
  });

  await t.step("should convert mo to ms", () => {
    assertEquals(parseStrict("1mo"), 2629800000n * ms);
  });
  await t.step("should convert y to ms", () => {
    assertEquals(parseStrict("1y"), 31557600000n * ms);
  });

  await t.step("should work with ms", () => {
    assertEquals(parseStrict("1.5h"), 5400000n * ms);
  });

  await t.step("should work with multiple spaces", () => {
    assertEquals(parseStrict("1   s"), 1000n * ms);
  });

  await t.step("should return NaN if invalid", () => {
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("☃"), undefined);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("10-.5"), undefined);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("foo"), undefined);
  });

  await t.step("should be case-insensitive", () => {
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("53 YeArS"), 1672552800000);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("53 WeEkS"), 32054400000);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("53 DaYS"), 4579200000);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("53 HoUrs"), 190800000);
    // @ts-expect-error - we expect the types to fail but JS users can still use this
    assertEquals(parseStrict("53 MiLliSeCondS"), 53);
  });

  await t.step("should work with numbers starting with .", () => {
    assertEquals(parseStrict(".5ms"), 0n);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parseStrict("-100ms"), -100n * ms);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parseStrict("-1.5h"), -5400000);
    assertEquals(parseStrict("-10.5h"), -37800000);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parseStrict("-.5h"), -1800000);
  });
});

// long strings

Deno.test("parseStrict(long string)", async (t) => {
  await t.step("should not throw an error", () => {
    parseStrict("53 milliseconds");
  });

  await t.step("should convert milliseconds to ms", () => {
    assertEquals(parseStrict("53 milliseconds"), 53);
  });

  await t.step("should convert msecs to ms", () => {
    assertEquals(parseStrict("17 msecs"), 17);
  });

  await t.step("should convert sec to ms", () => {
    assertEquals(parseStrict("1 sec"), 1000);
  });

  await t.step("should convert from min to ms", () => {
    assertEquals(parseStrict("1 min"), 60000);
  });

  await t.step("should convert from hr to ms", () => {
    assertEquals(parseStrict("1 hr"), 3600000);
  });

  await t.step("should convert days to ms", () => {
    assertEquals(parseStrict("2 days"), 172800000);
  });

  await t.step("should convert weeks to ms", () => {
    assertEquals(parseStrict("1 week"), 604800000);
  });

  await t.step("should convert months to ms", () => {
    assertEquals(parseStrict("1 month"), 2629800000);
  });

  await t.step("should convert years to ms", () => {
    assertEquals(parseStrict("1 year"), 31557600000);
  });

  await t.step("should work with decimals", () => {
    assertEquals(parseStrict("1.5 hours"), 5400000);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parseStrict("-100 milliseconds"), -100);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parseStrict("-1.5 hours"), -5400000);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parseStrict("-.5 hr"), -1800000);
  });
});

// invalid inputs

Deno.test("parseStrict(invalid inputs)", async (t) => {
  await t.step('should throw an error, when parseStrict("")', () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parseStrict("");
    });
  });

  await t.step(
    'should throw an error, when parseStrict("...>100 length string...")',
    () => {
      assertThrows(() => {
        // @ts-expect-error - We expect this to throw.
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
