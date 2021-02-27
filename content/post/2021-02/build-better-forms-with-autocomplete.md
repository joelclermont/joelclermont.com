---
title: "Build Better Forms With Autocomplete"
cover: "/images/opinion.png"
tags: ["opinion", "ux", "html"]
date: 2021-02-26T17:11:54-06:00
---

Ever get annoyed when your password manager doesn't know how to fill out a form on a website? Or maybe it tries to fill in something you don't want it to? If you build sites, here are some tips to save your users from similar annoyances.

<!--more-->

A lot of these annoyances can be fixed with a little attention to how you structure your HTML forms. There are some great tips on the [1Password support site](https://support.1password.com/compatible-website-design/). They have a vested interest in helping developers build sites that work well with their product.

> Another nice reference is in the [Chromium developer documentation](https://www.chromium.org/developers/design-documents/create-amazing-password-forms).

When I reviewed the 1Password guidelines, several of the tips seemed pretty basic and obvious, but one in particular was something I hadn't really taken advantage of myself: the `autocomplete` attribute.

Both forms and form inputs can have the `autocomplete` attribute simply set to `on` or `off`, but this is only the very beginning of what you can do with this attribute.

> Some sites with a mistaken view of security actually turn off autocomplete at the form level for login forms. Thankfully, modern browsers (and 3rd party password managers) will ignore that attribute.

There are a whole bunch of `autocomplete` values that give rich information to your browser (or password manager) as to what specific type of information could be automatically filled into that particular field: name (even portions of a name like first vs. last), various address fields, even payment-related data. There's a complete list on the [MDN `autocomplete` docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).

One that was new to me and looks incredibly useful is `new-password`. This value is intended to be used on a password change form. I'm always annoyed when I am on a password change form, and my password manager fills in my **old** password in the **new** password field. Setting this attribute value on that field solves this issue.

Another interesting available value is `one-time-code`. If your application makes use of two-factor authentication, and the user is using a password manager (like 1Password) that offers management of these one-time use tokens, this can give a much nicer user experience.

Browsers and password managers do a really good job figuring a lot of these semantics out on their own, but as developers we can make their job even easier, and by extension make our users less annoyed when using our applications.
