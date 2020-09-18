---
title: "Why I Switched to Fathom Analytics"
tags: ["fathom", "privacy"]
date: 2020-09-18T07:28:50-05:00
---

Google Analytics is free and has every imaginable feature you might ever want. So why would I switch to paying for Fathom Analytics?

<!--more-->

First and foremost, I personally dislike pervasive tracking and data collection. It strikes me as both creepy and unnecessary. Even worse, it feels like most people are either unaware of what's being collected or just assume it's the only way to operate. I wish more developers would pause and take a breath before collecting user data, asking themselves "Do we really need this?" Bonus points if they ask the question "Will this improve the user's experience?"

Second, sending the signal that you respect privacy is a good look to my users. This blog is not a commercial endeavor. I do it to share knowledge and give back to the community. Why sully that with a Google or Facebook tracking script? True, many of them might never notice. But for those that do, it's a nice little way of building trust with my audience. And, with the recent release of Safari 14 and iOS 14, and the upcoming release of macOS 11, [more users will see this tracking behavior by default]({{< ref "fathom-analytics-macos-big-sur.md" >}}).

On top of those "warm and fuzzy" benefits, the reality is I actually get **more accurate data** from Fathom Analytics than I did with Google Anayltics. True, I don't get the same amount of data, but honestly I didn't care about 99% of the things GA collected for me. My main audience is developers, and many developers use ad blockers. Those ad blockers render Google Analytics unusable, so I'm missing out on traffic from a chunk of my audience. On the other hand, Fathom Analytics is not blocked by Safari's privacy blocker or a couple of the other popular ad blockers I looked at. And for those blockers that do target Fathom for some reason, I can just [host Fathom on my own domain](https://usefathom.com/support/custom-domains), and get 100% accuracy. Well, I won't get that one guy who still browses the web with Javascript disabled by default, but I can live with that.

One final reason, and honestly the one that pushed me over the edge to try it: I like supporting the Laravel community, and [Jack Ellis](https://twitter.com/jackellis/) has been a valuable part of that community. He is constantly sharing his knowledge, much of which he gained in building Fathom. He published a post with very detailed information as to [how he used Caddy to drive out the custom domains feature of Fathom](https://laravel-news.com/unlimited-custom-domains-vapor), and it directly helped me on one of my own projects, saving me time and money. Watching his recent Laracon talk was the final push I needed to drop Google Analytics from my sites and switch to Fathom.

> If any of this resonates with you, I highly encourage you to [sign up for a free Fathom Analytics trial](https://usefathom.com/ref/FXFCXN). Full disclousre: That is a referral link. If you found this article useful and want to give a little something back, click on through.
>
> If not, stick it to the man and click this [non-referral link](https://usefathom.com). Ooh you rebel!