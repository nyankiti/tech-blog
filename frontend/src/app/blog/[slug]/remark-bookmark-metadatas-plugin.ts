import { getImageDimensions } from '@/libs/image';
import { fetchSiteMetadata } from '@/libs/sitemetadata';
import type { Root } from 'mdast';
import type { MdxJsxAttribute } from 'mdast-util-mdx-jsx';
import { visit } from 'unist-util-visit';

export const remarkBookmarkMetadatasPlugin = () => {
  return async function transformer(tree: Root) {
    const promises: Promise<void>[] = [];
    visit(tree, 'mdxJsxFlowElement', (node) => {
      const promise = (async () => {
        try {
          if (node.name === 'Bookmark') {
            const href = node.attributes?.find(
              (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'href',
            )?.value;
            if (typeof href === 'string') {
              const metadata = await fetchSiteMetadata(href);
              // 新しいメタデータ属性を追加
              const type = 'mdxJsxAttribute' as const;
              const metadataAttributes: MdxJsxAttribute[] = [
                {
                  type,
                  name: 'metadataurl',
                  value: metadata?.url,
                },
                {
                  type,
                  name: 'metadatasitename',
                  value: metadata?.site_name,
                },
                {
                  type,
                  name: 'metadatatitle',
                  value: metadata?.title,
                },
                {
                  type,
                  name: 'metadatadescription',
                  value: metadata?.description,
                },
                {
                  type,
                  name: 'metadataimage',
                  value: metadata?.image,
                },
                {
                  type,
                  name: 'metadatatype',
                  value: metadata?.type,
                },
              ].filter((attr) => attr.value !== undefined);

              node.attributes.push(...metadataAttributes);

              // imageがある場合はされにdimensionsを追加
              if (metadata?.image) {
                const imageDimensions = await getImageDimensions(metadata.image);
                if (imageDimensions) {
                  const imageDimensionsAttributes: MdxJsxAttribute[] = [
                    {
                      type,
                      name: 'metadataimagewidth',
                      value: imageDimensions.width.toString(),
                    },
                    {
                      type,
                      name: 'metadataimageheight',
                      value: imageDimensions.height.toString(),
                    },
                  ];
                  node.attributes.push(...imageDimensionsAttributes);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing Bookmark node:', error);
        }
      })();
      promises.push(promise);
    });
    await Promise.all(promises);
  };
};
