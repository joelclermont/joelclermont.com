---
title: "Testing Strategy: When to Use Explicit Primary Key Values"
tags: ["laravel", "php", "testing"]
date: 2020-09-01T07:57:55-05:00
---

Based on the projects I've seen over the years, it's a bit unusual to set an explicit primary key value when arranging the database state for a feature test. I'd like to share a few times when this strategy can make your tests more reliable.

<!--more-->

One big source of flaky tests is an inconsistent database state. To fix this, I configure the test suite to use a fresh database on each run, and further isolate each test from other tests with database transactions. Laravel has a handy `RefreshDatabase` trait which manages all this for you. 

This approach gives me a lot more confidence in my tests, but the tradeoff is that each test requires some work to set up the appropriate database state. Here again, Laravel helps us out with some robust database factory tools.

Factories use a mix of default values, randomization, and context-specific overrides to let us quickly set up the state we need for our test. Generally speaking, we ignore the primary key field, typically `id`, when using these factories. We let the database do its thing and automatically generate those `id` values as records are inserted. But when might this automatic database key creation make our tests less reliable? And how could setting an explicit primary key value help?

## Queries with manual joins

In Laravel, most database interactions use the Eloquent ORM and managed relationships, but there are times when you reach for a manual join. If you're not careful, joining additional tables could cause fields in your result set to get clobbered by identical field names in the joined table.

Take a look at this simple join:
```php
<?php
if ($user->hasRole(Role::HOST)) {
    $query->join('show_host', 'shows.id', '=', 'show_host.show_id')
        ->where('show_host.host_id', $user->id);
}
```

There is a subtle bug here. The database result will have an `id` field, but it won't be `shows.id` like we intend. It will be clobbered with the value from `show_host.id`. 

Now imagine this test:
```php
<?php
$show = factory(Show::class)->create();
$host = factory(Host::class)->create();
$show->hosts()->sync([$show->id]);

$results = $thingBeingTested->someQueryBeingTested();

self::assertEquals($show->id, $results->id);
```

Even with the bug in place, this will pass. Why? Well, think about the three records created by our test: `shows`, `hosts`, `show_host`. Every single one of these in a fresh database will have an `id` of `1`. So when you assert that `$show->id = $results->id`, your test passes because both the correct data and the wrong data are `1`. Oops!

Here is where setting a primary key value helps us. This test will give us more confidence:
```php
<?php
$show = factory(Show::class)->create(['id' => 482]);
$host = factory(Host::class)->create();
$show->hosts()->sync([$show->id]);

$results = $thingBeingTested->someQueryBeingTested();

self::assertEquals(482, $results->id);
```

This test will now catch our subtle join bug. If you're anything like me, you likely have some questions the first time you see this testing strategy:

**Why did you pick 482?** The number itself isn't important. Just don't pick something that's the same in every test or that's close to 1. Imagine we set the `id` to 3. Now a show has three hosts. We're back to our potentially passing test masking a bug.

**Why not assign a random id with Faker?** I prefer seeing the actual number in my assertion. If we use a random id, even one in a high range, we could only assert `$show->id` as the expected value. Using the literal expected value is clearer to understand.

**Why do you want to see the actual number?** Seeing `482` as the expected value makes it crystal clear what value I'm expecting. If instead use `$show->id` as my expected value, there's a slim chance that something else in my test setup or execution will give it a different value. That's obscured if I rely on the model property. Seeing `482` leaves no room for doubt.

In a future post, I'll share other examples of when an explicit primary key value will make your tests better.