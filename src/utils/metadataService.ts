interface MetadataResult {
  title?: string;
  imageUrl?: string;
}

export const fetchMetadata = async (url: string): Promise<MetadataResult> => {
  try {
    console.log('Fetching metadata for URL:', url);
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    console.log('Metadata response:', data);
    
    if (data.status === 'success') {
      return {
        title: data.data.title || '',
        imageUrl: data.data.image?.url || '',
      };
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {};
  }
};