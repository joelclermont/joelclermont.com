---
title: "How Apps Break Without Any Code Changes"
tags: ["opinion", "programming"]
date: 2021-02-11T10:24:39-06:00
cover: "/images/opinion.png"
---

Many times you can trace a bug back to a particular code change that was made. Or maybe it was caused by a package upgrade. But have you ever had something break when no code changed at all? How does that happen?

<!--more-->

Let's consider one example that burned me this week: Browsers changing behavior.

I love evergreen browsers. No more need to worry about targeting specific versions. It's a great time to be alive as a developer. However, it's a little bit of a two-edged sword. Changing behavior can break your code.

We have an application that shows a summary table of data: rows and columns. You can click a link to open a detail view of a specific record. When you make a change on that new detail page and save it, we automatically refresh the summary view so you can see that change you just made.

This is done using the [built-in `opener` variable](https://developer.mozilla.org/en-US/docs/Web/API/Window/opener) that browsers set when you navigate from one page to another. A simple call like this on the detail page will trigger a method on the summary page:

```js
// you'd want to wrap this in a check in case opener was not set
window.opener.refreshData();
```

Today I got a call that this feature broke. I was confused since we haven't deployed any changes to this application in a few weeks. It turns out evergreen browsers are to blame.

It's been known for a while that the `opener` variable could be exploited if you link to a site you don't control. I won't go into the details, just read [Aaron's excellent post](https://www.aaronsaray.com/2018/reminder-that-target-blank-is-not-safe) on it. Because of this "tab-napping" vulernability, browsers made the decision to change the default behavior of `target="_blank"` links to no longer set that `opener` property by default:

* Safari was first to make the change back in [October 2018](https://webkit.org/blog/8475/release-notes-for-safari-technology-preview-68/)
* Firefox changed it last summer in [version 79](https://hacks.mozilla.org/2020/07/firefox-79/)
* Chrome changed it last month in [version 88](https://www.chromestatus.com/feature/6140064063029248)

Guess which browser our bug reporter used? Chrome. The solution was simple: add `rel="opener"` to these links, but I thought it nicely illustrated the idea of "application rot", a phenomenon where working web apps just break without any developer intervention.

Next time you're discussing the importance of regular app maintenance and testing with a client or stakeholder, feel free to reference this post for some added ammunition. 
