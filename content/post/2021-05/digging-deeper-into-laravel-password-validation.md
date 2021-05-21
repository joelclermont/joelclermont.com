---
title: "Digging Deeper Into Laravel Password Validation"
cover: "/images/laravel-tip.png"
tags: ["laravel", "validation"]
date: 2021-05-21T09:17:01-05:00
---

Recently, a powerful new validation rule was added to Laravel to enforce password strength and security. There have been several great articles on how to use it, but this article will dive deeper and shed some light on how it works internally.

<!--more-->

First, if you want to follow along in the source code, you can find it all in [this single file](https://github.com/laravel/framework/blob/8.x/src/Illuminate/Validation/Rules/Password.php).

The simplest way to use this rule is `Password::min(8)`, which just enforces a minimum length of 8 characters. If that's all you were going to do, you'd probably just use the `'min:8'` rule though. Where this new password rule gets interesting is when you chain multiple password-related constraints, like:

```php
<?php
Password::min(8)
    ->letters()
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised();
```

But what about this? Would this work?

```php
<?php
Password::letters()
    ->min(8)
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised();
```

All we did was change the order of the first two rules in the chain, but this will not work. PHP will throw an `ErrorException`. The reason is that `min()` is marked as a `static` function, but `letters()` and all the others in that example are not. So `min()` has to be specified first in the chain.

I like this API design from a logical perspective. `min()` is a reasonable rule that should be set on every password field, so it's a good choice for an entry point to this class.

If we dig a little deeper into the evaluation of the rules, we see an additional reason why this design makes sense. Taking our same example rule, what errors would you expect to be returned if I give it the password `1234`. It's too short, it doesn't have letters, mixed case or symbols. And it's certainly a compromised password.

Instead of getting all those errors back, we only get:

```php
<?php
[
    "The password must be at least 8 characters.",
]
```

Why? Internally the `passes()` method segments all the different rules into 3 different phases of pass/fail:

1. `min`
2. `mixedCase`, `letters`, `symbols`, and `numbers`
3. `uncompromised`

So if `min` fails, it just bails and returns the one message. If we change our password to `12345678`, now we get:

```php
<?php
[
    "The password must contain at least one uppercase and one lowercase letter.",
    "The password must contain at least one letter.",
    "The password must contain at least one symbol.",
]
```

The other rules are triggered now that `min` is satisfied, but notice we still have no mention of the password being compromised. That's because `uncompromised` is only evaluated if every other password rule passes. Again, this is a perfect design because that `uncompromised` rule makes an API call. Why waste the effort to do that if the password has already failed for another reason?

For completeness, let's show the error from the `uncompromised` rule. Let's say we enter the super secure password of `Password1!`. It satisfies minimum length, and all the other conditions, but we now get this error:

```php
<?php
[
    "The given password has appeared in a data leak. Please choose a different password.",
]
```

And in case you're wondering, `Password2!`, `Password3!`, `Password4!`, etc are all compromised as well. As of the writing of this article, `Password12345678!` is still uncompromised though, so have fun with that.
