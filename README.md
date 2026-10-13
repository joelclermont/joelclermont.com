# Blog instructions

Built with [Hugo](https://gohugo.io) (extended, current release) and hosted on Cloudflare Workers with static assets. The theme lives in `themes/nuo` as plain files (it was previously a submodule).

`hugo server` from the repo root builds and serves on http://localhost:1313

To test the contact form Worker locally, run `npm install` once, then `npm run dev` (serves on http://localhost:8787). The development config and `.dev.vars` use Cloudflare's always-pass Turnstile test keys.

## Writing a new post

- `hugo new post/YYYY-MM/blog-post-title.md` to write a new post
- set tags
- set a cover image (look in static/images for available)
- remove author, draft metadata

If you have images, put them in `static/images/blog-post-title`.

## Deploying

`npm run deploy` builds the site and runs `wrangler deploy`.

Old URL redirects live in `static/_redirects`.
