---
title: "Git goodies: see all unpushed files"
date: "2012-08-25"
slug: "2012/08/25/git-goodies-see-all-unpushed-files"
tags: [programming, git]
---
My preferred workflow is to be able to push changes into production using git. However, sometimes the project/server doesn't support this (yet).

In these scenarios, it is very useful to be able to see which files have not yet been pushed to origin. Here is a nice one-liner that does exactly this:
<!--more-->
``` bash
git log origin/master..master --name-only --pretty="format:" | sort | uniq
```

This assumes that you are working in master and that you don't push to origin until you deploy to production. Adjust as needed.

If you find yourself using this a lot, you can create an alias for it so that you can simply type: git unpushed to run this command. Edit your ~/.gitconfig file and add this under the [alias] block if you like this idea:

``` bash
unpushed = !sh -c 'git log origin/master..master --name-only --pretty="format:" | sort | uniq | grep -v "^$"'
```

This file list could even be the input to another script which deploys the changed files to the production server. Enjoy!
