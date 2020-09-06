---
title: "Understanding Relationships in Laravel Factories"
tags: ["laravel", "testing", "factories", "relationships"]
date: 2020-09-05T19:58:20-05:00
---

What's the best way to define a relationship in your Laravel factories? I'll share some tips that will help you avoid some common pitfalls, as well as give you a deeper insight into how factories work.

<!--more-->

Factories were introduced back in Laravel 5.1. From the very beginning, the docs showed this sample code for defining a factory that had a relationship:

```php
<?php
$factory->define(App\Post::class, function ($faker) {
    return [
        'title' => $faker->title,
        'content' => $faker->paragraph,
        'user_id' => function () {
            return factory(App\User::class)->create()->id;
        }
    ];
});
```

But I've seen projects that define that factory like this instead:
```php
<?php
$factory->define(App\Post::class, function ($faker) {
    return [
        'title' => $faker->title,
        'content' => $faker->paragraph,
        'user_id' => factory(App\User::class)->create()->id,
    ];
});
```

Did you spot the difference? The docs recommend wrapping relationship factories in a closure, but this second example just has the relationship factory as the direct value. Why does this seemingly small difference matter?

Consider this chunk of test setup logic:
```php
<?php
$user = factory(User::class)->create();
$post = factory(Post::class)->create([
    'user_id' => $user->id,
])
```

This code works differently depending on whether or not your `PostFactory` wrapped that `UserFactory` in a closure or not. If it's wrapped in a closure, as the docs recommend, you'll end up with one `User` and one `Post` as expected. But if you don't wrap it in the closure, you'll end up with two `User`s and one `Post`.

But wait! I'm specifying the `user_id` when calling the factory, so why is the `PostFactory` creating a second user anyways? What's going on?

If you don't wrap the relationship's factory in a closure, it will be evaluated when the factory returns its default values. At the moment the factory is invoked, and the default values are returned, a new user is created. When your attributes are merged in with the defaults, it's already too late. That created user is now in your database.

If it's wrapped in a closure, evaluation is delayed until after any attributes are merged in. This way, if you specify your own `user_id`, that closure will never be executed, and the `UserFactory` will not be invoked. No mysterious second user will be created!

If you think that closure syntax is too verbose, you could chain the `lazy` method to the `UserFactory`:
```php
<?php
$factory->define(Post::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'user_id' => factory(\App\User::class)->lazy(),
    ];
});
```

If you look at the `lazy` helper, it's literally just wrapping your `FactoryBuilder` in a closure for you:
```php
<?php
public function lazy(array $attributes = [])
{
    return function () use ($attributes) {
        return $this->create($attributes);
    };
}
```

Or better yet, just pass the `FactoryBuilder` itself as your value. Don't reference the `id` property on your `User`:
```php
<?php
$factory->define(Post::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'user_id' => factory(\App\User::class),
    ];
});
```

In fact, this is the recommendation in the docs for Laravel versions 6 and 7.

But what about the cool new class-based factories in Laravel 8? More on that in a future blog post.