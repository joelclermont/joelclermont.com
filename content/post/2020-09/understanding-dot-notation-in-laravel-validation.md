---
title: "Understanding Dot Notation in Laravel Validation"
tags: ["laravel", "validation"]
date: 2020-09-19T08:03:30-05:00
cover: /images/laravel-tip.png
---

Laravel validation supports "dot notation" to let you validate arrays in a request. But what if your field name contains a literal dot?

<!--more-->

First, let's see what happens if we do nothing special.

```php
<?php
$request = ['field.name' => 'xyz'];

$validator = Validator::make($request, [
    'field.name' => 'required',
]);

$validator->fails(); // true
```

The reason this fails is that the validator interprets `field.name` as an array, and it would only pass if your request had a value in `field[name]`.

The work around for this is pretty simple:
```php
<?php
$request = ['field.name' => 'xyz'];

$validator = Validator::make($request, [
    'field\.name' => 'required',
]);

$validator->fails(); // false
```

All we did was change `field.name` to `field\.name` in our rule definition. This is easy to do, but why does it work? What's happening under the hood?

Inside the Validator constructor, it calls a method called `setRules`. Notice this chunk of code from `setRules`:
```php
<?php
$rules = collect($rules)->mapWithKeys(function ($value, $key) {
    return [str_replace('\.', $this->dotPlaceholder, $key) => $value];
})->toArray();
```

So the reason `field\.name` works is because the validator is explicitly looking for `\.` and replacing it with something else. At first glance, `\.` may appear to be regular expression syntax (and it is), but there are no regular expressions involved here. This is important to note so you don't think you can use other random regex patterns in rule keys.

But what is `dotPlaceholder`? Note this line from the Validator constructor:
```php
<?php
$this->dotPlaceholder = Str::random();
```

The validator is replacing your literal `\.` with a 16 character random string. This prevents the `.` from being interpreted as array dot notation, but it also prevents collision with other possible values that might appear in a field name. At the tail end of the validation process, that `dotPlaceholder` random string is then changed back to `\.` so it looks as expected in validation messages and other output.

Why all this extra work? Why not just let `.` mean both a literal character or the array dot notation?

```php
<?php
$request = ['field.name' => 'wrong', 'field' => ['name' => 'right']];

$validator = Validator::make($request, [
    'field.name' => ['required', 'in:right'],
]);

$validator->fails(); // what should it be, true or false?
```

In the above example, the developer likely assumes that `field.name` should match the literal request key `field.name` not some array that they never created in their HTML form. But without this explicit handling of a literal dot in a field name, a sneaky user could add an array to their request to bypass your intended validation rule. There's even a test for this behavior in the [framework test suite](https://github.com/laravel/framework/blob/8.x/tests/Validation/ValidationValidatorTest.php#L3914).

So why did I write a 400+ word blog post to tell you to add a slash before literal dots in your rule keys? Because I think there's value in digging below the surface and understanding why something works, instead of just how to use it. Plus, this will be great trivia to pull out the next time there's a lull in the conversation.
