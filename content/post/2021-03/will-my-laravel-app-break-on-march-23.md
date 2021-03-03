---
title: "Will My Laravel App Break on March 23?"
cover: "/images/opinion.png"
tags: ["laravel", "aws"]
date: 2021-03-03T08:36:45-06:00
---

Maybe you've received a notice from Amazon that certificates are changing on your S3 bucket on March 23, 2021. Several people have asked me: Will my Laravel app break on March 23?

<!--more-->

Before I answer the question directly, first let's explain what exactly is changing. Currently, when you communicate with an S3 bucket over TLS, the certificate is provided by Amazon, but the root certificate authority (CA) is Digicert. Amazon has been going through the process of becoming their own CA for several years. On March 23, those S3 certificates will change from having the Digicert CA to Amazon's new CA, called Amazon Trust Services.

Why does this matter? Well when a TLS connection is made, the browser making the request verifies that the certificate a server provides is valid and trusted. Validity is based on things like the date, the name, and so on. But trust is anchored in a list of trusted root certificate authorities. If your browser doesn't trust the root CA used to sign the server's certificate, the TLS connection will not be verified and the request will fail. So introducing a new root CA is a big deal since it involves coordinate with all the different browser, operating system, and other tool vendors to get your new root CA in their trusted list. In addition, it requires users to keep their browser, operating system, and tools up to date in order to receive those trusted CA list updates.

Armed with this knowledge, let's look specifically at Laravel apps and the upcoming S3 root CA change. The vast majority of Laravel apps I've seen have two basic use cases for S3:

1. Users are served assets directly from an S3 bucket and view them in their browser.
2. Application code running on the server manages content in an S3 bucket.

Let's take each case and explain the potential impact.

### Users viewing S3 assets in their browser

When a user is navigating your application in their browser, the content may include assets (images, videos, etc) served from an S3 bucket. Their browser will directly fetch that request from the S3 bucket URL, so their browser will be the thing verifiying the certificate provided by Amazon.

All modern browsers and operating systems have the new Amazon Trust Services CA in their trusted list. But what if your user is on Windows 8 running an old version of IE? Will that break? Probably not, here's why: Amazon hedged their migration by purchasing a much older and established certificate authority called Starfield Technologies. This CA has existed in browsers going back as far as 2005. Even old operating systems like Windows Vista (remember that?) and Mac OS X 10.4 (way before the macOS rebranding) contain this CA. After March 23, Amazon will cross-sign their S3 certificates using BOTH their new Amazon Trust Services CA and their acquired Starfield Technologies CA. This cross-signing process gives multiple certificate verification paths that even very old devices should trust.

### Application code on the server

Laravel doesn't include the AWS SDK package by default, but if you use S3 as your filesystem driver, you'll install it yourself. Or other third party packages may pull it in as a dependency. Check your `composer.lock` and if you see `aws/aws-sdk-php` listed as a dependency, your app has the SDK installed. 

This SDK also communicates with S3 over a secure TLS connection, which means it also checks the validity and trust of the S3 certificate. Unless you've specifically configured it otherwise, the SDK will use the same CA bundle that PHP is configured to use. Ubuntu 8 (yes 8, not 18) contains the Starfield CA, so for all the reasons listed above, your server will probably be fine unless it's been sitting in a closet for over 15 years.

Just to be clear, there are other less-common scenarios which may cause an issue with this migration. For example, there's a thing called "certificate pinning" where you explicitly tell a tool to always expect a specific certificate property, like the CA. This is not typical, and you would have to go out of your way to do this, but it would break on Mar 23. Or perhaps you compiled PHP with a custom CA trust store for some reason. That too would require additional verification before Mar 23. These are both very unlikely scenarios for a typical Laravel app.

Do you still have a nagging doubt that maybe something will still break on Mar 23 and you just can't sleep until you know for sure? Amazon has provided ways for you to test your app in advance. 

1. For the user scenario, check this [Amazon provided image](https://s3-ats-migration-test.s3.eu-west-3.amazonaws.com/test.jpg). If it opens in your browser, congrats! that brower will work with migrated S3 certificates after Mar 23.
2. For the app scenario, create a test bucket in one of the regions that has already been migrated to the new CA. For example, `eu-west-3` or `eu-north-1`. You could setup your app to upload content to that bucket from your production environment, and if it works, then you know your real buckets will also work after Mar 23.