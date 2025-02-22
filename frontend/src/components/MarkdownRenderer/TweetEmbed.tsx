"use client";

import { useEffect, useRef, FC } from "react";

// layout.tsxにて https://platform.twitter.com/widgets.js を読み込んでいる
declare const twttr: {
  widgets: {
    load: (element?: Element) => Promise<void>;
  };
};

type EmbeddedTweetProps = {
  url: string;
  id?: number;
  cards?: "hidden";
  conversation?: "none";
  theme?: "light" | "dark";
  width?: number;
  align?: "left" | "right" | "center";
  /** @see https://developer.twitter.com/en/docs/twitter-for-websites/supported-languages */
  lang?: string;
  dnt?: true;
};

export const TweetEmbed: FC<EmbeddedTweetProps> = (props) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const key = JSON.stringify(props);

  useEffect(() => {
    if (rootRef.current !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof twttr !== "undefined" && twttr.widgets.load(rootRef.current);
    }
  }, [key]);

  return (
    <div ref={rootRef} key={key}>
      <blockquote
        className="twitter-tweet"
        data-id={props.id}
        data-cards={props.cards}
        data-conversation={props.conversation}
        data-theme={props.theme}
        data-width={props.width}
        data-align={props.align}
        data-lang={props.lang}
        data-dnt={props.dnt}
      >
        <a href={props.url} target="_blank" rel="noreferrer noopener">
          {props.url}
        </a>
      </blockquote>
    </div>
  );
};
