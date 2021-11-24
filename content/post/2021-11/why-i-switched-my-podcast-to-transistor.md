---
title: "Why I Switched My Podcast to Transistor"
cover: "/images/opinion.png"
tags: ["laravel", "podcast"]
date: 2021-11-23T16:30:30-06:00
---

Podcast hosting is one of those things that feels very difficult to change. I worked hard to build an audience and I didn't want a behind-the-scenes technical change to break any subscriptions and alienate listeners. As a result, I kept putting off the move to Transistor. Well, I finally took the plunge, and I'm happy to report it was *much* easier than I anticipated. Before we get into the details, I want to step back and explain my motivation to move in the first place.

<!--more-->

When Aaron and I first launched our [Laravel podcast](https://show.nocompromises.io/?ref=jc) in August 2020, we chose Simplecast as the hosting platform. It came recommended from some friends, and I noticed a bunch of the podcasts I listened to were hosted there. It seemed like a sensible choice.

The honeymoon ended quickly. Within a couple months, we ran into our first issue. Each time we release an episode, I promote it on social media, and I'd occasionally get someone saying the link didn't work because the certificate was bad. I'd click on my shared link and it loaded fine for me, so I chalked it up to user error and moved on. Thankfully, though, some kind person on Twitter shared a screenshot of the error they were seeing:

![Simplecast certificate error](/images/why-i-switched-my-podcast-to-transistor/01-error-screenshot.png)

I was using a custom domain of `show.nocompromises.io`, but Simplecast would randomly serve up their `*.simplecast.com` wildcard certificate. Even worse, it was an expired version of this incorrect certificate. This mismatch and expiration caused the error in the visitor's browser.

I opened a support ticket with Simplecast, and after 3 days of back-and-forth, there was no real resolution. The support engineer explained it away as a "temporary glitch." I moved on with my life, although never quite satisfied with that explanation.

A few months later, I pointed [OhDear](https://ohdear.app/) at our podcast site, and it would report that same certificate mismatch once or twice a day. Each time, it would resolve in 10 - 15 minutes, but I finally had proof this was not a "temporary glitch", but an ongoing issue. I re-opened the ticket with Simplecast support, and tried for over 4 weeks to convince them this was a problem on their end. I sent screenshots, verbose curl captures of the error, failures from [SSLLabs.com](https://www.ssllabs.com/ssltest/), and anything I could think of to help them diagnose and solve this. I'd occasionally get a promising reply from them, but eventually they blamed my monitoring tool and essentially punted on the issue. I couldn't tell if they were unable or unwilling to fix the issue, but either answer wasn't good.

At the same time as all of this, I was hearing a lot of buzz about [Transistor](https://transistor.fm/?via=joel-clermont). This relatively new podcast hosting platform was built by members of the Laravel community, and I always enjoy supporting a product from a fellow Laravel developer when possible. Plus, it had some features I really wanted. For example, I had just [moved all my sites to Fathom Analytics](/post/2020-09/why-i-switched-to-fathom-analytics/), and Transistor had built-in support for Fathom. Despite all these factors, I still dreaded the thought of moving.

I finally made the decision that temporarily breaking our podcast during a hosting move was worth it to get away from Simplecast and move to the hosting platform I really wanted to use. Being honest, our hosting was already broken with these certificate issues. I planned out the migration, following the really nice guide on [how to migrate your podcast to Transistor](https://support.transistor.fm/en/article/importing-your-podcast-from-a-different-provider-fvkczq/). As part of my planning, I contacted Transistor support with some questions on how to handle episode link redirects. Here was my first pleasant surprise: support was great! Transistor offered to manually map old URLs to new URLs. All I had to was send them a CSV file documenting all the mappings. This went above and beyond what I expected. Even better, when I did the episode import (this was super simple by the way) it turned out it wasn't even necessary. Transistor slugified our episode titles exactly the same as Simplecast did, so no mapping was needed. All my URLs would continue to work!

When the day of the cutover arrived, we made our final DNS updates, and monitored everything closely. To our amazement, the migration happened without a single issue! All traffic and subscribers moved without any interruption. Download counts continued on with their previous trend, and Simplecast downloads stopped as expected. Looking back, I don't know why I feared this so much. It ended up being incredibly easy and trouble-free.

As of the time I'm publishing this article, it's been a little over three months since we switched to Transistor, and I couldn't be happier. I've interacted with support a handful times (even once about a certificate question), and every time I got a quick, competent reply.

As a bonus, there are some nice friendly touches throughout the site. Here's one example:

![Friendly detail at Transistor](/images/why-i-switched-my-podcast-to-transistor/02-friendly-detail.png)

If you've been on the fence about making the move, or if you've been thinking of starting a new podcast, [I highly recommend Transistor as a podcast host](https://transistor.fm/?via=joel-clermont). Click that link to learn more and get started with a free 14-day trial.

