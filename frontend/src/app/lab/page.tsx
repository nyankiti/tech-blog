import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false, // noindexの設定
  },
};

export default async function Page() {
  return (
    <div className="prose max-w-7xl px-5 py-24 mx-auto lg:px-32">
      <p>気になった技術の実験場。</p>
      <ul>
        <li>
          <a href="/lab/webpush">webpush</a>
        </li>
      </ul>
    </div>
  );
}
