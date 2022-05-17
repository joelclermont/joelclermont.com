---
title: "Choosing a Status Code for an Expired Record"
tags: ["laravel", "http", "apis"]
date: 2022-05-17T09:58:58-05:00
cover: /images/opinion.png
---

In a previous post, I discussed some thoughts around [choosing the right HTTP status code](/post/2020-09/choosing-the-right-http-status-code/). In today's post, I'll tackle a different scenario, and my reasoning behind the particular status code I ended up using.

<!--more-->

First, let's set up the specific problem. The feature being built is a job board. Users can post available jobs they'd like to do, and other users can hire them. Each job listing is only valid a specific number of days, and then becomes unavailable for viewing. What should happen if I try to view someone else's expired job listing?

On first consideration, a `403 Forbidden` seems like a reasonable option. A user tried to view something that cannot be viewed, therefore the request is forbidden. This is also a piece of logic that could fit nicely inside the `authorize` method of a `FormRequest` object, and that method will return a 403.

Then I considered what the user experience would be. Getting a generic 403 response in my browser is going to be very confusing for a user. Normally, if the user got there by doing something unexpected (like messing with a URL), I wouldn't care if the user sees a generic error like this. In this situation, however, there are valid use cases where a user could encounter this error. Let's say they were looking at a job yesterday, bookmarked it, then came back to that bookmark tomorrow to contact the job poster. In between that time, the job expired. That's not the user's fault, so it felt a bit heavy-handed to just dump them at a 403 error they can do nothing about.

I also briefly considered a `404 Not Found` error, but this has many of the same problems as the 403. While a 404 might be slightly more familiar to the average user, we aren't giving them any explanation why this job they were viewing yesterday is suddenly not found today. It still felt like a sub-par user experience.

Ultimately, I decided on a `302 Found` redirect. This approach solves the issue of dumping them on a generic error they can't do anything about. It gracefully takes them back to a usable portion of the application. On top of that, I included a banner message on the redirect page explaining exactly what happened: "That job is no longer available." True, I don't tell them specifically that it expired. That feels like too much information. It's an internal business rule that the end user shouldn't have to think about. This message takes the burden off them, though. It's like saying: "Hey, you didn't do anything wrong. That job bookmark is fine, it's just not available anymore." This feels a lot friendlier to me.

Why a 302 and not a 301? Well, the person who posted the job could choose to renew that listing, so it could come back and that bookmark would function once again. Sometimes, I'll make a different "302 vs 301" decision for public-facing pages, since it can impact search engines, but in this case, everything was behind a login.

To summarize my thought process: Don't just reach for a convenient status code without considering the user experience. While a generic error message is fine for a user that's poking around your app by messing with URLs and form payloads, it's best to avoid the poor user experience when the user is taking an expected flow through the application.