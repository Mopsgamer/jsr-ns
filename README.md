# @m234/ns

[![JSR](https://jsr.io/badges/@m234/ns)](https://jsr.io/@m234/ns)
![Tests](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-tests.svg)
![Tests coverage](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-cov.svg)

`BigInt` nanosecond conversion utility.

This library heavily based on [`ms` v3](https://www.npmjs.com/package/ms). See
that package for more details.

## Usage

```ts
const start = process.hrtime.bigint();
setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log(
    ns(end - start),
  );
}, 1000);
```

```ts
ns("2 days"); // 172800000000000n
ns("1d"); // 86400000000000n
ns("10h"); // 36000000000000n
ns("2.5 hrs"); // 9000000000000n
ns("2h"); // 7200000000000n
ns("1m"); // 60000000000n
ns("5s"); // 5000000000n
ns("1y"); // 31557600000000000n
ns("100"); // 100000000n
ns("-3 days"); // -259200000000000n
ns("-1h"); // -3600000000000n
ns("-200"); // -200000000n
```

```ts
ns(60000000000n); // "1m"
ns(2n * 60000000000n); // "2m"
ns(-3n * 60000000000n); // "-3m"
ns(ns("10 hours")); // "10h"
```
