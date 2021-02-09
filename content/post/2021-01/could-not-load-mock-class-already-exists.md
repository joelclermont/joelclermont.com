---
title: "Solving the Mockery Error: Could not load mock, class already exists"
tags: ["php", "testing"]
date: 2021-02-09T16:16:37-06:00
cover: "/images/php-testing.png"
---

This is a really specific error you might never run into, but when you do, this blog post is here for you.

<!--more-->

I was adding test coverage to a long-lived application, and ran into this error. Some of the existing tests were using Mockery's instance mocks to workaround older code that was `new`ing up classes instead of relying on the service container. 

My newer tests and code were using the container and normal mocks. When I ran my new test class in isolation, everything passed. When I ran the entire test suite, my new tests failed with the error:

```
Mockery\Exception\RuntimeException: Could not load mock MY_CLASS_NAME, class already exists
```

After some head scratching, I realized this was a conflict with the old instance mocks I had forgotten about. If you are wondering what an instance mock looks like, here you go:

```php
<?php

$mock = mock('overload:' . MY_CLASS_NAME::class);
```

The key part is that `overload:` prefix on the class being mocked. If you mix an instance mock with a normal mock, it's basically trying to redeclare the same class twice, which is what results in the error message from above.

The long-term solution is to refactor that old code so our tests don't need to rely on instance mocks, but in the short-term there is a much easier fix you can use: Run any test with an instance mock in its own process.

PHPUnit makes this very easy by adding the following annotation:

```php
<?php

    /**
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    public function testThatIncludesInstanceMocks(): void
    {
        // instance mocks and test logic here
    }
```

These annotations together solve our problem. There's also an annotation you can set on an entire test class to make all tests run in isolation, but hopefully you don't have that many tests relying on instance mocks. More about this in the [PHPUnit documentation](https://phpunit.readthedocs.io/en/9.5/annotations.html#runinseparateprocess).