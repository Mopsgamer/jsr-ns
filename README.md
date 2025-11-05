# @m234/ns

[![JSR](https://jsr.io/badges/@m234/ns)](https://jsr.io/@m234/ns)
![Tests](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-tests.svg)
![Tests coverage](https://raw.githubusercontent.com/Mopsgamer/jsr-ns/refs/heads/main/assets/badge-cov.svg)

`BigInt` nanosecond conversion utility.

## Usage

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
ms(60000000000n); // "1m"
ms(2n * 60000000000n); // "2m"
ms(-3n * 60000000000n); // "-3m"
ms(ms("10 hours")); // "10h"
```

See [`ms`](https://www.npmjs.com/package/ms) for more details.
