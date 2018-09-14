require("dotenv").load();
require("isomorphic-fetch");

exports.handler = function(event, context, callback) {
  const { headers, queryStringParameters } = event;

  // Dropbox hits this endpoint once to verify the app will respond to it.
  // It's called a "verification request".
  // If that's what this is, i.e. it has a query `?challend=abc123`, echo it back
  // https://www.dropbox.com/developers/reference/webhooks#tutorial
  if (queryStringParameters.challenge) {
    const msg =
      "Success: verification request received and responded to appropriately.";
    callback(null, {
      statusCode: 200,
      body: queryStringParameters.challenge,
      headers: {
        "Content-Type": "text/plain",
        "X-Content-Type-Options": "nosniff"
      }
    });
    console.log(msg);

    // Otherwise, it's (likely) a dropbox webhook in which case we'll forward it
    // on to our netlify endpoint so a build gets triggered.
    // We'll verify that it's from dropbox by checking for a specific header
    // (we *could* verify this more, but this is probably good for now)
  } else if (headers["x-dropbox-signature"]) {
    // First make sure we even have our build hook URL. If we do, then forward
    // the dropbox webhook to our netlify webhook. Otherwise, no dice.
    if (process.env.NETLIFY_BUILD_HOOK_URL) {
      const msg =
        "Success: webhook received from Dropbox and forwarded to netlify!";
      fetch(process.env.NETLIFY_BUILD_HOOK_URL, {
        method: "POST",
        body: ""
      }).then(res => {
        callback(null, {
          statusCode: 200,
          body: msg
        });
        console.log(msg);
      });
    } else {
      const msg =
        "Failed: the `NETLIFY_BUILD_HOOK_URL` environment variable is missing.";
      callback(null, {
        statusCode: 200,
        body: msg
      });
      console.log(msg);
    }

    // otherwise just echo back
  } else {
    const msg =
      "Failed: the request was not what was expected so nothing happened.";
    callback(null, {
      statusCode: 200,
      body: msg
    });
    console.log(msg, JSON.stringify(event));
  }
};
