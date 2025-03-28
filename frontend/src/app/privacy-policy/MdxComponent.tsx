'use client';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';

type Props = {
  code: string;
};

export function MDXComponent({ code }: Props) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return <Component />;
}
