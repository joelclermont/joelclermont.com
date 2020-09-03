---
title: "One More Primary Key Example"
date: 2020-09-03T08:12:04-05:00
tags: ["laravel", "php", "testing"]
---

Let's wrap up this series of tips, and show one final example when setting an explicit primary key value can improve the quality of your tests.

<!--more-->

This is part 3 of 3, so if you missed the previous posts, I'd recommend reading [part 1]({{< ref "testing-strategy-explicit-primary-key-values.md" >}}) and [part 2]({{< ref "another-use-case-for-explicit-primary-key-values.md" >}}) first. You're not one of those people that watches movies or reads books out of order, are you?

## Sorting and filtering logic

When presenting a list of records, it's very common to apply either a default or user-selected sort. Is this worth testing? I say yes.

If we're not careful, we might assert things are sorted by date, but if we create the records in a default order, it's possible it could pass for a reason other than what we're expecting.

I use a mix of techniques, including specifying the primary key, to increase my confidence that I'm actually testing the logic I intend to test. Take a look at this test setup:

```php
<?php
factory(Season::class)->create([
    'id' => 44,
    'name' => 'chicken',
    'start_date' => '2019-01-01',
    'end_date' => '2019-03-31',
]);
factory(Season::class)->create([
    'id' => 45,
    'name' => 'steak',
    'start_date' => '2018-01-01',
    'end_date' => '2018-03-31',
]);
factory(Season::class)->create([
    'id' => 46,
    'name' => 'buffalo',
    'start_date' => '2018-04-01',
    'end_date' => '2018-12-31',
]);
```

I want to make sure my seasons are sorted in reverse chronological order, based on start date. The above setup was carefully chosen to increase confidence. I specifically create the items with names and dates sorted *differently* than the primary key.

```php
<?php
$orderedResult = [
    [
        'id' => 44,
        'name' => 'chicken',
    ],
    [
        'id' => 46,
        'name' => 'buffalo',
    ],
    [
        'id' => 45,
        'name' => 'steak',
    ],
];
```

My response doesn't include the dates. I only get `id` and `name`. But because of how I set up my test, I can make an assertion based purely on those values and be confident it was my logic ordering the results, not some unintended side-effect putting them in the desired order for some other reason.

This example doesn't test any filtering, but the same principles apply.