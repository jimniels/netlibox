require("dotenv").load();
require("isomorphic-fetch");

const { env: { NETLIFY_BUILD_HOOK_URL } = process;

exports.handler = function(event, context, callback) {
  // If we don't know what build hook URL we're hitting, this is useless.
  if (!NETLIFY_BUILD_HOOK_URL) {
    const msg =
      "Failed: the `NETLIFY_BUILD_HOOK_URL` environment variable is missing.";
    callback(null, {
      statusCode: 200,
      body: msg
    });
    console.log(msg);
    return;
  }

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
    const msg =
      "Success: webhook received from Dropbox and forwarded to netlify!";
    fetch("https://api.netlify.com/build_hooks/5b0588070733d56d23fdf3c7", {
      method: "POST",
      body: ""
    }).then(res => {
      callback(null, {
        statusCode: 200,
        body: msg
      });
      console.log(msg);
    });

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
