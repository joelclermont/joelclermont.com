---
title: "Another Use Case for Explicit Primary Key Values"
tags: ["laravel", "php", "testing"]
date: 2020-09-02T07:38:51-05:00
---

Yesterday I shared an example where setting explicit primary key values in your tests can make your tests more reliable. Let's take a look at another example.

<!--more-->

If you missed yesterday's post, I'd recommend [reading that first]({{< ref "testing-strategy-explicit-primary-key-values.md" >}}). It sets up some important context, and answers some commonly asked questions.

## Simplified identification of manipulated records

This example is less about missing a subtle bug, and more about making your tests easier to read and write.

Let's say our application has teams and those teams have players and scores. Occasionally, two teams will merge and we want to combine their players, as well as their score histories. There's a fair bit of logic going on behind the scenes in addition to updating the `team_id` record on the `scores` and `players` tables:

* Which team number will the new merged team use?
* Which of the two team captains will be the captain of the merged team?
* What if the two merging teams both played at the same event? How do we merge those scores?

Clearly we need to write some tests around this logic!

When arranging this test, we'll use factories to generate our two teams, along with some number of players and scores for each team. Then, our test will run the team merge, and finally we'll make some assertions on the results. With all these different score and player objects, we can use explicit primary key values to more easily identify them in our assertions.

> Just as I mentioned in the [last article]({{< ref "testing-strategy-explicit-primary-key-values.md" >}}), there's a benefit to picking higher values (`923` and `981` instead of `2` and `3`), as well as picking non-sequential values. On the surface, this may seem silly, but there's a reason for it, which I explained in the questions at the end of that article.

Seeing these explicit values in both our factory calls and our assertions makes it crystal clear what we're expecting to happen.

I've always liked trilogies, so I think I'll share one more example in a future post.