import { TextDecoder } from 'text-encoding';

interface MetadataResult {
  title?: string;
  imageUrl?: string;
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  const metaData: MetadataResult = {};

  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  try {
    const response = await fetch(proxyUrl + url);
    const uint8array = new Uint8Array(await response.arrayBuffer());

    // UTF8 body
    const utf8Decoder = new TextDecoder();
    const utf8Body = utf8Decoder.decode(uint8array);
    const domParser = new DOMParser();
    let doc = domParser.parseFromString(utf8Body, 'text/html');

    const contentType = doc
      .querySelector('head > meta[http-equiv="Content-Type"]')
      ?.getAttribute('content');

    const match = contentType?.match(/charset=([^;]*)/);
    const encoding = match?.[1];

    if (encoding && encoding !== 'utf-8') {
      const decoder = new TextDecoder(encoding);
      const body = decoder.decode(uint8array);

      doc = domParser.parseFromString(body, 'text/html');
    }

    const title = doc.querySelector('head > title')?.textContent;
    const image = doc
      .querySelector('head > meta[property="og:image"]')
      ?.getAttribute('content');

    console.log(image, image?.startsWith('https:'));

    metaData.title = title?.trim();
    metaData.imageUrl = image
      ? image.startsWith('https:')
        ? image
        : 'https:' + image
      : undefined;
  } catch (error) {
    console.error(`Error fetching metadata: ${error}`);
  }

  return metaData;
}
