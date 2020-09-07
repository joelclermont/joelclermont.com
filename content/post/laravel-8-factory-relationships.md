---
title: "Laravel 8 Factory Relationships"
tags: ["laravel", "testing", "factories", "relationships"]
date: 2020-09-07T09:54:03-05:00
---

A couple days ago, I walked through a [few potential gotchas with relationships]({{< ref "understanding-relationships-in-laravel-factories.md" >}}) in Laravel factories. Let's see how it works in Laravel 8.

<!--more-->

The big change in Laravel 8 is that factories can now be class-based. Instead of a `UserFactory` file being a code block outside a namespace like this:

```php
<?php
$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'remember_token' => Str::random(10),
    ];
});
```

You can define a `UserFactory` class that lives in the `Database\Factories` namespace like this:
```php
<?php
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }
}
```

If you use this new class-based approach, you can use the `factory()` method on your model to define any factory relationships:
```php
<?php
    public function definition()
    {
        return [
            'title' => function ($attributes) {
                return "Post for {$attributes['user_id']}";
            },
            'user_id' => User::factory(),
        ];
    }
```

As with the `FactoryBuilder` approach in previous versions of Laravel, this class-based approach is lazily evaluated. So you can pass in your own `user_id` value when using the factory, and it will not generate an additional unexpected factory.

I really like this new class-based factory approach. There were packages that allowed you to do this before, or you could roll your own system, but I never like straying too far from the recommended framework approach for core concepts. Now that it's in Laravel, I will be wholeheartedly adopting this.

> Pro tip: if you don't want to spend time manually converting all your factories to the new class-based format, [Laravel Shift](https://laravelshift.com) will do it automatically for you as part of its upgrade! Not a paid endorsement or affiliate link, I just seriously love Shift and find it incredibly useful.

But, did you notice the title attribute in my definition? It refers to the `user_id` attribute in this same factory. Will that break the lazy evaluation we're expecting? The short answer is "no!", but in a future post I'll dig into how factories are evaluated and explain exactly why it works this way.