# Blog instructions

Note: Currently tested with [Hugo 0.55.6](https://github.com/gohugoio/hugo/releases/tag/v0.55.6)

First, make sure to clone the repo with submodules. The theme is currently tracked this way. If you don't clone it, you won't be able to build.

- `git submodule init`
- `git submodule update`

`hugo server` from the repo root should build and server on http://localhost:1313

## Writing a new post

- `hugo new post/YYYY-MM/blog-post-title.md` to write a new post
- set tags
- set a cover image (look in static/images for available)
- remove author, draft metadata

If you have images, put them in `static/images/blog-post-title`.

Netlify deploys on push to master, so you won't need S3 setup or the `publish.sh` deploy script.
