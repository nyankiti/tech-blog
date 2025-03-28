import { bundleMDX } from 'mdx-bundler';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const loadMDX = async (fileContent: string) => {
  return bundleMDX({
    source: fileContent,
    globals: {
      globalMetadataMap: {
        varName: 'globalMetadataMap',
      },
      he: 'he',
      '@mdx-js/react': {
        varName: 'MdxJsReact',
        namedExports: ['useMDXComponents'],
        defaultExport: false,
      },
    },
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeSlug];
      return { ...options, providerImportSource: '@mdx-js/react' };
    },
    esbuildOptions(options) {
      options.define = {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // Reactのモードを固定
      };
      return options;
    },
  });
};
