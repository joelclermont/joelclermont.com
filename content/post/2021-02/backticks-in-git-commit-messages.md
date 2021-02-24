---
title: "Backticks in Git Commit Messages"
cover: "/images/tools.png"
tags: ["git", "cli"]
date: 2021-02-24T09:27:28-06:00
---

Recently I wanted to have backticks in my `git` commit message. It didn't work as expected though.

<!--more-->

I frequently use backticks in Markdown to indicate a command to be typed or the fact that text is code instead of normal English. For example, if you're discussing conditional logic you will likely use the programming keyword `if`. Surrounding the latter code usage in backticks makes it stand out from English usage of the word in a sentence.

It was for this same reason, I wanted to surround the word `any` in backticks in a command message. I was referring to Laravel's `any` route helper, not the English word.

```zsh
> git commit -m "refactor and remove all usage of `any` routes"
zsh: command not found: any
```

Not only did I get that error from the command, running `git log` also showed a problem:
```zsh
refactor and remove all usage of  routes
```

The word `any` was completely removed. What happened? In `bash`, `zsh`, and lots of other shells, the backtick is a way of triggering [Command Substitution](http://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html). So anything inside the backticks is evaluated as if it was a separate command I typed, and then the result is substituted in my original command. In this case, there is no `any` command, so it was just replaced with an empty string, and that also explains the error: `command not found: any`.

Fixing it is relatively straightforward, and just requires escaping the backticks with a backslash:
```zsh
> git commit -m "refactor and remove all usage of \`any\` routes"
```

Or, I could simply type `git commit` and let my editor launch to type in the commit message without any shell command substituion. Either way, the problem is solved.

> Note: `git` and GitHub will not apply Markdown formatting to commit messages, so you'll see the literal backticks surrounding the word in the commit message. I still think it's a useful and familiar way to express the meaning of the word though.