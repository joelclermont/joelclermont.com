+++
title = "date calculations are more complex than you think"
date = "2011-09-14"
slug = "2011/09/14/date-calculations-are-more-complex-than-you-think"
Categories = []
+++
Date and time manipulation is an area of programming that seems relatively simple on its surface, but lots of danger lurks just out of view. How hard could it possibly be to take a date/time and add 1 day to it? or 1 week? Piece of cake, right? You might do something like this:

``` php
$eventTime = strtotime('2011-09-15'); 

//add one day to the date 
$newEventTime = $eventTime + (24 * 60 * 60); 

//expects 2011-09-16 and will USUALLY work
echo date('Y-m-d', $newEventTime);
```
<!-- more -->
We've likely all seen code like that and probably written some ourselves. Here's another way to do it, this time using the built in date/time functionality in PHP.

``` php
$eventTime = '2011-09-15'; 

//add one day to the date 
$newEventTime = strtotime($eventTime . ' +1 day');

//expects 2011-09-16 and will ALWAYS work
echo date('Y-m-d', $newEventTime);
```

These two pieces of code are functionally equivalent, right? Well, the answer is: **most of the time**. It's the edge cases that can really drive you nuts though. What if you're right on the boundary of daylight savings time? In these cases, a calendar day may be 23 hours or 25 hours in length, not 24 as you expect.

The lesson here is to use the built-in functions to their full potential. Don't reinvent the wheel or be needlessly clever. This is a lesson I have learned the hard way while debugging in frustration. PHP has some incredibly powerful date manipulation and parsing functionality. Now go check your code for 24 * 60 and fix it before it bites you (and it will eventually).

*Note: Part of the inspiration for this post was Derick Rethan's excellent book [php|architect's Guide to Date and Time Programming](http://www.phparch.com/books/phparchitects-guide-to-date-and-time-programming/). You might not think this subject could possibly fill a whole book, but you'd be wrong. Like I mentioned above, this topic is deceptively simple and I highly recommend adding this book to your library.*
