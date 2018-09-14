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
- Save your access token in Netlify and locally in your `.env` file as `DBX_ACCESS_TOKEN`
  - Netlify:
    - Your site -> Settings -> Build & deploy -> Build environment variables
  - Locally:
    - Copy `.env.example` to `.env` and add replaces the value of `DBX_ACCESS_TOKEN`
- Create and a Netlify build hook URL
  - Settings -> Build & deploy -> Build Hooks -> Add build hook (name it anything you like)
- Save your your Netlify build hook under the key `NETLIFY_BUILD_HOOK_URL` as an environment variable in Netlify and in your local `.env` file
- Open the app console in Dropbox and add the `dropbox-webhook` function URL that Netlify created for us.
  - This should match a pattern like `https://YOUR_SITE_SUBDOMAIN.netlify.com/.netlify/functions/dropbox-webhook`. You can verify this function URL is live by going to "Functions" in your site in Netlify. You should see a function named `dropbox-webhook.js` and if you click on it, you'll be able to see the function URL endpoint.

![final-view](https://user-images.githubusercontent.com/1316441/45561195-62b1ce80-b804-11e8-800f-4cdc4c14fd0d.png)

Once you've done all this, you should be able to create a markdown file in Dropbox and see it get deployed to your Netlify site's URL.

**IMPORTANT** this project is setup to use Jekyll, which means you must use Jekyll’s naming convention for your text files in Dropbox. That means your folder should look something like:

```
dropbox-app-folder/
  - 2018-08-14-my-post-slug.md
  - 2018-08-18-are-you-reading-these.md
  - 2018-09-03-you-are-reading-these.md
  - 2018-09-08-isnt-life-great.md
```

Also, for what it’s worth, this site isn't doing anything more than reading the content in each file and spitting it out into an HTML page. If you want to leverage [front-matter](https://jekyllrb.com/docs/front-matter/)
