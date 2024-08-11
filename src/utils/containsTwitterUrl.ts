export default function containsTwitterLink(message: string) {
    // Definindo a expressão regular
    const twitterLinkRegex = /(?:https:\/\/)?(x|vxtwitter|fxtwitter)\.com\/[^\s]+/;

    // Testando a mensagem contra a expressão regular
    return twitterLinkRegex.test(message);
}
