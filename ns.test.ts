import { assertEquals, assertThrows } from "jsr:@std/assert";
import { ns } from "./main.ts";

const µs = 1000n;
const ms = µs * 1000n;
const s = ms * 1000n;

Deno.test("ns - works", () => {
  assertEquals(ns("12 secs"), 12n * s);
  assertEquals(ns(12n * s), "12s");
  assertThrows(() => {
    //@ts-expect-error
    ns(12);
  });
  assertThrows(() => {
    ns("12 idiots");
  });
});
