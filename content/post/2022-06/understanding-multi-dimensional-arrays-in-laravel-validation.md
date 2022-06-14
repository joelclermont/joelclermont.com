---
title: "Understanding Wildcard Notation in Laravel Validation"
cover: "/images/laravel-tip.png"
tags: ["Laravel", "validation"]
date: 2022-06-14T08:55:31-05:00
---

Array validation in Laravel is very powerful, but sometimes it might not do exactly what we expect when we're dealing with multidimensional arrays and wildcard notation. Let's dig into a real-world example to see how it works internally and deepen our understanding of this feature along the way. 

<!--more-->

First, let's set up a real world example. We have a simple form to collect lunch preferences from everyone on the team. We'll tally up the most popular option across the team and that's what we'll order for lunch. In order to prevent "ballot stuffing" we want to make sure no team member votes for the same option more than once.

Here's a sample submission, along with a seemingly-straightforward set of validation rules:
```php
<?php

$data = [
    'team_meal_preferences' => [
        [ 'pizza', 'sushi', 'tacos' ],
        [ 'tacos', 'pizza' ],
        [ 'waffles', 'sushi' ],
    ],
];

$rules = [
    'team_meal_preferences' => [
        'array',
    ],
    'team_meal_preferences.*' => [
        'array',
        'min:2',
        'max:3',
    ],
    'team_meal_preferences.*.*' => [
        'string',
        'distinct',
    ],
];
```

Reading through these rules, we see that each team member has to provide at least 2 preferences for lunch, but no more than 3. And we attempt to enforce that they can't pick the same choice more than once, but here is where things don't quite work the way we might expect. Even though no individual team member violated the `distinct` rule, this `$data` will fail validation. Here is the exact error it will return:

```json
{
  "team_meal_preferences.0.0":["The team_meal_preferences.0.0 field has a duplicate value."],
  "team_meal_preferences.0.1":["The team_meal_preferences.0.1 field has a duplicate value."],
  "team_meal_preferences.0.2":["The team_meal_preferences.0.2 field has a duplicate value."],
  "team_meal_preferences.1.0":["The team_meal_preferences.1.0 field has a duplicate value."],
  "team_meal_preferences.1.1":["The team_meal_preferences.1.1 field has a duplicate value."],
  "team_meal_preferences.2.1":["The team_meal_preferences.2.1 field has a duplicate value."],
}
```

The validator is failing because it's considering every team member's choices together when evaluating the `distinct` rule. Why is this happening? Let's dig in a little bit to see how wildcard notation is evaluated inside Laravel validation.

When the `Validator` instance is constructed, it sets all the rules as a property on that instance. If we step through the logic, we see a method called `addRules` containing this line of code with a very helpful comment that is of particular interest to us:

```php
<?php

// The primary purpose of this parser is to expand any "*" rules to all
// of the explicit rules needed for the given data. For example the rule
// names.* would get expanded to names.0, names.1, etc. for this data.
$response = (new ValidationRuleParser($this->data))
                    ->explode(ValidationRuleParser::filterConditionalRules($rules, $this->data));
```

As the comment explains, this rule parser will `explode` any wildcard rules into a bunch of individual rules based on the exact shape of our data payload. In our example above, it transforms our distinct rule like this:
```php
// initial rule
team_meal_preferences.*.* = ['distinct']

// exploded rules after parsing
team_meal_preferences.0.0 = ['distinct']
team_meal_preferences.0.1 = ['distinct']
team_meal_preferences.0.2 = ['distinct']
team_meal_preferences.1.0 = ['distinct']
team_meal_preferences.1.1 = ['distinct']
team_meal_preferences.2.0 = ['distinct']
team_meal_preferences.2.1 = ['distinct']
```

It's important to note that these "exploded" rules are specific to our data. If we had only one lonely team member submit their 3 meal prefences, then it would have only generated 3 exploded rules: `0.0`, `0.1`, `0.2`. (This team member may be lonely at lunch, but they will definitely get their exact choice of meal!)

In addition to transforming the rules from a wildcard form into an exploded form, it also uses the `Arr::dot` helper to transform our data being validated:
```php
// initial data
'team_meal_preferences' => [
    [ 'pizza', 'sushi', 'tacos' ],
    [ 'tacos', 'pizza' ],
    [ 'waffles', 'sushi' ],
]

// transformed data while parsing rules
team_meal_preferences.0.0 = "pizza"
team_meal_preferences.0.1 = "sushi"
team_meal_preferences.0.2 = "tacos"
team_meal_preferences.1.0 = "tacos"
team_meal_preferences.1.1 = "pizza"
team_meal_preferences.2.0 = "waffles"
team_meal_preferences.2.1 = "sushi"

```

And this data transformation is tracked in the validator under a property called `implicitAttributes`. It maps the original key in the validated data to the individual transformed values. This is important to remember as we move into the actual validation logic.

Just from the above, we probably already have a much better intution about why our validation logic failed, but let's get to the final piece of the puzzle to make it even more clear.

The method responsible for implementing the `distinct` rule is aptly named `validateDistinct`. It first looks up to see if our attribute being validated was exploded due to wildcards. Remember, this was tracked in the validator's `implicitAttribute` property. In our case, it sees that `team_meal_preferences.0.0` is actually the primary attribute `team_meal_preferences`. This primary attribute name is then used to gather the set of all values to compare against for testing whether it is distinct or not. Because of the previous wildcard expansion, it pulls in the whole set of transformed data values to use in the `distinct` test.

Great! We understand why it didn't work as expected. What is the solution?

Using our existing data and code example, we could fix it like this:
```php
<?php
// $data definition omitted to keep it short

$rules = [
    'team_meal_preferences' => [
        'array',
    ],
    'team_meal_preferences.*' => [
        'array',
        'min:2',
        'max:3',
    ],
    // Instead of using a nested wildcard, we could limit it to one level
    'team_meal_preferences.0.*' => [
        'string',
        'distinct',
    ],
    'team_meal_preferences.1.*' => [
        'string',
        'distinct',
    ],
    'team_meal_preferences.2.*' => [
        'string',
        'distinct',
    ],
];
```

As you're probably already thinking, this is not practical. What if tomorrow there are more or less than 3 people voting for lunch preferences? To solve this, we can use a little of our own dynamic rule generation, just like the validator does internally, but adapted to our desired level of nesting for the `distinct` rule.
```php
<?php
// $data definition omitted to keep it short

$teamPreferenceRules = [];
foreach ($data['team_meal_preferences'] as $key => $val)
{
    $teamPreferenceRules["team_meal_preferences.{$key}.*"] = [
        'string',
        'distinct',
    ];
}

$rules = [
    'team_meal_preferences' => [
        'array',
    ],
    'team_meal_preferences.*' => [
        'array',
        'min:2',
        'max:3',
    ],
    ...$teamPreferenceRules,
];
```

There is also a new [`Rule::forEach` method](https://laravel.com/docs/9.x/validation#accessing-nested-array-data) in Laravel 9, but it doesn't change how the wildcard expansion is done, so I don't think it's useful in solving this particular issue with multidimensional arrays and the `distinct` validation rule.

Do you have an even better solution to this problem? Let me know!
