export abstract class AbstractRestService {
  /**
   * Replaces values in a URL string based on a key-value mapping object.
   * @param {string} url - The input URL string containing placeholders with colons (e.g., ":key").
   * @param {Record<string, string>} replacements - An object with key-value pairs to replace placeholders in the URL.
   * @returns {string} - The modified URL string with replaced values.
   */
  protected replacePathParams(url: string, replacements: Record<string, string>): string {
    // Replace parts of the URL that match the key-value mapping object
    Object.keys(replacements).forEach((key) => {
      const replacement = replacements[key];
      if (replacement !== undefined) {
        const regex = new RegExp(`:${key}`, 'g');
        url = url.replace(regex, replacement);
      }
    });

    return url;
  }

  protected addQueryParams(baseUrl: string, queryParams: Record<string, string>): string {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    if (queryString) {
      return `${baseUrl}?${queryString}`;
    }

    return baseUrl;
  }
}
