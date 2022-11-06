---
title: "Learning Bref - Day 1"
author: "Author Name"
cover: "/images/opinion.png"
tags: ["php", "bref"]
date: 2022-11-06T10:27:21-06:00
---

I've been putting off learning how to deploy a PHP/Laravel app to a "serverless" environment for quite a while. A recent talk by [Carl Alexander](https://carlalexander.ca) at Longhorn PHP finally gave me the push to try it out. This is the first in a series of posts documenting my experience as a longtime PHP developer checking out this topic in-depth for the first time.

<!--more-->

### Motivations

For context, I want to explain why I'm even exploring this. Many people look into serverless as a way to handle spiky traffic patterns easier, or to potentially cut hosting costs, but that's not my motivation at all. I currently use Laravel Forge to provision EC2 virtual machines in AWS. It works great, and I don't have any major complaints. But there's a disconnect between the Docker environments I use locally for development and in the CI pipeline versus what's actually on the production server. I keep the version numbers of PHP, Composer, MySQL, etc in sync, but it's still not quite the same. While investigating the 50+ ways you can deploy a Docker container to AWS, I wondered if maybe I should just consider serverless. Could this solve the same problem, albeit in a slightly different way?

One obvious choice when deploying a Laravel app to a serverless environment is [Laravel Vapor](https://vapor.laravel.com). For now, I'm instead looking at [Bref](https://bref.sh) though. It's not because Vapor costs money, or that I have any specific concerns with the product, it's more just that I want to understand what's happening a little more closely. Later, once I understand this, I may very well explore Vapor, but for now, I want to be able to peek under the covers in the Bref source code, to make sure I fully understand what is happening.

### Documentation

With that preamble out of the way, onto my Bref exploration! As with any new tech, I start by visiting the project home page. The high-level overview of Bref presented there helped right away to get a sense for the goals and scope of the project. Next, onto [the docs](https://bref.sh/docs/). I like to read through the docs, start to finish, working through any examples or tutorials presented.

I quickly learned that Bref leverages the existing [Serverless framework](https://www.serverless.com). (Side note: the Bref project lead used to work on the Serverless framework. This already gives me some confidence in Bref, knowing it's built on top of something battle-tested and the developer has deep knowledge of it.) Throughout the docs, I found many helpful links to the Serverless docs where more information might be useful.

One thing I didn't see explained is what sort of version constraints to maintain between Bref and Serverless. Bref is a locally-installed PHP package in my project, and Serverless is a globally-installed Node package. I have to assume that some version of Bref requires some corresponding minimum version of Serverless, but I didn't see this spelled out. It doesn't matter too much right now, since I'm starting fresh and installing the current versions of both tools, but this is an open question I want to resolve before I'd rely on this in production.

### Some small obstacles

When walking through the guide to install a simple PHP application, I hit a small obstacle when trying to use a named AWS profile for deployment. By digging into the Serverless docs, I was able to find out what value to include in my `serverless.yml` file, so it wasn't a major diversion. And the Bref docs did call out a note about existing `aws` cli users, but I still did struggle a few minutes trying to figure out how to proceed.

A slightly bigger obstacle came with IAM permissions for my bref cli user. As a practice, I like to minimize the permissions needed for any API key. Helpfully, the bref docs made mention of this, and pointed me to the Serverless framework docs. There I found a gist they published which gave you a supposed set of minimum permissions needed, but when I tried it, I got a permissions error on deploy. I added the missing permission, and tried deploying again, but got a different error. To avoid getting side-tracked, I temporarily granted this IAM user full `AdministratorAccess` permissions, but I made a note to figure this out later.

> I asked about this situation on the bref Slack, and found out that this is not a straightforward thing to do, since permissions can vary based on what services your application uses. I did get some helpful tips (within 15 minutes on a Sunday morning, another confidence boost!), which I will try out later.

### Digging a little deeper

I really enjoyed the information about PHP layers. This is a new concept for me with AWS Lambda, and understanding how Bref uses layers was very useful information. At the beginning of this doc section, it only mentioned `php-80` and `php-74` layers, which surprised me a little, since 7.4 is out of support and 8.0 is heading there this month. But just a little bit further down the page, I saw a full list of layers, and even saw a layer for the beta version of PHP 8.2. This gave me another boost of confidence, that new PHP versions are quickly supported, but old ones aren't quickly retired. It's a nice balance to see in a project. There's also a small lesson here on learning: don't get too distracted with questions while you're totally new to something. Make a note of a question so you can come back to it, but keep reading. In this case, the answer was lower on the same page, so I'm glad I didn't burn a lot of time going off on a tangent.

There was one note that surprised me a little: You cannot target a specific patch version of PHP. I can only target PHP 8.1, but I can't specifically target 8.1.11. This might not seem like a big deal, but in practice I have bumped into unexpected behavior even among patch versions of PHP. And I currently pin my Docker environment to what's in prod, so giving this up feels like a step back. I need to revisit this later, but I did explore a little bit how the layers are built, and I can trace a specific Bref layer version to a specific patch PHP version, but it's not clear to me how to effectively manage this. Am I forced to fully specify the layer ARN in order to get this control, or is there a better way? On a positive note, I discovered that Bref layers are built with Dockerfiles. This gave me hope that I could get local dev parity with by maybe using that Dockerfile for local dev, even without the Lambda environment. But that's something to figure out later. I'm not even through the first pass of the docs yet!

As I read through the docs, I also appreciated how they regularly call out things that might trip you up later. For example, you can't stream binary responses by default (think of a PDF dynamically generated by your PHP app). There are also hard limits imposted by AWS on file upload and download sizes. Another thing mentioned was the notion of "cold starts" and how to mitigate it. I didn't really need to know all this yet, but having it stored away in the back of my brain will probably save me some grief as I get further in my exploration.

### Summary of Day 1

My initial impressions of Bref are that it's a mature project, backed by an active and supportive community on Slack, with thoughtful documentation. I experienced a quick win of deploying a simple PHP application to AWS Lambda, and I felt like I had a pretty good high-level understanding of how the deployment process works. I still have a lot to learn, but Bref doesn't feel like a black box. I have explored the source code, I can dig deeper into the Serverless framework (also open source), and I can see everything in the AWS console since the deployment is done via CloudFormation.

I'll post follow-up articles on my further experience, and as I figure out the answer to the open questions noted above. All posts will be tagged as [`bref`](/tags/bref), if you want to follow along.

Hopefully others will find this useful, and maybe it might push you off the fence to give Bref a try yourself.
