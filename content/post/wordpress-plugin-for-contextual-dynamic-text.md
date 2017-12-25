---
title: "WordPress plugin for contextual dynamic text"
date: "2011-07-16"
slug: "2011/07/16/wordpress-plugin-for-contextual-dynamic-text"
tags: [PHP]
---
WordPress has a concept called [shortcodes](http://codex.wordpress.org/Shortcode_API). They're very handy for inserting chunks of text or functionality with a simple text syntax. For example, one of the stock shortcodes allows you to type ```[gallery]``` in a post where you want a photo gallery to appear. But the real power is exposed when you start building your own shortcodes.
<!-- more -->
A while ago, Scott, our [Internet Marketing director](http://www.orionweb.net/author/scottorionweb-net/), asked me to whip up some code that would allow him to display a different phone number on a page based on how the visitor got to the site. If they came through Google AdWords, we would target their specific city and provide them a local number, but this also allowed us to track AdWords clickthroughs all the way to actual phone calls. Even better, when someone entered the site with this contextual data, we stored it in a cookie, so that if they visited the site in the future, we could continue to provide the most relevant phone number.

Fast forward a few months and Scott now asks for this same functionality, but as a WordPress plugin. I looked around and found a few existing plugins that handled dynamic short codes and some even worked with similar logic on the query string and cookie, but none were a great fit. The one that looked most promising had been abandoned and didn't work with any recent versions of WordPress, so I decided to start working on one myself. A couple hours later, version 0.1 of my [Dynamic Text plugin for WordPress](https://github.com/joelclermont/wp-dynamic-text) is up on Github and at least as functional as my original non-WordPress code.

Feel free to try it out yourself and share any feedback or suggestions you might have. Once I get through enough of my feature list, I'll publish it on the WordPress plugin directory as well.
