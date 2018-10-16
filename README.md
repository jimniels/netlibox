# Netlibox

Netlify + Dropbox as a blogging platform. Read the [@TODO associated blog post](http://google.com).

## How To

- Fork this repo.
- Create [a new site in Netlify](https://app.netlify.com/start) tied to your forked repo.
  - You don’t need to specify any build options through the Netlify UI, we’ll do all of that through through our [`netlify.toml` file](<(https://www.netlify.com/docs/netlify-toml-reference/)>)
- [Setup an app](https://www.dropbox.com/developers/apps) in your Dropbox account.
  - For access type, I like to choose an ”App Folder“ because then API access will be scoped specifically to a single folder (as opposed to my entire Dropbox). This folder will contain the content that gets pulled in at build time.
- Generate an access token for your Dropbox app
  - Find your app in the [Developer App Console](https://www.dropbox.com/developers/apps) then under `Oauth2` click the "Generate" access token button.
- Save your access token as `DBX_ACCESS_TOKEN` in two places:
  - Netlify UI:
    - Your site > Settings > Build & deploy > Build environment variables
  - Local `.env` file:
    - Copy `.env.example` to `.env` and replace the value of `DBX_ACCESS_TOKEN`
- Create a Netlify build hook URL
  - Settings > Build & deploy > Build Hooks > Add build hook
  - For convenience, name it `NETLIFY_BUILD_HOOK_URL`
- Save your Netlify build hook URL as `NETLIFY_BUILD_HOOK_URL` in two places:
  - Netlify UI
    - Your site > Settings > Build & deploy > Build environment variables
  - Local `.env` file
    - Replace the value of `NETLIFY_BUILD_HOOK_URL`
- Open the app console in Dropbox and add the `dropbox-webhook` function URL that Netlify created for us.
  - This should match a pattern like `https://YOUR_SITE_SUBDOMAIN.netlify.com/.netlify/functions/dropbox-webhook`. You can verify this function URL is live by going to "Functions" in your site in Netlify. You should see a function named `dropbox-webhook.js` and if you click on it, you'll be able to see the function URL endpoint.

![final-view](https://user-images.githubusercontent.com/1316441/46992107-c9592f00-d0c5-11e8-8a1c-fa751765a402.png)

Once you've done all this, you should be able to create a markdown file in Dropbox and see it get deployed to your Netlify site's URL.

### Note: File Structure

This project is setup to use Jekyll, which means you must use Jekyll’s naming convention for your text files in Dropbox. That means your folder should look something like:

```
dropbox-app-folder/
  - 2018-08-14-my-post-slug.md
  - 2018-08-18-are-you-reading-these.md
  - 2018-09-03-you-are-reading-these.md
  - 2018-09-08-isnt-life-great.md
```

### Note: Post Metadata

This site isn't doing anything more than reading the content of each plain-text markdown file and spitting it out into HTML pages. None of the posts have extra metadata in them. They are just content. However, additional/overriding metadata is possible by using [front-matter](https://jekyllrb.com/docs/front-matter/).

Because this example repo is using Jekyll, you could write YAML front matter in each markdown file and that would be parsed by Jekyll at build time and become available in the site template files. However, that metadata is optional in each `.md` file and this repo's templates do not use any. With that said, `post.date` and `post.url` are derived from each file name (i.e. `2018-01-08-my-post-slug.md`) which is a convention in Jekyll.

## Ideas for Future Enhancements

This is a really basic prototype of what you could do with Netlify + Dropbox for publishing content to the web. Here are a few additional ideas for enhancing this scaffolding (which, in theory, would work):

- Have a "drafts" deploy preview
  - If you were using Jekyll, you could setup a new branch called, say, `drafts` which Netlify can run do a "[deploy preview](https://www.netlify.com/docs/continuous-deployment/)" on. Then you could have a "drafts" folder in Dropbox and anytime you save content there, Netlify would build your deploy preview to a specific URL which you could then visit and see what your site would look like if your drafts were published. The act of “publishing a draft” at that point would be moving your markdown file from the "drafts" folder to the root.
  - Here's a rough idea of how this would be done: setup a `drafts` branch in Github where you modify the node script which fetches content from Dropbox to also retrieve all content in a folder named "drafts". Then in your `_netlify.toml` file, modify your Jekyll build command to include drafts (i.e. `jekyll build --drafts`). Then setup a deploy preview in Netlify.
- Source your blog images from Dropbox
  - In theory, you could also pull in your blog’s images at build time and have your static site generator output them in the build. Adding images to your posts would, in theory, be as as easy as dragging an image to your dropbox folder and then linking to it in your markdown file `![My image](/path/to/image.png)` (which would then trigger a build in Netlify and publish your content live).
