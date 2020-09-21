---
title: "Toggling Groups of Related Fields in Update Request"
tags: ["laravel", "forms"]
date: 2020-09-21T13:17:39-05:00
---

Let's say you have a form with two groups of related, but mutually exclusive, fields. When you `POST` and store a new record, no problem, only the right fields are sent in. But what do you do when that record is updated? How can you cleanly handle this?

<!--more-->

First, I'll make it a bit more concrete. Here's an example form:
![Date fields with firm date toggled](/images/field-toggle-updates/01-date-firm.png)
![Date fields with flexible dates toggled](/images/field-toggle-updates/02-date-flexible.png)

On the model, there's a `date_type` field, and then a `firm_date` field or two `flexible_date_start` and `flexible_date_end` fields. If someone creates a record with a firm date, but then updates it with a flexible date range, we definitely don't want that `firm_date` value still hanging out in the database record. How could we handle this?

One approach is to handle this right in the controller with an `if/else` block:
```php
<?php
$updatedApplication = $request->validated();

if ($updatedApplication['desired_date_type'] === OfferingApplication::DATE_TYPE_FIRM) {
    $updatedApplication['desired_date_flexible_date_start'] = null;
    $updatedApplication['desired_date_flexible_date_end'] = null;
} else {
    $updatedApplication['desired_date_firm_date'] = null;
}

$application->update($updatedApplication);
```

This feels a bit noisy to me though, and my toggle only has two options. This would be worse if there were even more possible states. Another approach is to start out with all the possible date fields as `null` and then merge in the actual request data.
```php
<?php
$normalizedDateFields = [
    'desired_date_flexible_date_start' => null,
    'desired_date_flexible_date_end' => null,
    'desired_date_firm_date' => null,
];
$updatedApplication = array_merge($normalizedDateFields, $request->validated());

$application->update($updatedApplication);
```

I like this approach better. It feels more readable, even if the number of fields grew. If it got really big, I might even move that out into a private function. In the above example, I don't really need to assign a variable, but I like how it reads versus just mashing an array literal into `array_merge`.

Talking this over with another developer, two other ideas were pitched:

1. Move it into the Form Request. Use `prepareForValidation` to inject the default null values, and change the validation rules to `present` to make sure it's always there.
2. Take it a step further and have the HTML generate empty fields when a particular group is toggled off. Then you could drop `prepareForValidation` entirely.

I'm still thinking about #1, but #2 feels like pushing too much knowledge to the front-end for something that feels like a persistence concern. I also don't like how that approach is fighting against the nature of HTML forms by injecting a hidden empty field to get around the fact that disabled fields (or fields not even in the DOM - this is a Vue component) are not submitted.
