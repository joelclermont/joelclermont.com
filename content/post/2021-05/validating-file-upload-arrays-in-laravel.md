---
title: "Validating File Upload Arrays in Laravel"
cover: "/images/laravel-tip.png"
tags: ["laravel", "validation"]
date: 2021-05-25T11:03:20-05:00
---

Let's say you have an HTML form with 3 file inputs named `certificate[]`, and you want to make them all required. Should be pretty easy, right?

<!--more-->

A reasonable approach might be to use the array dot notation in your validation rules:

```php
<?php
$rules = [
    'certificate.*' => [
        'required',
    ],
];
```

This does not work as expected, however. Why? If a file upload is empty, it's not even part of the Laravel `Request` that gets validated by your rules. The `certificate.*` rule means "for every element in the certificate array, that element should be required", but if `certificate` doesn't even exist on your `Request`, then this rule will pass.

Let's figure out what's going on. First thing to check: what is the browser doing? Maybe it's not even sending in the form field as part of its request if the file upload is empty. Checking my browser's Network tab, I see that the form fields are indeed present:

![Browser Network tab shows fields are included](/images/validating-file-upload-arrays-in-laravel/01-browser-network-tab-output.png)

Next, what about PHP? Does it include empty files in the `$_FILES` superglobal? Sure enough, `$_FILES` contains a `certificate` array with 3 elements, one for each of my empty file inputs:

```
array:1 [▼
  "certificate" => array:5 [▼
    "name" => array:3 [▶]
    "type" => array:3 [▶]
    "tmp_name" => array:3 [▶]
    "error" => array:3 [▶]
    "size" => array:3 [▶]
  ]
]
```

Let's also add an array of 3 empty text inputs called `name[]` and look at the Laravel `Request` object:

```
// output of $request->input()
array:2 [▼
  "_token" => "eSGJ05lCLWLFZ1zCGxlP2rYxgy7FyZT6Yg8Fjawa"
  "name" => array:3 [▼
    0 => null
    1 => null
    2 => null
  ]
]

// output of $request->file()
[]
```

So an array of empty text fields is present in the request, but our array of empty file inputs is nowhere to be found. Why does it disappear?

If we dig into how a `Request` is created, we find our answer. When a `Request` is initialized, it is passed in all the PHP-provided super globals like `$_GET`, `$_POST`, `$_FILES`, and so on. Internally, that `$_FILES` parameter is initialized as a Symfony `FileBag` object. When that `FileBag` is initialized, each element is passed through the `convertFileInformation` function. Among other things, it restructures this array into a more consistent shape, but notice this relevant bit of code:

```php
<?php
if (\UPLOAD_ERR_NO_FILE == $file['error']) {
    $file = null;
} else {
    $file = new UploadedFile($file['tmp_name'], $file['name'], $file['type'], $file['error'], false);
}
```

Even though PHP has all the empty file objects in `$_FILES`, each one of them has an `error` value set to `4`, which matches the `UPLOAD_ERR_NO_FILE` constant and therefore the initialized `FileBag` is empty. Finally, we've found it! This is the spot where those files disappear!

I'm sure you found this as interesting as I did, but let's get back to the original validation scenario. We have a form with an array of 3 file inputs, and we want all of them to be required. How do we do this?

```php
<?php
$rules = [
    'certificate' => [
        'required',
        'array',
        'size:3',
    ],

    'certificate.*' => [
        // any other sort of file validation we want to do on each element
        'file',
        'mimes:pdf',
        'size:4096',
    ]
]
```

By pairing a set of rules on the main array as well as using dot notation to set rules on each array element, we get the validation behavior we want.
