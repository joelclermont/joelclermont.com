---
title: "Things to Know When Updating a Single Composer Package"
tags: ["Composer"]
date: 2020-01-09T10:58:50-06:00
---

There are times you may want to update a single Composer package without updating everything in your project all at once. I've put together a few tips to keep in mind when using this workflow.

<!--more-->

Recently, I've been testing the newly-released [ScoutAPM](https://scoutapm.com) support for Laravel. (Updated: [Scout APM review for Laravel]({{< ref "scout-apm-review-for-laravel.md" >}})) I ran into an [issue with Blade directives from third-party packages](https://github.com/scoutapp/scout-apm-laravel/issues/45). Two days later, they published a new version which fixed the bug, hooray!

In order to test this, I needed to upgrade the `scoutapm/scout-apm-laravel` package from version 1.2.1 to version 1.2.3. Since this is a patch release, it should be pretty straightforward to update this one package: `composer update scoutapm/scout-apm-laravel`, right? Let's try it using the handy `--dry-run` option:

(Note: my project runs in Docker, so I'm calling `bin/dev/composer` which is just a thin wrapper to run composer from inside the container)
![First attempt to update the package](/images/things-to-know-when-updating-a-single-composer-package/01-first-attempt-to-update.png)

That's no good. It's saying there's nothing to update, but I know there's an update available because it shows one when I run `composer outdated`:

![Composer outdated output shows updates](/images/things-to-know-when-updating-a-single-composer-package/02-composer-outdated.png)

Yep, there's definitely an update available, but it's that second line which gives us a hint why Composer is choosing to not update our single package. One of our package's dependencies has bumped to a new major version, and our [current pacakge](https://packagist.org/packages/scoutapp/scout-apm-laravel#v1.2.1) has the dependency for `scoutapp/scout-apm-php` pegged to `^3.1`. Composer is dutifully following our instructions and refusing a major version update for this dependency.

One option would be to run `composer update scoutapp/scout-apm-laravel --with-dependencies` which is our way of telling Composer it's okay for those dependencies to be updated as well:

![Second attempt with dependencies](/images/things-to-know-when-updating-a-single-composer-package/03-with-dependencies.png)

It's interesting to note that Composer is still unwilling to update a dependency if it's also specified in our composer.json file. That's what it means when it says it's ignoring a "root requirement." The good news is our dry run now shows it is updating our single package. This is great! But, I'm still a little cautious and I'd rather not update those other packages if I don't have to. Let's see if we can be more specific:

![Third attempt with single explicit dependency](/images/things-to-know-when-updating-a-single-composer-package/04-explicit-dependency.png)

And this is exactly what I want. We have a winner! 

One final side note: the order of these packages is important. If I reversed them and listed `scout-apm-laravel` first, it still wouldn't update anything.