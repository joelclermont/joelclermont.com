---
title: "Covering Value Ranges in Your Tests"
tags: ["Laravel", "testing"]
date: 2020-10-29T11:16:49-05:00
cover: /images/laravel-testing.png
---

For me, one of the main reasons I write tests is to have confidence that my code is working as expected and to catch myself if (or should I say when?) I break something in the future. I often think of testing the happy path and the failure path, but I'll share some additional things I like to test in between that further boost my test confidence.

<!--more-->

Let's say we're writing the `store` method on a resourceful controller. A user will enter values into form inputs and those will get persisted to the database. The database schema enforces limits on the size of data we can store in each column. Since I care about user experience, I'll add a few things to help a user know what is expected. For example, I'll add a `maxlength` attribute on the input, so their browser limits how much they can enter. Beyond that, I'll also enforce size validation on the server side in a Form Request. Both of these things line up with the database schema's max size for that column, which is set when we build the database migration.

I might be an outlier, but I like to write a test that confirms a value that exceeds my expected maximum size will be rejected. Some might argue that I'm "testing the framework", but I don't see it that way. I see it as encoding business logic in a test as to what are expected and unexpected values for a given form. I've seen other approaches where a developer will simply test that certain validation rules exist on the Form Request, but I just like sending in a request and asserting against session errors. That round trip gives me initial confidence that my validation is working as expected, but it also has helped me catch future changes where logic in different parts of the code gets out of alignment.

Recently, I bumped into an issue in production that exposed another possible area I may start testing. I added a column to an existing table, and I was expecting it to support up to 1,000 characters. I added a `textarea` to the form, set the `maxlength` attribute on it, and I also added size validation to my Form Request. As usual, I added a failure test to confirm that no more than 1,000 characters would be expect. All good, until a few days after shipping this, I got the following production error in Bugsnag: `SQLSTATE[22001]: String data, right truncated: 1406 Data too long for column 'decline_reason' at row 1`.

My first thought was that maybe I forgot to write the failure test correctly, but I quickly confirmed the test was fine and was still passing. Then I noticed that the failed request captured in Bugsnag showed that the rejected value was only 357 characters. That seemed odd. After a few more minutes, I realized I had never set an explicit length in my migration, so the default value of 255 characters was used. My validation was working as expected, but it didn't align with the database schema. Oops!

Any time I encounter a bug in production, I write a failing test to reproduce it. In this case, I updated my happy path test to use a value of exactly 1,000 charactes for this `decline_reason` field. Sure enough, it failed, and after I ran a new migration, it passed. Easy enough to fix, but it made me rethink my testing strategy. How could I catch something like this in the future, before it gets into production? I'm not quite sure I always want to use a maximum length value for every happy path test, but perhaps when it deviates from the default length, I might consider it. If you have thoughts on this particular type of test, I'd love to hear them.