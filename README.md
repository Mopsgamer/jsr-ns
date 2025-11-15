# @m234/ns

[![JSR](https://jsr.io/badges/@m234/ns)](https://jsr.io/@m234/ns)
![Tests](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-tests.svg)
![Tests coverage](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-cov.svg)

`BigInt` nanosecond conversion utility.

This library is based on [`ms` v4](https://www.npmjs.com/package/ms).
For more details, see that package.

## Differences from `ms`

- This library uses `BigInt` and nanoseconds instead of milliseconds.
- The `StringValue` argument is more friendlier.

## Usage

```ts
const start = process.hrtime.bigint();
setTimeout(() => {
  const end = process.hrtime.bigint();
  const diff = ns(end - start);
  console.log(diff);
}, 1000);
```

## Examples

<!-- deno-fmt-ignore-start -->
```ts
ns("2 days");     // 172800000000000n
ns("1d");         // 86400000000000n
ns("10h");        // 36000000000000n
ns("2.5 hrs");    // 9000000000000n
ns("2h");         // 7200000000000n
ns("1m");         // 60000000000n
ns("5s");         // 5000000000n
ns("1y");         // 31557600000000000n
ns("100");        // 100n
ns("-3 days");    // -259200000000000n
ns("-1h");        // -3600000000000n
ns("-200");       // -200n
```
<!-- deno-fmt-ignore-end -->

### Convert from nanoseconds

<!-- deno-fmt-ignore-start -->
```ts
ns(60000000000n);          // "1m"
ns(2n * 60000000000n);     // "2m"
ns(-3n * 60000000000n);    // "-3m"
ns(ns("10 hours"));        // "10h"
```
<!-- deno-fmt-ignore-end -->

### Time format written-out

<!-- deno-fmt-ignore-start -->
```ts
ns(60000000000n, { long: true });          // "1 minute"
ns(2n * 60000000000n, { long: true });     // "2 minutes"
ns(-3n * 60000000000n, { long: true });    // "-3 minutes"
ns(ns('10 hours'), { long: true });        // "10 hours"
```
<!-- deno-fmt-ignore-end -->
