---
title: "New Laravel Migration Shortcuts for Foreign Keys"
tags: ["laravel", "migrations"]
date: 2020-09-10T17:23:49-05:00
cover: /images/laravel-tip.png
---

While everyone is loving the features in the new Laravel 8 release this week, I just discovered something cool I missed in Laravel 7.

<!--more-->

Inside your migration, if you need to specify a foreign key, that typically would require two separate lines of code: one for the field itself, the other for the foreign key constraint.

```php
<?php
Schema::table('posts', function (Blueprint $table) {
    $table->unsignedBigInteger('user_id');

    $table->foreign('user_id')->references('id')->on('users');
});
```

This is such a common pattern, however, that a convenience method was added in Laravel 7 that does both in a single line of code.

```php
<?php
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained();
});
```

> Both examples come straight from the [Laravel 7 docs](https://laravel.com/docs/7.x/migrations#foreign-key-constraints).

This isn't a ground breaking feature, in fact it wasn't even listed in the Laravel 7 release notes, but it is a nice quality of life improvement that I'm glad I stumbled across reading the docs recently.

It's probably not a bad idea to just periodically re-read the docs with a new major version. There are likely little gems like this that would go overlooked otherwise.
