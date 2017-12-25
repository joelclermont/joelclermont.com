+++
title = "the importance of upgrading"
date = "2011-08-17"
slug = "2011/08/17/the-importance-of-upgrading"
Categories = []
+++
Most web sites use third-party code. This code comes in a few different flavors:

* client-side libraries (jQuery, dojo)
* server-side libraries (form mail scripts, oAuth integration)
* server-side frameworks (Zend Framework, Symfony)
* entire applications (WordPress, Joomla)

As a developer, when you selected one or more of these tools, you hopefully picked a project that was active and well supported. This means there will inevitably be upgrades to that third-party code. Some of these upgrades add features, but most upgrades also include bug fixes and security patches.
<!-- more -->
Blindly ignoring these updates is an (all too common) option that developers take once their site is launched and "done." This can get you into a lot of trouble with a client when one of those unpatched tools is used as an attack vector to compromise the site or server. Sticking your head in the sand is rarely the right decision.

But the other factor to consider is that upgrading these tools takes time. In addition, it's not uncommon for an upgrade to break your code. Maybe it's a purposeful break with backward compatibility or maybe it's an unintended consequence of how you integrated with that third-party code. This is one big reason why some developers ignore the upgrades, or at the very least, ignore them as long as possible.

If you are working on your own site on your own server, the issues are relatively clear. You can personally decide how much risk to accept for your site and server. You can decide how much time to invest in upgrades and testing. But things get murky when it's a client site. Is maintenance of these third party tools billable? What about breaking changes? What if the client doesn't want to pay, but the site is hosted on your server and you don't want the exposure of unpatched security risks?

How do you handle this? What are your clients' expectations? Leave me a comment. Unfortunately, I don't yet have a great answer to all these questions myself.
