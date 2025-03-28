import { BLOG_CONTENTS_URL } from '@/constants';
import { getImageDimensions } from '@/libs/image';
import type { Image } from 'mdast';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

export const remarkImageDimesionsPlugin = () => {
  return async function transformer(tree: Node) {
    const promises: Promise<void>[] = [];
    visit(tree, 'image', (node: Image) => {
      const promise = (async () => {
        try {
          const url = `${BLOG_CONTENTS_URL}/${node.url}`;
          const dimensions = await getImageDimensions(url);
          node.data = {
            ...node.data,
            hProperties: {
              originalwidth: dimensions.width,
              originalheight: dimensions.height,
            },
          };
        } catch (error) {
          console.error('Error processing image node:', error);
        }
      })();
      promises.push(promise);
    });
    await Promise.all(promises);
  };
};
