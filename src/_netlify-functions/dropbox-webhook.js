require("dotenv").load();
require("isomorphic-fetch");

exports.handler = function(event, context, callback) {
  const { headers, queryStringParameters } = event;

  // Dropbox hits this endpoint once to verify the app will respond to it.
  // It's called a "verification request".
  // If that's what this is, i.e. it has a query `?challenge=abc123`, and
  // we want to echo it back.
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

    // Otherwise this is something we don't expect, so respond accordingly.
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
