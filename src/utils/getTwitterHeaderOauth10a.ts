import OAuth from "oauth";

export default async function () {
  const oauth = new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TWITTER_CONSUMER_KEY || "",
    process.env.TWITTER_CONSUMER_SECRET || "",
    "1.0",
    null,
    "HMAC-SHA1"
  );

  return oauth.authHeader(
    `https://api.twitter.com/2/tweets`,
    process.env.TWITTER_ACCESS_TOKEN || "",
    process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
    "POST"
  );
}
