---
title: "Using Logs to Debug a Laravel API"
cover: "/images/laravel-tip.png"
tags: ["laravel", "apis", "logging", "debugging"]
date: 2022-05-10T15:55:45-05:00
---

On a recent project, we were building a Laravel API to be consumed by a mobile app being built by a separate team. When an end user reported an issue, one of the first questions was "Is this bug in the API or the mobile app?" In this post, I'll share a logging strategy we used to help us quickly get to the root cause of the problem.

<!--more-->

Our ideal scenario was to log every request into the API along with the response that was returned. Any time you want to do something to every request, the logical place to put that code is a middleware. In this case, we chose to use a terminable middleware so as to capture the final response. As a bonus, the terminable middleware runs after the response is returned to the user, so it doesn't slow down their response time at all.

Inside the `terminate` method of our middleware, we could craft the exact log payload we want to capture:

```php
<?php
$context = [
    'request' => [
        'full_url' => $request->fullUrl(),
        'method' => $request->method(),
        'body' => $this->redactedRequestBody($request),
        'user_id' => $request->user()->id ?? 0,
    ],
    'response' => [
        'status_code' => $response->status(),
        'body' => $response->getContent(),
        'headers' => $response->headers->all(),
    ],
];
```

One important detail here is that we're also redacting sensitive data. For example, an API request contains their Bearer token. We don't want these tokens sitting in our logs. Similarly, you can redact password fields, or anything else deemed too sensitive for a plain text log. It's also useful to log this data to its own log channel, so it doesn't get intermingled with other application logs you are alread capturing. It's nice to have one dedicated set of logs to scan just for API requests and responses.

Maybe you're wondering: Why not just using something like New Relic or Bugsnag to help debug failed responses? We actually are using both of those tools on this project. They're great and extremely useful, but sometimes a request didn't fail or throw an exception, and it's still useful to see it in an audit log. For example, maybe a request failed validation. Bugsnag isn't going to collect data on a 422 response. You could set it up to do that, but it's not really the intention of that tool, and would end up creating noise that might drown out a legitimate unhandled exception.

One final piece of the setup was [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html). Our infrastucture is on AWS, but you could still ship logs to AWS (or other similar log providers) if you like. Setting up the Cloudwatch Logs agent to grab these API logs was fairly straightforward, and now we can run some really powerful queries in the CloudWatch console in AWS. Because the data is structured as JSON, we can now [quickly query based on any piece of data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html#metric-filters-extract-json):

* Find all the requests for User ID 123 in the last 6 hours
* List every non-2xx response
* Show all requests from outside the US (Cloudflare tacks on a nice `CF-IPCountry` header to make this simple)

Even better, you can save some of these queries as CloudWatch metrics, and then chart things over time, or set up automatic alerts.

I'm really happy with this approach, and it has greatly decreased the time required to research and resolve a user-reported issue.