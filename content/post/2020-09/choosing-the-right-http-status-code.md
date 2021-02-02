---
title: "Choosing the Right HTTP Status Code"
tags: ["http", "apis"]
date: 2020-09-09T09:05:24-05:00
cover: /images/opinion.png
---

Do you ever get frustrated when you call an API and it sends back an inappropriate HTTP status code? I never want my APIs to be a source of frustation, so I'll share a recent debate I had with myself as to which status code was the best.

<!--more-->

I was building a Vue component that does address validation. Instead of having the Vue component talk directly to the 3rd party address validation API, I wanted Vue to talk to an endpoint I control, and then that controller could manage the upstream communication.

I usually code the happy path first, but I eventually faced the question: What should I do if the upstream provider is unavailable? Just returning an empty response didn't feel right, because there was no differentiation to my Vue component (and by extension the user) between an address we couldn't identify and the address validation service being offline.

Returning any sort of 400 HTTP status code also felt wrong. This isn't a validation error, or anything the user can correct, so why make them feel like they did something wrong?

A generic 500 status code didn't feel quite right either. For one, it doesn't really provide any meaningful information to the Vue component. Another concern is that these upstream-caused 500 errors could be pollute my logs, blending in with a genuine unhandled exception, something I'd want to notice and take action on.

In the end, I settled on sending back `503 Service Unavailable` along with an empty address collection. I'd typically use this code when you taking a service offline for a maintenance window, but in this particular case it also felt like a good match. My Vue component can now specifically handle a 503, and let the user know we are temporarily unable to validate their address, but also not block them from proceeding with their work. This seemed like the best user experience.