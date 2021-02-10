---
title: "AWS Error Retrieving Credentials"
tags: ["php"]
date: 2021-02-10T15:39:51-06:00
cover: "/images/php-elephant.png"
---

Recently I upgraded `phpdotenv` on an older project and my AWS connection stopped working. Why did one package upgrade break the other? And how did I fix it? Read on for details.

<!--more-->

This older project was built with vanilla PHP and was a little over 10 years old. When I inherited it, the first thing I did was bring in the great `vlucas/phpdotenv` package and extract all secrets and configuration from the code into an environment file. At the time I did this, the library was at version 2.4.

Fast-forward a couple years, and the client has decided to invest more time in bringing this app up to date. I use a familiar pattern of "wrapping" the legacy app with a new Laravel app, so I can incrementally upgrade it without forcing a huge rewrite all at once. Laravel also uses the `phpdotenv` library, and it was using the current version, which is 5.3.

One of the breaking changes between `phpdotenv` v2 and v5 was that the library [no longer supported `getenv` and `putenv` by default](https://github.com/vlucas/phpdotenv/blob/master/UPGRADING.md#v4-to-v5). They provided an `unsafe` alternative when initializing `DotEnv` to restore the old behavior, but I try to not buck the defaults, so I updated my code to not rely on `getenv` anymore.

But now I had a weird error when using the AWS SDK:

```
Error retrieving credentials from the instance profile metadata service.
(cURL error 7: Failed to connect to 169.254.169.254 port 80: Connection refused (see https://curl.haxx.se/libcurl/c/libcurl-errors.html) for http://169.254.169.254/latest/meta-data/iam/security-credentials/)
```

This made no sense to me! Why would the AWS SDK be trying to hit that private IP? And why did this break when all I did was upgrade a few libraries including `phpdotenv`?

Digging through the [AWS docs](https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_credentials_environment.html), I discovered that internally the AWS SDK uses `getenv` to load configuration values from the environment. If it doesn't find them, it falls back to trying an [instance metadata endpoint](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) which is provided on EC2 instances. That endpoint exists on 169.254.169.254. Mystery solved!

Now how to fix it? One option was to change how the various AWS SDK clients are instantiated, and pass the values in directly to the constructor. Another option was to manually `putenv` the two environment values I needed, so that the AWS SDK could find them.  

```php
<?php

// The AWS client is relying on these being retrieved via `getenv` and DotEnv no longer sets via `putenv`
putenv("AWS_ACCESS_KEY_ID=" . AWS_ACCESS_KEY_ID);
putenv("AWS_SECRET_ACCESS_KEY=" . AWS_SECRET_ACCESS_KEY);
```

I decided for the second option since this was a temporary workaround while the app was being upgraded. Once I was fully running as a Laravel app, I wouldn't need to think about this anymore.