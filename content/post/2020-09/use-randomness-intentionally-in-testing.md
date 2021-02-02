---
title: "Use Randomness Intentionally in Testing"
tags: ["testing", "laravel"]
date: 2020-09-16T14:56:51-05:00
cover: /images/laravel-testing.png
---

Randomness can serve a useful purpose in factories, seeders, and tests. There are times it can cause issues though. Here are some rules I think about when introducing randomness into a test.

<!--more-->

Randomization is so easy when writing factories. [Faker](https://github.com/fzaninotto/Faker) is sitting there, just waiting to be used. It serves a useful purpose too: who wants to have every user with the same first and last name, or who wants to come up with a bunch of fake names/emails. I especially like randomization when seeding a local dev environment for clicking around the application.

> I shy away from using seeders or a pre-seeded database in testing, but that's a separate post.

Testing, however, is an area where too much randomization can lead to trouble. If you're randomizing a value that changes application behavior, you can end up with a flaky test that passes 99% of the time, but fails every once in a while. If you ever have a test suite that just fails, and you reflexively re-run it because you know it will pass the second time, I'd wager there's a high chance randomization is the culprit.

My rule of thumb now is to never randomize something that drives application logic. For example, if your app has roles, permissions or the concept of a "user type", I would never randomize those fields or relationships in my factories. If your app has logic that's location sensitive (sales tax calculations, available products/features, etc), I would avoid randomizing state/province or country. There are many other examples that fall into this general category of application logic.

Instead of using randomization, I prefer to define those types of fields/relationships as [factory states](https://laravel.com/docs/8.x/database-testing#factory-states). You can make a judgement call as to which value should be your default state, but explicitly call out other possible states instead of letting it be random. I've even sometimes redefined the default state as a named state just to make my tests more explicit when reading them. For example, maybe my default `Customer` factory assigns a country of `US`, but I'll still create a factory state called `us` that also sets it to `US`. You can even use multiple states together in a test, to get maximum readability.

I like seeing
```php
<?php
// This is much easier to understand in my test
Customer::factory()->us()->activated()->create();

// Where this makes me have to remember that the default Customer is in the United States with an active status
Customer::factory()->create();
```

> If you want to hear more on this topic, check out this [podcast episode](https://show.nocompromises.io/episodes/whats-with-these-flaky-tests) where Aaron and I talk about flaky tests in general, and other strategies that helps us get more confidence from our test suite.
