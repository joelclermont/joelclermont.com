---
title: "Should an AJAX Controller Be Put in the API Route Group?"
tags: ["laravel", "http", "apis", "routing"]
cover: "/images/opinion.png"
date: 2022-05-31T16:09:07-05:00
---

If your Laravel app is "full stack" and rendered with Blade views, but you have a few controller actions called only by Javascript, should those controllers go in the `api` route group or should they stay in the `web` route group?

<!--more-->

First, I recognize AJAX is a somewhat dated term, and technically we're referring to an XHR (XMLHttpRequest), but I'm going to stick with it because I think it's still a common way to ask this question. It's sort of like TLS vs SSL. We all know one is more accurate, but sometimes language habits die hard. With that nerd sniping out of the way, on to the answer...

Let's get a little philisophical: what is an API? Generally, I think of something primarily intended for machine interaction. It's a simplified interface focusing on data exchange, not something an end user would navigate directly. This is in contrast with an HTML user inteface, where we expect a user to be pointing and clicking. Where things get a little grey is in our scenario mentioned at the beginning of the article. You have an HTML user interface, but one small interactive part of that interface uses Javascript to make a call to your application.

Personally, I would recommend that these calls be placed in the `web` route group, even though they are being called in a very similar way to a traditional API. To understand my reasoning, it's important to remember what is actually different between the `web` and `api` route groups. In a default Laravel install, the only real difference between the `web` group and the `api` group is which middleware are applied, and that the `api` group has a path prefix and a rate limiter. That's really it. There isn't anything more special about it. You can open up `RouteServiceProvider.php` and `Http\Kernel.php` to confirm this.

In light of these limited differences, the question then becomes "which set of middleware do I want"? Do I need rate limiting? Will this controller ever be called outside the context of session-based auth in a Blade-rendered snippet of Javascript? If the answer is "no", then it makes a lot more sense to keep this in the `web` route group, and not put it in the `api` route group.

Also, and this is a bit more subjective, but explicitly calling something an API, makes it seem like you should adhere to a spec. You should care about breaking backwards compatibility. Even if you don't officially have any external API callers, and you control anything that should be calling the API, it still feels a bit chaotic to me to label something an API and then change it with no careful planning. On the other hand, if it's just one of your web controllers, I don't think there's any implicit contract expectation. 

One nuance I would add is if you're using Sanctum. In this case, I would instead argue that these controllers should be placed in the `api` route group. That being said, you likely aren't using Sanctum if your app is only rendering Blade views for users to point and click.

Finally, I want to make the point that just because we're keeping these AJAX controller in the `web` group, that does not mean we should jam them into other existing controllers. More often than not, these types of controllers will be invokable controllers with just a single method in them. It keeps your controllers uniform, following the resource conventions, and preventing them from growing to 1000-line monsters.
