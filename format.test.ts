import { assertEquals, assertThrows } from "jsr:@std/assert";
import { format } from "./main.ts";

const µs = 1000n;
const ms = µs * 1000n;
const s = ms * 1000n;
const m = s * 60n;
const h = m * 60n;
const d = h * 24n;
const w = d * 7n;
const y = d * 365n + h * 6n;
const mo = y / 12n;

Deno.test("format(bigint, { long: true })", async (t) => {
  await t.step("should not throw an error", () => {
    format(500n * ms, { long: true });
  });

  await t.step("should support nanoseconds", () => {
    assertEquals(format(500n, { long: true }), "500 ns");

    assertEquals(format(-500n, { long: true }), "-500 ns");
  });

  await t.step("should support microseconds", () => {
    assertEquals(format(500n * µs, { long: true }), "500 µs");

    assertEquals(format(-500n * µs, { long: true }), "-500 µs");
  });

  await t.step("should support milliseconds", () => {
    assertEquals(format(500n * ms, { long: true }), "500 ms");

    assertEquals(format(-500n * ms, { long: true }), "-500 ms");
  });

  await t.step("should support seconds", () => {
    assertEquals(format(1000n * ms, { long: true }), "1 second");
    assertEquals(format(1200n * ms, { long: true }), "1 second");
    assertEquals(format(10000n * ms, { long: true }), "10 seconds");

    assertEquals(format(-1000n * ms, { long: true }), "-1 second");
    assertEquals(format(-1200n * ms, { long: true }), "-1 second");
    assertEquals(format(-10000n * ms, { long: true }), "-10 seconds");
  });

  await t.step("should support minutes", () => {
    assertEquals(format(60n * 1000n * ms, { long: true }), "1 minute");
    assertEquals(format(60n * 1200n * ms, { long: true }), "1 minute");
    assertEquals(format(60n * 10000n * ms, { long: true }), "10 minutes");

    assertEquals(format(-1n * 60n * 1000n * ms, { long: true }), "-1 minute");
    assertEquals(format(-1n * 60n * 1200n * ms, { long: true }), "-1 minute");
    assertEquals(
      format(-1n * 60n * 10000n * ms, { long: true }),
      "-10 minutes",
    );
  });

  await t.step("should support hours", () => {
    assertEquals(format(60n * 60n * 1000n * ms, { long: true }), "1 hour");
    assertEquals(format(60n * 60n * 1200n * ms, { long: true }), "1 hour");
    assertEquals(format(60n * 60n * 10000n * ms, { long: true }), "10 hours");

    assertEquals(
      format(-1n * 60n * 60n * 1000n * ms, { long: true }),
      "-1 hour",
    );
    assertEquals(
      format(-1n * 60n * 60n * 1200n * ms, { long: true }),
      "-1 hour",
    );
    assertEquals(
      format(-1n * 60n * 60n * 10000n * ms, { long: true }),
      "-10 hours",
    );
  });

  await t.step("should support days", () => {
    assertEquals(
      format(1n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "1 day",
    );
    assertEquals(
      format(1n * 24n * 60n * 60n * 1200n * ms, { long: true }),
      "1 day",
    );
    assertEquals(
      format(6n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "6 days",
    );

    assertEquals(
      format(-1n * 1n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "-1 day",
    );
    assertEquals(
      format(-1n * 1n * 24n * 60n * 60n * 1200n * ms, { long: true }),
      "-1 day",
    );
    assertEquals(
      format(-1n * 6n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "-6 days",
    );
  });

  await t.step("should support weeks", () => {
    assertEquals(
      format(1n * 7n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "1 week",
    );
    assertEquals(
      format(2n * 7n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "2 weeks",
    );

    assertEquals(
      format(-1n * 1n * 7n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "-1 week",
    );
    assertEquals(
      format(-1n * 2n * 7n * 24n * 60n * 60n * 1000n * ms, { long: true }),
      "-2 weeks",
    );
  });

  await t.step("should support months", () => {
    assertEquals(
      format(mo, { long: true }),
      "1 month",
    );
    assertEquals(
      format(mo + mo / 5n, { long: true }),
      "1 month",
    );
    assertEquals(
      format(10n * mo, { long: true }),
      "10 months",
    );

    assertEquals(
      format(-1n * mo, { long: true }),
      "-1 month",
    );
    assertEquals(
      format(-1n * (mo + mo / 5n), { long: true }),
      "-1 month",
    );
    assertEquals(
      format(-1n * 10n * mo, { long: true }),
      "-10 months",
    );
  });

  await t.step("should support years", () => {
    assertEquals(
      format(y, { long: true }),
      "1 year",
    );
    assertEquals(
      format(y + y / 5n, { long: true }),
      "1 year",
    );
    assertEquals(
      format(10n * y, { long: true }),
      "10 years",
    );

    assertEquals(
      format(-1n * y, { long: true }),
      "-1 year",
    );
    assertEquals(
      format(-1n * (y + y / 5n), { long: true }),
      "-1 year",
    );
    assertEquals(
      format(-1n * 10n * y, { long: true }),
      "-10 years",
    );
  });

  await t.step("should round", () => {
    assertEquals(format(234234234n * ms, { long: true }), "3 days");

    assertEquals(format(-234234234n * ms, { long: true }), "-3 days");
  });
});

// bigints

Deno.test("format(bigint)", async (t) => {
  await t.step("should not throw an error", () => {
    format(500n * ms);
  });

  await t.step("should support nanoseconds", () => {
    assertEquals(format(500n), "500ns");

    assertEquals(format(-500n), "-500ns");
  });

  await t.step("should support microseconds", () => {
    assertEquals(format(500n * µs), "500µs");

    assertEquals(format(-500n * µs), "-500µs");
  });

  await t.step("should support milliseconds", () => {
    assertEquals(format(500n * ms), "500ms");

    assertEquals(format(-500n * ms), "-500ms");
  });

  await t.step("should support seconds", () => {
    assertEquals(format(1000n * ms), "1s");
    assertEquals(format(10000n * ms), "10s");

    assertEquals(format(-1000n * ms), "-1s");
    assertEquals(format(-10000n * ms), "-10s");
  });

  await t.step("should support minutes", () => {
    assertEquals(format(60n * 1000n * ms), "1m");
    assertEquals(format(60n * 10000n * ms), "10m");

    assertEquals(format(-1n * 60n * 1000n * ms), "-1m");
    assertEquals(format(-1n * 60n * 10000n * ms), "-10m");
  });

  await t.step("should support hours", () => {
    assertEquals(format(60n * 60n * 1000n * ms), "1h");
    assertEquals(format(60n * 60n * 10000n * ms), "10h");

    assertEquals(format(-1n * 60n * 60n * 1000n * ms), "-1h");
    assertEquals(format(-1n * 60n * 60n * 10000n * ms), "-10h");
  });

  await t.step("should support days", () => {
    assertEquals(format(24n * 60n * 60n * 1000n * ms), "1d");
    assertEquals(format(24n * 60n * 60n * 6000n * ms), "6d");

    assertEquals(format(-1n * 24n * 60n * 60n * 1000n * ms), "-1d");
    assertEquals(format(-1n * 24n * 60n * 60n * 6000n * ms), "-6d");
  });

  await t.step("should support weeks", () => {
    assertEquals(format(1n * 7n * 24n * 60n * 60n * 1000n * ms), "1w");
    assertEquals(format(2n * 7n * 24n * 60n * 60n * 1000n * ms), "2w");

    assertEquals(format(-1n * 1n * 7n * 24n * 60n * 60n * 1000n * ms), "-1w");
    assertEquals(format(-1n * 2n * 7n * 24n * 60n * 60n * 1000n * ms), "-2w");
  });

  await t.step("should support months", () => {
    assertEquals(format(mo), "1mo");
    assertEquals(format(mo + mo / 5n), "1mo");
    assertEquals(format(10n * mo), "10mo");

    assertEquals(format(-1n * mo), "-1mo");
    assertEquals(format(-1n * (mo + mo / 5n)), "-1mo");
    assertEquals(format(-1n * 10n * mo), "-10mo");
  });

  await t.step("should support years", () => {
    assertEquals(format(y), "1y");
    assertEquals(format(y + y / 5n), "1y");
    assertEquals(format(10n * y), "10y");

    assertEquals(format(-1n * y), "-1y");
    assertEquals(format(-1n * (y + y / 5n)), "-1y");
    assertEquals(format(-1n * 10n * y), "-10y");
  });

  await t.step("should round", () => {
    assertEquals(format(234234234n * ms), "3d");

    assertEquals(format(-234234234n * ms), "-3d");
  });
});

// invalid inputs

Deno.test("format(invalid inputs)", async (t) => {
  await t.step('should throw an error, when format("")', () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      format("");
    });
  });

  await t.step("should throw an error, when format(undefined)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      format(undefined);
    });
  });

  await t.step("should throw an error, when format(null)", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      format(null);
    });
  });

  await t.step("should throw an error, when format([])", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      format([]);
    });
  });

  await t.step("should throw an error, when format({})", () => {
    assertThrows(() => {
      // @ts-expect-error - We expect this to throw.
      format({});
    });
  });
});
