export default function containsTwitterLink(message: string) {
    const twitterLinkRegex = /(?:https:\/\/)?(x|vxtwitter|fxtwitter|fixupx)\.com\/[^\s]+/;
    return twitterLinkRegex.test(message);
}
