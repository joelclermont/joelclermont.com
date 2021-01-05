---
title: "Contact"
date: 2017-12-25T11:24:02-06:00
layout: "about"
comments: false
---
<form name="newcontact" method="POST" action="/contact-success" data-netlify="true">
  <p>
    <label for="message">Message</label>
    <textarea name="message" rows="5" required style="display:block; width:80%"></textarea>
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" name="email" required style="display:block; width:80%"/>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
