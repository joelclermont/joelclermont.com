---
title: "Why I Enjoy Working on Legacy Software Applications"
tags: ["opinion", "refactoring"]
date: 2020-09-17T18:33:38-05:00
---

Today I realized something about myself, I actually *really* enjoy working in legacy applications. This may seem odd. It's common to hear complaints about "how bad this old code is", so why would I enjoy working in a difficult environment?

First, it would be useful for me to define what makes an application a legacy application. I realize this may not be a universal definition for everyone, but here are the core elements I think of that make an application qualify as "legacy":

* **Project lifespan** - This application has been in production for at least several years, maybe even a decade or more
* **Developer turnover** - The original developer or team are long gone. In fact, likely more than one team has joined and left the project.
* **No cohesive structure** - If the framework offers 4 ways of doing a task, all 4 can be found in the code base. Like an archaeologist, you can dig back through layers and see how different patterns were bolted onto the project over time.
* **Low test coverage** - If you have tests at all, they're likely low value, brittle, and provide very little coverage of the application as a whole.
* **Outdated technology** - If it's using a framework at all, it's using an old, unsupported version. It also likely only runs on older versions of the programming language.

I've really painted an attractive picture, haven't I? Why on earth would I find joy and satisfaction working in something that could very objectively be described as a mess?

First, the application is successful. The fact that it has been in production so long, limping along, but providing value to the business is quite a testament. Personally, I find more contentment working on one thing a long time versus jumping from project to project. (I've done both in my career)

Second, I find that if managed properly, these sorts of projects can really help a team grow together. If you wallow in how bad things are, that causes low team morale, but if instead you focus on progressively making things a little better every week together, it shifts your perspective. Bonus points for reflecting on these small wins as a team, and taking pride in leaving the code a little better than you found it.

Legacy applications also engage problem-solving skills and careful analysis unlike a brand new application would. You have to rationalize what out-of-date documentation says with what the tests say with what the code comments say with what the code actually does. This attention detail takes effort, but I find it extremely satisfying when done successfully.

Sure, it can be frustrating, and you definitely have to move slower and more cautiously, but working on making a legacy application better brings a kind of satisfcation you can't get from building out a fresh, shiny application from scratch. Am I alone in feeling this way?