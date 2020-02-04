---
title: "Scout APM Review for Laravel"
tags: ["Laravel", "reviews"]
date: 2020-02-04T09:59:42-06:00
---

Application Performance Monitoring (APM) is an important tool to be aware of when developing apps for production. I recently tried out [Scout APM](https://scoutapm.com) and it's new first-class support for Laravel and PHP. Whether you're a seasoned APM pro or have never used this tool at all, you may be interested in my findings.

<!--more-->

APM is a fairly deep topic and can cover a variety of features, but at its core, it is about monitoring the real world performance of your application as users experience it. There are a number of APM products that support PHP, but the one I have the most experience with is New Relic. I recently became aware of Scout APM when it launched support for Laravel and decided to give it a try.

## Installation

As you would expect, Scout APM installation is primarily done via their [Composer package](https://packagist.org/packages/scoutapp/scout-apm-laravel). One small thing to be aware of is that this package requires the [sockets extension](https://www.php.net/manual/en/intro.sockets.php). In most production environments, this won't be an issue, but if you're running a minimal Docker environment like I do, it's something to be aware of.

If you really want all the performance data possible, you'll need to go one step further and install the [`scoutapm` PECL extension](https://github.com/scoutapp/scout-apm-php-ext). This wasn't difficult, and the documentation is very straightforward, but if you're nervous about tinkering with your production environment, you may decide to skip this step, at least when you are first trying Scout APM out. There's certainly a bunch of value to gain from Scout APM even if you're not quite ready to install this extension in production yet.

## Benefits

After installing Scout, wait a few minutes for production data to start being collected, and you'll be rewarded with some fancy graphs. You'll see all the stats you might expect from an APM product: response time, throughput, etc. But you'll also get some really cool tools for filtering that data: web traffic vs background jobs, or filtering down to specific routes in your appliction. Even after only an hour in production, I started to see some interesting trends and areas of concern. After several days of traffic had been collected, the picture came into even clearer focus and I gained new insights.

One thing I particularly like about Scout APM is the database analysis it provides. This is an extra feature you have to opt into, but I highly recommend it. For most web applications, database performance is very likely to be your primary issue, and having extra insight into this layer of your application is extremely valuable. Once enabled, Scout APM automatically monitors for [N+1](https://secure.phabricator.com/book/phabcontrib/article/n_plus_one/) database problems and surfaces them prominently in the user interface. I'm pretty diligent about not creating N+1 issues, but it still caught a couple I missed. I also found it really nice that Scout only alerted on N+1 issues that fell above a specific execution threshold. This way I wasn't being alerted to something that had no noticeable impact on user performance.

Often, when I get a shiny new tool, I use it a lot for the first few days, but then it begins to fade into the background. APM tools are no exception. Because of this, I also appreciated the automated email alerts and reports that Scout APM provides by default. I jealously guard my inbox, but I found the weekly performance report to be useful in giving me an easy way to monitor the trends without having to be in the tool every single day. There are lots of custom alerts you can setup as well, if you want to track specific things more closely.

## Support

No tool is perfect, and it's unrealistic to not expect some challenges when trying out something new. In my experience, problems can often provide another insight into whether or not I want to continue using a new tool: how well it is supported. It is here that Scout APM truly shines!

Like any responsible developer, after adding the new Scout APM package to my project, I ran my test suite to make sure nothing broke. Oops! I had a failing test! Digging deeper, I discovered that one of the Blade helpers introduced by the [spatie/laravel-permission](https://github.com/spatie/laravel-permission) package was no longer being parsed, but was being spit out as raw text into my generated HTML. Fortunately, I was able to easily workaround the issue, so I could continue my Scout APM trial, but I took the time to report the issue to Scout APM. To my surprise, within 2 days they had a new release that [fixed this issue](https://github.com/scoutapp/scout-apm-laravel/issues/45). Fantastic!

After a few days running in prod on my first project, I had enough confidence to roll out Scout APM on a second project. Shortly after doing so, I started getting very sporadic `OutOfMemoryException` warnings thrown by some background jobs. This was puzzling to me since the jobs finished successfully and were fairly efficient (running in less than one second consistently), not doing anything memory-intensive. This time, I had some back and forth discussion with Scout APM support in their Slack channel. Despite this being impossible for me to reproduce, I was pleasantly surprised that they promised to dig into it and figure it out. Once again, Scout APM delivered a [bug fix](https://github.com/scoutapp/scout-apm-php/issues/157) that solved my issue!

These are just two of the very positive experiences I had with Scout APM's support. I'd like to give a special shout-out to [James Titcumb](https://twitter.com/asgrim) and [Chris Schneider](https://twitter.com/watchchrislearn) for their excellent support in Slack, on Github, and via email.

## Conclusion

I wholeheartedly recommend that you give Scout APM's free 14-day trial a chance, even if you don't think you'll need it enough to pay for it later. It's truly eye-opening to see all the performance data it gathers and distills in a meaningful way.

Despite being a relative newcomer to the APM space for Laravel and PHP, Scout APM has an excellent set of features, a snappy and intuitive dashboard, and a nice balance of sane defaults with opportunities to customize further as needed. It quickly provided value out of the box, and continued to do so over the next 2 weeks.

My one nitpick is that I would very much like to see a free or extremely low-end tier aimed at hobbyists, side projects, and extremely small production apps. I strongly believe New Relic got to its position of dominance because of their free tier offering, and I'd like to see Scout APM succeed as well. I don't have any nitpicks with the rest of their pricing, however. APM is a complex offering and provides a ton of value. This is a tool that is definitely worth paying for and if your business is running important Laravel apps in production, $99/month is an extremely reasonable price.

