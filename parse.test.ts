import { assertEquals, assertThrows } from "jsr:@std/assert";
import { parse } from "./main.ts";

const µs = 1000n;
const ms = µs * 1000n;
const s = ms * 1000n;
const m = s * 60n;
const h = m * 60n;
const d = h * 24n;
const w = d * 7n;
const y = d * 365n + h * 6n;
const mo = y / 12n;

Deno.test("parse(string)", async (t) => {
  await t.step("should not throw an error", () => {
    parse("1m");
  });

  await t.step("should preserve ns", () => {
    assertEquals(parse("100"), 100n);
  });

  await t.step("should convert from m to ns", () => {
    assertEquals(parse("1m"), m);
  });

  await t.step("should convert from h to ns", () => {
    assertEquals(parse("1h"), h);
  });

  await t.step("should convert d to ns", () => {
    assertEquals(parse("2d"), 2n * d);
  });

  await t.step("should convert w to ns", () => {
    assertEquals(parse("3w"), 3n * w);
  });

  await t.step("should convert s to ns", () => {
    assertEquals(parse("1s"), s);
  });

  await t.step("should convert ms to ns", () => {
    assertEquals(parse("100ms"), 100n * ms);
  });

  await t.step("should convert y to ns", () => {
    assertEquals(parse("1y"), y);
  });

  await t.step("should work with ns", () => {
    assertEquals(parse("1.5h"), h + 30n * m);
  });

  await t.step("should work with multiple spaces", () => {
    assertEquals(parse("1   s"), s);
  });

  await t.step("should return NaN if invalid", () => {
    assertEquals(parse("☃"), undefined);
    assertEquals(parse("10-.5"), undefined);
    assertEquals(parse("foo"), undefined);
  });

  await t.step("should be case-insensitive", () => {
    assertEquals(parse("53 YeArS"), 53n * y);
    assertEquals(parse("53 WeEkS"), 53n * w);
    assertEquals(parse("53 DaYS"), 53n * d);
    assertEquals(parse("53 HoUrs"), 53n * h);
    assertEquals(parse("53 MiLliSeCondS"), 53n * ms);
    assertEquals(parse("53 MicRoSeConDs"), 53n * µs);
    assertEquals(parse("53 NaNoSeConDs"), 53n);
  });

  await t.step("should work with numbers starting with .", () => {
    assertEquals(parse(".5ms"), ms / 2n);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parse("-100ms"), -100n * ms);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parse("-1.5h"), -1n * h - 30n * m);
    assertEquals(parse("-10.5h"), -37800000n * ms);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parse("-.5h"), -1800000n * ms);
  });
});

// long strings

Deno.test("parse(long string)", async (t) => {
  await t.step("should not throw an error", () => {
    parse("53 milliseconds");
  });

  await t.step("should convert milliseconds to ms", () => {
    assertEquals(parse("53 milliseconds"), 53n * ms);
  });

  await t.step("should convert msecs to ms", () => {
    assertEquals(parse("17 msecs"), 17n * ms);
  });

  await t.step("should convert sec to ms", () => {
    assertEquals(parse("1 sec"), s);
  });

  await t.step("should convert from min to ms", () => {
    assertEquals(parse("1 min"), m);
  });

  await t.step("should convert from hr to ms", () => {
    assertEquals(parse("1 hr"), h);
  });

  await t.step("should convert days to ms", () => {
    assertEquals(parse("2 days"), 2n * d);
  });

  await t.step("should convert weeks to ms", () => {
    assertEquals(parse("1 week"), w);
  });

  await t.step("should convert months to ms", () => {
    assertEquals(parse("1 month"), mo);
  });

  await t.step("should convert years to ms", () => {
    assertEquals(parse("1 year"), y);
  });

  await t.step("should work with decimals", () => {
    assertEquals(parse("1.5 hours"), 5400000n * ms);
  });

  await t.step("should work with negative integers", () => {
    assertEquals(parse("-100 milliseconds"), -100n * ms);
  });

  await t.step("should work with negative decimals", () => {
    assertEquals(parse("-1.5 hours"), -5400000n * ms);
  });

  await t.step('should work with negative decimals starting with "."', () => {
    assertEquals(parse("-.5 hr"), -1800000n * ms);
  });
});

// invalid inputs

Deno.test("parse(invalid inputs)", async (t) => {
  await t.step('should throw an error, when parse("")', () => {
    assertThrows(() => {
      parse("");
    });
  });

  await t.step(
    'should throw an error, when parseStrict("...>100 length string...")',
    () => {
      assertThrows(() => {
        parse("▲".repeat(101));
      });
    },
  );

  await t.step("should throw an error, when parse(undefined)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse(undefined);
    });
  });

  await t.step("should throw an error, when parse(null)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse(null);
    });
  });

  await t.step("should throw an error, when parse([])", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse([]);
    });
  });

  await t.step("should throw an error, when parse({})", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse({});
    });
  });

  await t.step("should throw an error, when parse(NaN)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse(NaN);
    });
  });

  await t.step("should throw an error, when parse(Infinity)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse(Infinity);
    });
  });

  await t.step("should throw an error, when parse(-Infinity)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      parse(-Infinity);
    });
  });
});
