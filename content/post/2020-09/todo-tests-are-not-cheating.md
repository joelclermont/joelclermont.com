---
title: "Todo Tests Are Not Cheating"
tags: ["testing"]
date: 2020-09-08T11:17:49-05:00
---

Why would you ever mark a test as `todo`? Isn't that devaluing your tests? Not at all! I'll share some ways I use `todo` tests effectively.

<!--more-->

First, what do I mean by a `todo` test? In PHPUnit, there's a built in `markTestIncomplete` [convenience method](https://phpunit.readthedocs.io/en/9.3/incomplete-and-skipped-tests.html). Or, you could pull in this [handy `HasTodo` trait](https://github.com/package-for-laravel/testing-framework/blob/master/src/Concerns/HasTodo.php) to get a little more info in your runner output. If you're writing Javascript tests using Jest, you can also [the `todo` method](https://jestjs.io/docs/en/api#testtodoname).

There are two ways I use `todo` tests:

1. When I'm starting on a feature or task, I'll usually start by sketching out some high level design notes. I then use tests to drive out the behavior. Instead of writing one test at a time, I'll often do a brain dump and sketch out the tests I can think of for that feature. By explicitly marking them as `todo` they don't get in the way when running my test suite and they don't get forgotten.

2. Once the brain dump is complete, I then tackle tests one at a time, making it pass, and then moving onto the next one. Frequently during this process I'll uncover new behavior I didn't include in the feature design, or I'll think of some additional test that we'll need. As soon as I think of it, I capture it as a new `todo` test.

There's another benefit that comes from using `todo` tests this way. In an ideal world, you would stay on the task until all todo tests are written and passing and the feature is complete. The reality is sometimes different though. You might get pulled off on a different task, or priorities shift. These `todo` tests now serve as a clear path for the developer that picks this feature up later, even if that developer is you one week from now.

The underlying principle in this: capture the test as a `todo` as soon as you identify it. Don't rely on your memory to come back to it later. You will likely forget some details. I know I have in the past.
