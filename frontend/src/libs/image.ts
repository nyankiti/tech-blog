import { Buffer } from 'buffer';
import sizeOf from 'image-size';

export interface ImageDimensions {
  width: number;
  height: number;
  type?: string;
}

export const getImageDimensions = async (
  imgUrl: string,
  options: {
    maxSize?: number;
    timeout?: number;
  } = {},
): Promise<ImageDimensions> => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    timeout = 10000, // 10 seconds default
  } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(imgUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'image/*',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > maxSize)
      throw new Error(`Image too large. Maximum size is ${maxSize} bytes.`);

    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height)
      throw new Error('Could not determine image dimensions');

    return {
      width: dimensions.width,
      height: dimensions.height,
      type: dimensions.type,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};
