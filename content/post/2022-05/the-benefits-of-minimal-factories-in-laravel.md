---
title: "The Benefits of Minimal Factories in Laravel"
tags: ["laravel", "factories", "testing"]
cover: "/images/laravel-testing.png"
date: 2022-05-23T09:00:00-05:00
---

Laravel factories are a huge time-saver when writing tests. In the past, I'd build a factory to include every model property in the default state, but lately I've switched to having minimal factories by default. I'll explain my reasons for this change, and what benefits I've found.

<!--more-->

Let's consider a specific example: a `UserProfile` model. It has a foreign key `user_id`, two non-null properties, and then over a dozen optional properties, like `bio`, `profile_image` and so on. When I talk about a minimal default factory, I mean it only defines properties that are necessary to successfuly save to the database. So, in this `UserProfile` factory, I'd only define `user_id` and my two non-null properties in the default factory state.

I'd then create additional states that set the optional fields. For example, I might define a `hasImage()` state to set the `profile_image` field, and a `hasBio()` state to set the `bio` field. I can also found define a `fullProfile` state which combines all these individual helpers to fill out every single possible field on this model. Then, if I need extra fields or a fully-filled-out profile, I can still use the factory to save me time. (As a side note, this is one reason I absolutely love the change to class-based factories in Laravel 8. It's so much easier to share logic and build a more expressive factory.)

So, why did I make this change? What benefits have I found? I'd say the largest benefit, by far, is much more readable tests. Being able to see the key characteristics of the model I'm creating, just by looking at the factory method chain in my test method, is really useful when scanning a test suite and trying to understand it quickly.

> Speaking of readable factories in tests, if a model has different states which influence business logic, I'll usually create a named state which makes no changes to the default state, just for readability. For example, if an Address has a `type` property which can be `home`, `work`, or `other`, and the default state sets it to `home`, I'll still create a `home()` state which doesn't change anything, just so I can clearly see in my test that this is a home address. It's not always useful, but when the default state influences business logic, I find it really handy to be explicit in the test.

One additional benefit is that it can speed up your tests a little bit. In my `UserProfile` example, why ask Faker to generate several paragraphs of text, and then make my database persist all that data, when it won't affect my test logic at all? Yes, I'll admit this could be dismissed as a "micro-optimization", but I've seen it add up to a noticeable degree as the test suite grows.

This performance savings is especially true of optional relationships. Let's say your app allows users to make payments. Instead of having your `UserFactory` generate a few random payments, that is something I'd delegate to the test method. I wouldn't even add this as a state to the `UserFactory`. Instead, if a particular test method needs a user to have payments, it should take responsibility to generate those with a call to the `PaymentFactory`.