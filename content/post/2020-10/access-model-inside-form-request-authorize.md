---
title: "Access the Model Inside a Form Request"
tags: ["Laravel"]
date: 2020-10-21T11:50:28-05:00
---

Laravel's form requests really help reduce the amount of code in your controllers, especially around validation. Another convenience method they offer is authorization. I recently came across a small tip which isn't explicitly stated in the docs and thought I'd share it.

<!--more-->

When authorizing a request, sometimes you need to look at the Eloquent model that is being displayed or altered. The docs show this handy example of how you can get access to route parameters inside the form request.

```php
<?php
public function authorize()
{
    $comment = Comment::find($this->route('comment'));

    return $comment && $this->user()->can('update', $comment);
}
```

What isn't directly stated is that if you're using route model binding, that `Comment::find` database query isn't even necessary. The route parameter will already contain the full Eloquent model. Not a huge quality of life improvement, but it does save you one unnecessary database query.

As a reminder, if you're using implicit binding, the variable name for your controller action's parameter must exactly match the route segment name AND it must be type-hinted as the model class.

```php
<?php

// web.php
Route::get('/users/{user}', [UserController::class, 'show']);

// UserController.php
public function show(ShowUserRequest $request, User $user)
{
    // works
}

public function show(ShowUserRequest $request, $user)
{
    // does not work: no type-hint
}

public function show(ShowUserRequest $request, User $selectedUser)
{
    // does not work: variable name doesn't match route parameter
}
```

It may seem odd that the form request, which is being injected into the controller action, could be affected by other parameters injected into that same action. It's important to remember that model binding happens within the `SubstitudeBindings` middleware which is run before the form request's `authorize` method is run.

Specifically, all the work happens in `ImplicitRouteBinding::resolveForRoute()`. I'd recommend taking a few minutes to look at the [source code](https://github.com/laravel/framework/blob/8.x/src/Illuminate/Routing/ImplicitRouteBinding.php#L21) for this method and you can see exactly how this works under the covers.
