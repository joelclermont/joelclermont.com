---
title: "Multi-word Route Parameters in Laravel"
cover: "/images/laravel-tip.jpg"
tags: ["laravel", "routing"]
date: 2022-01-04T17:37:06-06:00
---

We all make stupid mistakes from time to time. I'm sharing this one to hopefully save someone else a little frustration.

<!--more-->

I was upgrading an app from Laravel 5.5 to 8.0 recently (thanks [Laravel Shift](https://laravelshift.com)!), and along the way I bumped into a small issue that burned some time before I realized the error of my ways. 

Consider this route:
```php
<?php
Route::apiResource('show-participation', Api\V1\ShowParticipationController::class)->only('show');
```

And then consider this line of code from a test:
```php
<?php
$response = $this->getJson(route('api.v1.show-participation.show', ['show-participation' => 'abcd']));
```

This code worked fine in Laravel 5.5 and the test passed. When I upgraded to Laravel 6.0, the test was failing with this error:

```console
Illuminate\Routing\Exceptions\UrlGenerationException:
Missing required parameter for [Route: api.v1.show-participation.show] [URI: api/v1/show-participation/{show_participation}] [Missing parameter: show_participation].
```

It took me longer than I'd like to admit to realize that the expected route parameter is `show_participation` and I was providing `show-participation` in my test. This only worked prior to Laravel 6 because older versions would happily bind parameters based on position, even if the names didn't match. Starting in Laravel 6, unexpected route parameters get bound into the generated URL's querystring.

This is where it's good to recognize the all-important skill of slowing down and reading the error message. If I had read carefully, I would have saved myself some grief.

> Pro tip: Now when I get an error message that doesn't immediately highlight the error for me, I actually read it out loud. This forces me to slow down enough to realize that a hyphen and underscore are not the same thing.
