---
title: "Highlight PHP and HTML in Octopress"
date: "2013-03-29"
slug: "2013/03/29/highlight-php-and-html-in-octopress"
tags: [Octopress]
---
In [yesterday's post on Octopress](http://www.joelclermont.com/2013/03/28/better-php-highlighting-in-octopress/), I briefly mentioned the Pygments lexer documentation. One of the things I found incredibly useful was understanding all the available lexers and which language code would invoke them.

For example, let's say you want to have a code block that highlights both PHP and HTML. How would you do this?

<!-- more -->
If you simply use the `php` language token in your code block, you will get something like this:

``` php
<?php $links = $this->getNav(); ?>
<ul id="navigation">
    <?php foreach ($links as $l): ?>
        <li><a href="<?php echo $l->href; ?>"><?php $l->caption; ?></a></li>
    <?php endforeach; ?>
</ul>
```

Notice how the HTML is not higlighted, but the PHP is. If you used the `html` language token, you would get the reverse problem. But, if you search the [Pygments lexer documentation](http://pygments.org/docs/lexers/), you will find the `HtmlPhpLexer`. It first attempts to highlight all the PHP code, and then passes the remaining text to the `HtmlLexer`. (Side note: the `HtmlLexer` also parses CSS and Javascript). And since we're reading the docs, there is no need to guess as to which language token will invoke this parser. It specifies the short name as `html+php`.

``` html+php
<?php $links = $this->getNav(); ?>
<ul id="navigation">
    <?php foreach ($links as $l): ?>
        <li><a href="<?php echo $l->href; ?>"><?php $l->caption; ?></a></li>
    <?php endforeach; ?>
</ul>
```

Of course, if you're using Smarty or some other templating system, you should double-check the Pygments documentation to see if there's a match. For example, I'm a huge fan of [Twig](http://twig.sensiolabs.org), but in this case, there is no `TwigLexer`. Twig is based on a Jinja, however, and there is a `HtmlDjangoLexer` with the short name of `html+jinja` or `html+djanjo`. It works pretty well.

Who knew reading the docs could be so useful?
