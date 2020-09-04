---
title: "Know Your Users"
tags: ["ux", "validation"]
date: 2020-09-04T07:35:40-05:00
---

Ask most developers a question and you'll often hear the phrase "it depends". While it can be annoying, there's a truth to it. Let's consider an example of how knowing who your typical user is can affect even basic decisions like how to validate a request.

<!--more-->

Generally speaking, you want to give your users as much information as possible for them to provide the correct data when filling out a form. For example, we use specific input types where we can and we set properties to guide them in entering valid data. Beyond that we might use placeholders, labels, or even helpful validation messages to explain exactly what is required.

I'd like to share an example where I made a conscious decision to not provide this type of information to the user, and why I came to that conclusion. The application is used by a company which hosts trivia events across the country, mostly in bars and restaurants. There are casual players who just happen to be in the bar that night and play along. Then there are the trivia fans who regularly play as a team and come to the bar specifically for the event. That second type of player tends to have a sense of humor, and sometimes pushes the boundaries with sarcastic answers or wagers just to rile up the host for the night, and that's even before they have a few drinks in them.

At the very end of the game, there's a final question with a freeform wager field. The host has latitude to set the parameters for this wager, so there's no business logic in place to say exactly how big the maximum wager can be. Instead, we just use a typical integer field in the database, and validate that they haven't blown by that.

> As an aside, you may wonder if it's overkill to range validate a mysql int field when the typical wager is something like 10 or 20 points. Well, let me just share with you a failed wager that was logged earlier this week:

> `999999999999999999999999999999999999999999999999999199999999999999999999999999999999999998999999999999999999989999999999999999998999999999999999998999999999999999999999998999999999999999999999999999999999999999999999899999999999999999999899999999999999999`

> Yes, that's a real wager a player entered on their smartphone for the final question. Perhaps now you're getting a better sense for the type of user we're dealing with.

By default, the `max` validation rule message would tell the player the precise maximum value they could enter. But if we did that, then this "funny" player would just enter that as their wager the second time, and their mission to mess with the host would be successful. Instead, we override the default validation message and simply say: `That wager is out of range.` Now, after one or two failed attempts, they'll give up and just enter a real wager.

The same logic went into not enforcing the range on the input property itself. Why give them more information that could lead to annoying the host? Yes, it's possible this player could be extremely persistent and keep guessing to figure out the largest value they could send. Or maybe the player is a developer and they could guess that we're using a signed int field, and would enter `2147483647` anyways. But this isn't about security, and it isn't meant to be perfect, it will just knock down 99.99% of the stupid final wagers a host might get otherwise.

Do you have any interesting stories of times you decided to change up normal behavior because of your understanding of who the typical user is? Share it in the comments below or let me know on [Twitter](https://twitter.com/jclermont).
