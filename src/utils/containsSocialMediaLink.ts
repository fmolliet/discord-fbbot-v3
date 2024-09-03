export default function containsSocialMediaLink(message: string) {
    const twitterLinkRegex = /(?:https:\/\/)?(x|vxtwitter|fxtwitter|fixupx|bsky)\.(com|app)\/[^\s]+/;
    return twitterLinkRegex.test(message);
}
