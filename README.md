# Netlibox

Netlify + Dropbox as a blogging platform. Read the [@TODO associated blog post](http://google.com).

## How To

In order to get a similar setup, you’ll have to do the following:

- Fork this repo.
- Create [a new site in Netlify](https://app.netlify.com/start) tied to your forked repo.
  - You don’t need to specify any build options through the Netlify UI, we’ll do all of that through through our [`netlify.toml` file](<(https://www.netlify.com/docs/netlify-toml-reference/)>)
- [Setup an app](https://www.dropbox.com/developers/apps) in your Dropbox account.
  - For access type, I like to choose an ”App Folder“ because then API access will be scoped specifically to a single folder (as opposed to my entire Dropbox). This folder will contain the content that gets pulled in at build time.
- Generate an access token for your Dropbox app
  - Find your app in the [Developer App Console](https://www.dropbox.com/developers/apps) then under `Oauth2` click the "Generate" access token button.
- Save your access token via the Netlify UI and locally in your `.env` file as `DBX_ACCESS_TOKEN`
  - Netlify:
    - Your site -> Settings -> Build & deploy -> Build environment variables
  - Locally:
    - Copy `.env.example` to `.env` and add replaces the value of `DBX_ACCESS_TOKEN`
- Ensure the following proxy redirect is in your `netlify.toml` file
  ```
  [[redirects]]
    from = "/dropbox-webhook"
    to = "/.netlify/functions/dropbox-webhook"
    status = 200
  ```
  - Note how its proxy the request to our custom function. You can verify this function URL is live by going to "Functions" in your site in Netlify. You should see a function named `dropbox-webhook.js` and if you click on it, you'll be able to see the function’s endpoint.
- Deploy your site
- Go to Dropbox and add a webhook URL that points to my proxy URL (i.e. https://netlibox.netlify.com/dropbox-webhook). Dropbox will make a verification request, which will get proxied to my custom function, which will send back to the Dropbox API the payload it expects.
- Open [the app console in Dropbox](https://www.dropbox.com/developers/apps) and add the proxy URI of your site
  - This should match a pattern like `https://YOUR_SITE_SUBDOMAIN.netlify.com/dropbox-webhook`
  - **Only proceed to the next step once you’ve Dropbox has verified this URI and you’ve added as a webhook in your Dropbox app**
- Create and a Netlify build hook URI
  - Settings -> Build & deploy -> Build Hooks -> Add build hook (name it anything you like)
- Save your your Netlify build hook URI under the key `NETLIFY_BUILD_HOOK_URL` as an environment variable via the Netlify UI and in your local `.env` file
- Delete the old proxy redirect in the `netlify.toml` file and create a new one that points to the build hook URI Netlify generated for you. Example:
  ```
  [[redirects]]
    from = "/dropbox-webhook"
    to = "BUILD_HOOK_URI_NETLIFY_GENERATED"
    status = 200
  ```

![final-view](https://user-images.githubusercontent.com/1316441/45561195-62b1ce80-b804-11e8-800f-4cdc4c14fd0d.png)

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
