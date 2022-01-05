---
title: "Case Sensitive Volumes on macOS"
cover: "/images/opinion.png"
tags: ["docker", "macos"]
date: 2022-01-04T16:49:21-06:00
---

I used to think Docker would solve all my issues with local dev matching the production environment, but I was wrong.

<!--more-->

When I made the jump to Docker for local development, it was based on the idea that now my local environment would exactly match my production environment. The same version of PHP, the same operating system, the same extensions, and so on. For the most part, this proved to be true. I encountered way fewer "works on my machine" issues after switching over to Docker. In fact, several years went by before I bumped into my first issue: filesystem case-sensitivity.

I wrongly assumed that filesystem case-sensitivity was a thing of the past with Docker. Sure, my host operating system is macOS, which by default uses a case-insensitive filesystem, but my code is actually running inside a Docker container on a Linux VM, which is case-sensitive. 

When you create a Docker image to ship to production, all the code is packaged inside of it, but this would be very inconvenient for local development. To minimize friction, it's common practice to have your application's source on the host OS, allowing to use all your normal dev tools (PHPStorm, for example) with a local folder, and then mount that folder as a volume inside the Docker container.

For example, my nginx container definition in `docker-compose.yml` would look like this:

```
  nginx:
    container_name: "some-app-name-nginx"
    build: docker/nginx
    working_dir: /app
    volumes:
      - .:/app:delegated # this mounts my project root location into /app inside the Docker container
      - ./storage/app/public:/app/public/storage
    ports:
      - "30883:443"
    depends_on:
      - php-fpm-debug
    restart: unless-stopped
```

What I failed to realize is that by using this volume, case-sensitivity issues would leak into my environment. It wasn't until I had a test passing locally and failing in CI that I realized the error of my ways. (Hooray for CI catching things like this before they go live in production!)

How to deal with this? I listened to my friend, Aaron, and followed his advice on [how to create a case-sensitive macOS volume](https://www.aaronsaray.com/2017/add-case-sensitive-disk-in-macos) to use for my application code. This strikes a nice balance between not changing my whole machine to being case-sensitive, which could break some poorly designed macOS apps, and still getting the quick developer feedback loop with a volume mounted in a Docker container.

> NOTE: His blog post worked perfectly for me, despite its age. The only deviation was that macOS defaults to AFPS volumes now, so instead of creating a new partition, I just created a new APFS case-sensitive volume inside the existing AFPS container.

Hopefully now I can go another few years before bumping into my next environmental mismatch issue!