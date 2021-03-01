---
title: "Routing Resolution Can Change When Caching Routes"
cover: "/images/laravel-tip.png"
tags: ["laravel"]
date: 2021-03-01T16:10:54-06:00
---

Recently I ran into a change in behavior in my app depending on whether routes were cached or not. Here's what I found, and how I dealt with it.

<!--more-->

This is a classic example of how different environments can cause very different code behaviors. Locally, I never cache routes, but in production, I always do. On the surface, this seems like it's just a matter of performance and convenience, but I bumped into an error in production that impacted users.

The app is quite old, and started its life back in the days of Laravel 4. It's been upgraded to Laravel 8, but there is still some "baggage" I'm working on cleaning up. For example, the routes file had some really odd routes like this:

```php
<?php
Route::any('bio', [EmployerController::class, 'anyBio'])->name('employer.bio');
Route::post('bio', [EmployerController::class, 'postBio']);
```

Locally, without route caching, a `GET` request to `/bio` would resolve to the `anyBio` method, but then when that form also did a `POST` request to `/bio`, it would resolve to the `postBio` method.

Clearly this code is not great, but it was working locally. However, in production, when `php artisan route:cache` was run, now `GET` and `POST` requests to `/bio` both resolve to the `anyBio` method. The `POST` payload is not processed in that method, so the user form submission fails.

The obvious solution is to eliminate these confusing overlapping routes that should never have existed in the first place, but this solution left me feeling uneasy. What if there was some other subtle bug that I wouldn't catch because of route caching? I didn't want to always cache routes locally, that would be annoying.

My solution was to add route caching to my CI pipeline. Now, at least I'd hopefully get a failing test before deployment alerting me to the issue. I even started by writing a failing test for my existing overlapping route, to verify it actually would catch it. Sure enough, my test passed locally but it failed in CI. This is exactly the confidence I wanted from my tests.