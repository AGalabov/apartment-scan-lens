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
    const decoder = new TextDecoder('windows-1251');
    const body = decoder.decode(uint8array);
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(body, 'text/html');

    const title = doc.querySelector('head > title')?.textContent;
    const image = doc
      .querySelector('head > meta[property="og:image"]')
      ?.getAttribute('content');

    metaData.title = title ? title : undefined;
    metaData.imageUrl = image ? 'https:' + image : undefined;
  } catch (error) {
    console.error(`Error fetching metadata: ${error}`);
  }

  return metaData;
}
