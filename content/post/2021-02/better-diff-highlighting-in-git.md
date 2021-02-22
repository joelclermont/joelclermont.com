---
title: "Better Diff Highlighting in Git"
cover: "/images/tools.png"
tags: ["git"]
date: 2021-02-22T15:45:51-06:00
---

I prefer to use Git from the command line, but sometimes a GUI tool does a better job with specific tasks. One of those is diff highlighting, but today I found a way to make diffing with the Git CLI a lot nicer. Let's look at an example.

<!--more-->

I was refactoring a Laravel routes file to eliminate the unnecessarily-broad `any` routes and replace them with more specific `get` or `post` routes. (I still need to refactor them to resourceful controllers, but that's a bigger job for another day.) 

Here's what a typical `git diff` looks like in this file:

![Default diff highlighting in git cli](/images/better-diff-highlighting-in-git/01-default-diff-highlighting.png)

Not terribly hard to read, but there's a little bit of noise trying to focus in on what specifically changed in this line. I only intended to change `any` to `get`, but what if I accidentally added or removed some other character toward the end of the line? It's really hard to notice, especially on longer route definitions that wrap to a second line.

I wondered: Could I get nicer per-word or per-character diff highlighting, like I'm used to in GUI tools or GitHub?

My first discovery was using an additional parameter, `git diff --color-words`:

![Diff highlighting when using --color-words in git cli](/images/better-diff-highlighting-in-git/02-color-words-parameter.png)

This is much better! Now I can see exactly what parts of the line changed, and if I accidentally introduced an unwanted change later in the line, it would be highlighted and easier to spot. There are two small annoyances though:

1. I'd need to create a new alias or remember to type this parameter each time.
2. This parameter doesn't work with interactive tools like `git add -i` or `git add -p` which I use quite heavily in my workflow.

Digging deeper, I discovered something even better: Git has a built in tool called `diff-highlight` which does even nicer contextual highlighting, and you can make it the default tool so no alias or extra parameters are needed. Here's how the output looks:

![Fancier diff highlighting in git cli](/images/better-diff-highlighting-in-git/03-fancier-diff-highlight.png)

I like this even better since it is more contextual (it only shows the exact characters that changed) and it's the nicer top/bottom compare instead of inline. And as a bonus, this works with interactive commands as well.

Here's how to set it up in your git config globally for all repos:

```bash
$ git config --global pager.log 'diff-highlight | less'
$ git config --global pager.show 'diff-highlight | less'
$ git config --global pager.diff 'diff-highlight | less'
$ git config --global interactive.diffFilter diff-highlight
```
One additional note: If you installed `git` via Brew, you probably don't have `diff-highlight` in your path, so you may get an error saying `diff-highlight` could not be found. Run `brew info git` to find the path to your git installation, then use that full path for `diff-highlight`. For example:

```bash
$ git config --global pager.diff '/usr/local/Cellar/git/2.26.2/share/git-core/contrib/diff-highlight/diff-highlight | less'
```