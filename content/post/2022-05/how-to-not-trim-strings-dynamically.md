---
title: "How to Not Trim Strings Dynamically"
cover: "/images/laravel-tip.png"
tags: ["laravel", "middleware"]
date: 2022-05-05T17:08:39-05:00
---

Laravel automatically trims incoming strings in the HTTP request. This convenience can be easy to take for granted because it's such a sensible default behavior, but how would you disable it for just one route? And why might you want to do that?

<!--more-->

First, just to be clear, when I say trimming a string, I mean that all leading and trailing whitespace is removed. So if someone types an extra space after their email address in a form, Laravel will trim that value in the request, so that `$request->safe->only(['email'])` will be what they typed minus the trailing space, which is what the person intended. It keeps your data tidy, and it does so with no extra developer effort required. The `TrimStrings` middleware is in the default set of global middleware when you set up a new Laravel project.

> The `TrimStrings` behavior isn't tied to request validation. It works fine on `$request->get('email')`, but you always [validate user input](https://masteringlaravel.io/laravel-validation-book?ref=jc), right?

Interestingly, there is one exception out of the box for this middleware: the `password` and `password_confirmation` fields. In any request, if someone types leading or trailing spaces into a field named `password`, the `TrimStrings` middleware will leave it untrimmed. This makes sense because it's possible someone could want a leading or trailing space in their password. This exception is set in a protected array named `$except` in the `App\Http\Middleware\TrimStrings` class.

In my case, I was writing code to handle a webhook sent by Twilio. Part of the webhook payload is a signature verification header. It's important to validate the header against the received message to make sure the message is authentic. In Twilio's docs, they specicially mention that [you should NOT trim strings](https://www.twilio.com/docs/usage/security#notes) for their webhook request payload. If you do, the signature won't validate and the webhook will be rejected. So, how can I turn off the `TrimStrings` middleware for just this one route?

My solution was to use a really helpful extension point on the `TrimStrings` middleware called `skipWhen`. This static method accepts a closure that should return true or false. If it returns true, the `TrimStrings` middleware is skipped for that individual request. Also, the current request is passed into the closure, so you can use that in your logic. In my case, I wanted to just skip it for one particular route, so it was a simple one-liner:

```php
<?php

App\Http\Middleware\TrimStrings::skipWhen(fn ($request) => $request->url() === route('api.v2.webhooks.webhook-client-twilio-conversations'));
```

Place that in the `boot` method of your `AppServiceProvider` and it works exactly as designed.

Finding this method took a little digging. I didn't see it in the docs (though I'm thinking I should PR the docs to add it), and I had never used it before. Never underestimate the benefits of a little source diving. If you'd like to hear some alternate solutions I considered, and why I ultimately picked this approach, we [recorded a podcast episode on the topic](https://show.nocompromises.io/episodes/should-i-write-this-weird-code-or-is-there-a-laravel-feature-i-can-use-instead). Check it out if you want to know more.
