---
title: "Better PHP highlighting in Octopress"
date: "2013-03-28"
slug: "2013/03/28/better-php-highlighting-in-octopress"
tags: [Octopress]
---
I recently moved my blog from WordPress to [Octopress](http://octopress.org). The experience was painless and I wish I would have done it much earlier. One thing that puzzled me was how Octopress handled PHP syntax highlighting. It seemed that it would only work if every code block started with the opening `<?php` tag. I found this quite annoying, especially when I only want to show one line of code.

<!--more-->
But Octopress is open source, so I decided to fix it. The first thing to understand is that Octopress is really just a framework that sits on top of the static site generator [Jekyll](http://jekyllrb.com). In addition, Jekyll leverages many existing tools and Ruby gems to do its work. Digging through these layers, I discovered that the [Pygments](http://pygments.org) library was responsible for syntax highlighting within code blocks.

In the Pygments documentation, they list all the different language lexers they support. This was interesting to me for two reasons. First, it shows the "short code" to use in your code block to trigger a certain type of language. Some are obvious, like PHP (short code php), but others were not quite so easy to guess. Second, some lexers accept options that affect their behavior. The PhpLexer accepts a `startinline` option which tells Pygments whether or not to require the `<?php` tag to begin syntax highlighting. For reasons unknown to me, the default is `false`.

Next, I had to figure out where to pass this option from Octopress to Pygments. It turned out to be much easier than I expected. I opened the `plugins/pygments_code.rb` and made the following change:

``` ruby
# original code
highlighted_code = Pygments.highlight(code, :lexer => lang, :formatter => 'html', :options => {:encoding => 'utf-8'})

# changed code (scroll right to view the change)
highlighted_code = Pygments.highlight(code, :lexer => lang, :formatter => 'html', :options => {:encoding => 'utf-8', :startinline => true})
```

This line appears twice in the file, so I changed it in both places. Tests quickly confirmed that this worked and now all my PHP code blocks are being syntaxed highlighted without requiring that pesky open tag.

Being a good open source citizen, I sent a pull request to Octopress on Github. They were very responsive and helpful. They appreciated the patch (apparently this is something people complain about a lot), but asked me to verify this didn't have any unexpected behavior. If you're interested in my tests, go [read the pull request thread](https://github.com/imathis/octopress/pull/1141) to see all my variations of PHP with and without start and end tags, PHP mixed with HTML and even some Ruby and Clojure code. In the end, I proved this startinline option only affected PHP code blocks and had no negative side effects.

I expect it to be merged soon, but until then, feel free to make the two small tweaks shown above to get this behavior.
