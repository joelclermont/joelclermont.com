---
title: "Why Are Eloquent Timestamps Nullable?"
tags: ["laravel", "eloquent", "mysql"]
date: 2020-11-17T12:40:12-06:00
---

Recently I was creating a new table and using the `timestamps` helper in the migration. I noticed something that seemed wrong, so I dug a little deeper and learned something new about Laravel and MySQL.

<!--more-->

Clicking through the `timestamps` helper, I saw this:

```php
<?php
public function timestamps($precision = 0)
{
    $this->timestamp('created_at', $precision)->nullable();

    $this->timestamp('updated_at', $precision)->nullable();
}
```

The way that Eloquent manages these fields, there will never be a model created with a null value for `created_at` or `updated_at`. So why are these fields created as `nullable`? 

Adding to my confusion, right below that method, I saw this:

```php
<?php
public function nullableTimestamps($precision = 0)
{
    $this->timestamps($precision);
}
```

There is a separate method for generating `nullableTimestamps`, but it's just calling our normal `timestamps` method. Isn't it weird that there are two separate methods that do the same thing, but have different names? Just looking at the method names, you might even assume that `timestamps` would create non-null timestamps, in contrast with the `nullableTimestamps` method.

Is this a mistake? No, this was done on purpose, and understanding the reason why it was necessary reminded me why software is so complex, and how seemingly unrelated things can have a big impact on how our code works.

Notice this excerpt from the [MySQL docs](https://dev.mysql.com/doc/refman/5.7/en/timestamp-initialization.html):

> If the explicit_defaults_for_timestamp system variable is disabled, the first TIMESTAMP column has both DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP if neither is specified explicitly.

What does this actually mean? And how does it relate to our Laravel `timestamps` question? It's saying that in certain conditions, MySQL will automatically add some properties to the *first* timestamp column created in a table. That differentiation of order is important. If no properties are explicitly set in your migration, the generated schema would be different based on what order your columns are created. So if you added your own additional timestamp column before the Eloquent-managed timestamp fields, it would act differently than if you just had the default timestamps.

To make matters worse, the move to MySQL 5.7 enforced a stricter mode by default, so more users were going to bump into this timestamp default behavior. One of the recommendations for handling this is to specify the timestamp column as nullable to avoid this default behavior. That's the choice Laravel made to ensure consistency and avoid unexpected schema generation depending on 1) your version of MySQL, 2) the strictness level setup on your server, and 3) the order you declared your columns. As a final note, to preserve backwards compatibility, the `nullableTimestamps` method was preserved. 

Once I understood all that context, the solution seemed simple and made a lot more sense! If you want even more history on this, checkout the original [GitHub issue](https://github.com/laravel/framework/issues/12060) and this [discussion](https://github.com/laravel/ideas/issues/874).