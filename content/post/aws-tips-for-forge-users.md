---
title: "AWS Tips for Forge Users"
date: 2019-06-09T19:40:59-05:00
tags: [AWS, Forge, hosting]
---
Are you comfortable with Forge and a VPS like Digital Ocean, but considering a move to AWS? While a lot is the same, there are some nuances to making the move. I'll walk you through some common questions and share some tips on how to make the most of the new hosting environment. 

<!--more-->
Let's start by walking through the questions Forge will ask you when creating a new server on AWS.

### Region
Just looking at the names, it's pretty easy to figure out that "Region" refers to a geographical location. Generally speaking, it's best to pick a region closest to the majority of your users, but you may have other reasons to pick a different region (compliance, data governance, etc). However, be aware that there can be differences betwen regions related to cost, available services, and more. If you want to dig into the details, checkout this <a href="https://www.concurrencylabs.com/blog/choose-your-aws-region-wisely/" target="_blank">great analysis of the differences between AWS regions</a>. Personally, my default choice is Virgina.

AWS defines multiple "availability zones" (AZs) within a region. If you're designing a fault-tolerant application, having resources spread across more than one AZ is an important consideration. Currently, Forge does not ask you which AZ to create the instance within, but there's a handy way to still control this. More on that later, under the VPC section below.

### Server Size
The biggest difference you'll notice is number of CPUs and amount of memory, but also pay attention to the different instance types: t2, t3, m5, and c5. These are the 4 instance types in Forge as of the writing of this post, but this may change in the future, and Amazon is adding new ones regularly. The EC2 documentation has a <a href="https://aws.amazon.com/ec2/instance-types/" target="_blank">page which explains the differences between each instance type</a>. (EC2 stands for Elastic Cloud Computing, and it's the service we're using when Forge spins up servers.)

Unless you know you have specific performance requirements, I'd recommend starting small, load testing, and increasing the instance size as needed. AWS makes resizing the instance type incredibly easy.

Once you get comfortable the size is right, take advantage of <a href="https://aws.amazon.com/ec2/pricing/reserved-instances/" target="_blank">reserved instances</a>. If you know you're going to keep this server up for a while, Amazon will give you a pretty substantial price break by committing to at least a year. Per-hour billing is really cool when you need it, but per-year billing is much cheaper (up to 75% cheaper, in fact!). Purchasing a reserved instance happens within AWS and Forge is completely unaware of it, but don't overlook this important option if you can use it.

### VPC / Subnet
This is probably the most confusing concept when you first come to AWS from DigitalOcean. A virtual private cloud (VPC) is basically just the network layer for servers. You can use it to group servers together, isolate services from the internet, and apply network level access control rules. 

AWS provides a default VPC, and Forge makes it really simple to add a new VPC when creating an instance, but unless you're only going to spin up a single server in your AWS account, I don't really recommend using either. Instead, first go to AWS and create a VPC, giving it a meaningful name (by client, team, app, or whatever level of isolation makes sense to you). There are a lot of concepts contained within a VPC (subnets, gateways, routing tables, and so on), so I'd recommend just using the "Launch VPC Wizard" to let it handle this for you.

There's another reason to setup the VPC first, which I alluded to earlier: It's a way to control which availability zone your new server will be created in. While a VPC spans the whole region, each subnet can live within only a single availability zone. So if you create the VPC in advance, and setup the subnets in the availability zones you want to target, you can then control AZ in Forge, using the subnet selector as a proxy. Pretty cool!

This is a deep topic, and probably worthy of a whole series of articles, but one final point on VPCs. They allow you to associate "Elastic IPs" with your instances. Normally, the IP assigned by AWS when you start the server only lives for the length of the server. If you stop it (to resize, for example), you will get a new IP address. Elastic IPs live within the VPC, so they remain if you need to start and stop an instance, and they can also be moved from one instance to another (like when you're going to do a major OS upgrade).

### Database
Forge makes it really easy to provision a database on your web server, but you're still on your own for managing backups, tuning performance, monitoring and so on. Amazon offers a manage database service called RDS, and it supports both MySQL and Postgres (among others). An RDS instance costs marginally more than the corresponding EC2 instance, but it gives you quite a bit for this slight premium. The biggest feature for me is point-in-time recovery. You can definitely set this up on your own, but it's non-trivial. RDS gives it to you out of the box. And if you want higher availability for your data layer at some point, you can check a couple boxes and get multi-AZ replication. Unless you're extremely strapped for cash, I highly recommend using RDS.

Note: If you're going to use RDS, make sure to select "None" as your database type in Forge. No sense provisioning a service you aren't going to use.

### Load Balancer
There are two main reasons for using a load balancer: performance and reliability. On AWS, reliability is greatly strengthened by spanning availability zones. If you use the Forge created load balancer, it can only route traffic within a single AZ, so I would recommend looking into Elastic Load Balancer instead.

### One Final Tip
Forge does a great job covering the most common scenarios when provisioning AWS instances, but if there's something you really need that Forge doesn't provide, or if you just want to manage the instances some other way (Terraform, CloudFormation, etc), then just create it as a "Custom" server type in Forge. This way you can spin up all the instances however you want, then let Forge take over and setup the application stack within them. Note: you must make sure these instances have a fresh install of Ubuntu 18.04 x64 and have a root user.

I plan on writing more about Forge and AWS, but in the meantime, if you have any questions, feel free to [contact me on Twitter](https://twitter.com/jclermont) or using [my email form](/contact).