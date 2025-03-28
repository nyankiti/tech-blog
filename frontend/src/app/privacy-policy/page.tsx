import { SITE_TITLE } from '@/constants';
import { bundleMDX } from 'mdx-bundler';
import type { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import { MDXComponent } from './MdxComponent';

const PRIVACY_POLICY_MD = `
# プライバシーポリシー
「${SITE_TITLE}（https://sokes-nook.net/ ）」をご覧頂き誠にありがとうございます。 訪問者様とのより良い関係を築くために、当サイトのプライバシーポリシーを記載します。

## 1.個人情報保護方針
本文書は、当サイトにおける個人情報の保護および、その適切な取り扱いについての方針を示したものです。

個人情報を取り扱うにあたっては、「個人情報の保護に関する法律」をはじめとする個人情報の保護に関する法令、ガイドラインおよび本プライバシーポリシーを遵守いたします。

## 2.情報の取得・開示について
訪問者様は匿名のままで、当サイトを自由に閲覧する事ができます。お問合せなど、場合によって訪問者様の氏名やメールアドレスなどの個人情報の開示をお願いする事があります。

当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。

本人の許可がある場合 法令等への協力のため、開示が必要となる場合

## 3.使用しているアクセス解析ツール
当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。 このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。

なお、この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。

この規約に関して、詳しくはGoogle のサービスを使用するサイトやアプリから収集した情報の Google による使用または、Googleアナリティクス利用規約をご参照ください。

## 4.広告の配信について
当サイトはGoogle及びGoogleのパートナーウェブサイト（第三者配信事業者）の提供する広告「Google Adsense（グーグルアドセンス）」を設置しております。広告配信プロセスにおいてデータを収集するためにCookieを使用し、当サイトを含めた過去のアクセス情報に基づいて広告を配信することが可能になります。

Cookieを使用することにより、GoogleやGoogleのパートナーは当サイトや他のサイトへのアクセス情報に基づいて、適切な広告を当サイト上で訪問者様に表示できます。

訪問者様は、Googleアカウントの広告設定ページでパーソナライズド広告を無効にできます。または、www.aboutads.info にアクセスして頂き、第三者配信事業者がパーソナライズド広告の掲載で使用する Cookie を無効にできます。

その他、Googleの広告における、Cookieの取り扱いについての詳細は、Googleのポリシーと規約ページをご覧ください。

## 5.Amazonアソシエイト・プログラム
当サイト「${SITE_TITLE}（https://sokes-nook.net/ ）」は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。


## 6.labについて
当サイト「${SITE_TITLE}（https://sokes-nook.net/ ）」には、当サイト管理人が気になった技術の実装例を示す、lab（https://sokes-nook.net/lab ）というスペースが存在します。

labには一部 GoogleのOAuth 2.0を用いた認証の動作確認、通知機能の動作確認を提供しており、その際にGoogleアカウントに関連する情報（名前、メールアドレス、プロフィール写真など）やブラウザの情報が取得されます。

また、今後ユーザー提供のデータを用いた動作確認を行う機能が追加される可能性があります。

当サイトではlabで取得したデータの保存は行なっておらず、ユーザーによる動作確認以外の目的で取得したデータを使用することはありません。

## 7.著作権について
当サイト「${SITE_TITLE}（https://sokes-nook.net/ ）」に掲載されている情報についての著作権は放棄しておりません。

著作権法により認められている引用の範囲である場合を除き「内容、テキスト、画像等」の無断転載・使用を固く禁じます。

当サイト記事からの引用に関しましては「引用元の明示」によって無償で引用頂けます。


## 8.免責事項
当サイトに掲載されている情報の正確さについて可能な限り努力をしていますが、その正確性や適切性に問題がある場合、告知無しに情報を変更・削除する事があります。当サイトの情報を用いて行う一切の行為、被った損害・損失に対しては、一切の責任を負いかねます。ご了承ください。

また、当サイトで引用している文章や画像について、著作権は引用元にあります。万が一、不適切な記事、画像、リンク等がありましたら早急に削除するなどの対応を致しますので、恐れ入りますがページ下部のお問い合わせリンクからご連絡くださるよう宜しくお願い致します。
`;

export default async function PrivacyPolicy() {
  const mdx = await bundleMDX({
    source: PRIVACY_POLICY_MD,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      return options;
    },
  });
  const { code } = mdx;
  return (
    <div className="flex w-full items-center flex-col mx-auto my-9 text-left px-4">
      <div className="post prose dark:prose-invert">
        <div className="post prose dark:prose-invert">
          <MDXComponent code={code} />
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  robots: {
    index: false, // noindexの設定
  },
};
