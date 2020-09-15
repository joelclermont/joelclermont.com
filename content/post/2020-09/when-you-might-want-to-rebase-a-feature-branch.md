---
title: "When You Might Want to Rebase a Feature Branch"
tags: ["git", "opinion"]
date: 2020-09-14T19:09:36-05:00
---

Is `git rebase` a command to be avoided at all cost? I say no. Here's one use case where I reach for `rebase` instead of `merge`.

<!--more-->

I prefer feature branches to be short-lived. This prevents them from getting too far out of date from what the rest of the team is working on. Despite the best of intentions, and sometimes for reasons beyond my control, a feature branch lives on for days, or even weeks, before getting merged in.

Either in preparation for code review and merge, or just to make sure I'm not drifing too far from what everyone else is working on, I want to bring in the upstream changes. Here you have a choice: you could simply merge the original branch back into your feature branch, or you could rebase your feature branch on the updated original branch.

Most of the time, I prefer a merge. It doesn't mess with the commit history (rebase not only changes the order of commits, but will freshen the timestamp of your replayed commits by default). And since a rebase will also require a "force push", it also avoids unpleasant issues if someone else happens to be working in your feature branch with you. (I'd argue they shouldn't, but that's a different blog post.)

But let's say in your feature branch you installed a new package, so your `composer.json` and `composer.lock` files are updated. (For example's sake, this is PHP, but the same principle applies in many other language ecosystems.) Back in the original branch, your teammate has also installed or updated a package, so `composer.json` and `composer.lock` have a conflicting set of changes between our branches.

It's not too hard to manually resolve the merge conflicts in `composer.json`, but you have no chance of doing that with `composer.lock`, because of how your package set is hashed. Here I think rebase helps a lot. Rebase basically is the same as if I create a new feature branch from the current state of the parent branch and then one-by-one replay all the existing commits from my feature branch on top of it. When it replays the commits and gets to the commit where I installed the package, I'm still going to have a merge conflict, but now I can accept the upstream composer files as "truth", reinstall my packages, and then commit the merge conflict. Problem solved!

It's true you could do a reverse of this with merge by calling your composer files "truth" and then reinstalling the composer packages from the parent branch, but I find this to be more confusing when looking at history. I'm sure this is still a matter of taste, and either approach can work, but it has served me well.
