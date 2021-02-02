---
title: "Repeat Last Argument at Command Line"
tags: ["cli", "zsh"]
date: 2020-09-13T12:04:02-05:00
cover: /images/tools.png
---

Here's a handy tip when you want to rename a file with a long path/name and don't want to retype it twice.

<!--more-->

I use Hugo for this blog and each new post starts with this command: `hugo new post/post-name` which then generates a file at `content/post/yyyy-mm/post-name`.

But I like using Markdown, so that command should really be `hugo new post/post-name.md`. When I inevitably forget and recognize this after running the command, I then need to rename this file to include the `.md` extension. 

```zsh
# broken onto two lines just to make it more readable
mv content/post/2020-09/some-long-article-name-with-lots-of-seo-goodness \
   content/post/2020-09/some-long-article-name-with-lots-of-seo-goodness.md
```

It's a little tedious to retype that long path/file. Here are two suggested approaches:

The first technique is called [brace expansion](https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html). It lets you generate multiple strings by putting a comma separated list of values within braces.

In my example, if I want to rename the file to include the `.md` extension, I can do this:
```zsh
mv content/post/2020-09/some-long-article-name-with-lots-of-seo-goodness{,.md}
```

You can have multiple brace patterns within your string, and you can do more than just two values. I recommend checking the docs for more examples.

The second technique lets you auto-complete a value in the middle of your command.

After I've typed `mv content/post/2020-09/some-long-article-name-with-lots-of-seo-goodness `, instead of re-typing the whole file path as a second argument, I can type `!#$` and then press `Tab` and it auto-completes the first argument a second time. Now I can append `.md` and hit `Enter`.

What is going on here? We're combining two different concepts. `!#` is called an
[event designator](https://www.gnu.org/software/bash/manual/html_node/Event-Designators.html) and it let's you refer to your command history. You could use this to refer to a command you typed 5 commands ago, but `!#` refers to the currently command being typed right now.

Next, the `$` is called a [word designator](https://www.gnu.org/software/bash/manual/html_node/Word-Designators.html#Word-Designators). Just like events, you can refer to a variety of different word histories. `$` means "the last word".

Putting those two things together, `!#$` means "the last word of the current command", which in our case is that long file path we don't want to retype. Pressing `Tab` then performs the substitution.

There are a lot more uses for this type of behavior. Again, I recommend checking the docs. The [history expansion](https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html#History-Interaction) topic covers this and more.

> Note: even though I'm linking to the Bash docs, this works in `zsh` as well, which is my shell of choice.
