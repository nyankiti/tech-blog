import { NextRequest, NextResponse } from "next/server";

// Next.jsの設定でこのAPIルートのキャッシュを無効化
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ホワイトリストドメインの配列
const WHITE_LIST_DOMAINS = [
  "www.joshwcomeau.com",
  "kentcdodds.com",
  "feeds.feedblitz.com",
  "spring.io",
  "blog.jetbrains.com",
  "blog.frankel.ch",
  "openai.com",
];

/**
 * URLが許可されたドメインかどうかをチェック
 */
function isAllowedDomain(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return WHITE_LIST_DOMAINS.some((domain) => url.hostname === domain);
  } catch {
    return false;
  }
}

/**
 * キャッシュ無効化ヘッダーを追加
 */
function addNoCacheHeaders(headers: Headers): Headers {
  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  headers.set("Surrogate-Control", "no-store");
  return headers;
}

export async function GET(request: NextRequest) {
  try {
    // URLパラメータからプロキシ先のURLを取得
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    // URLパラメータが存在しない場合はエラーを返す
    if (!urlParam) {
      const errorHeaders = new Headers();
      addNoCacheHeaders(errorHeaders);
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400, headers: errorHeaders }
      );
    }

    // URLをデコード（searchParams.get()で既にデコードされているが、二重エンコードの場合に備えて）
    let targetUrl: string;
    try {
      targetUrl = decodeURIComponent(urlParam);
    } catch {
      // デコードに失敗した場合、既にデコード済みと判断
      targetUrl = urlParam;
    }

    // ドメインがホワイトリストにあるか確認
    if (!isAllowedDomain(targetUrl)) {
      const errorHeaders = new Headers();
      addNoCacheHeaders(errorHeaders);
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403, headers: errorHeaders }
      );
    }

    // プロキシ先のURLにリクエストを送信
    const response = await fetch(targetUrl, {
      headers: {
        // 必要に応じてヘッダーを追加
        "User-Agent": "next-proxy-api",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store", // fetchのキャッシュを無効化
    });

    // レスポンスのステータスコードとヘッダーをコピー
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS関連のヘッダーは除外
      if (
        !["set-cookie", "access-control-allow-origin"].includes(
          key.toLowerCase()
        )
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Content-Typeヘッダーをレスポンスから取得
    const contentType = response.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    // キャッシュ無効化ヘッダーを追加
    addNoCacheHeaders(responseHeaders);

    // レスポンスボディを取得
    const responseData = await response.arrayBuffer();

    // レスポンスを返す
    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    const errorHeaders = new Headers();
    addNoCacheHeaders(errorHeaders);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500, headers: errorHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      const errorHeaders = new Headers();
      addNoCacheHeaders(errorHeaders);
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400, headers: errorHeaders }
      );
    }

    // URLをデコード
    let targetUrl: string;
    try {
      targetUrl = decodeURIComponent(urlParam);
    } catch {
      // デコードに失敗した場合、既にデコード済みと判断
      targetUrl = urlParam;
    }

    // ドメインがホワイトリストにあるか確認
    if (!isAllowedDomain(targetUrl)) {
      const errorHeaders = new Headers();
      addNoCacheHeaders(errorHeaders);
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403, headers: errorHeaders }
      );
    }

    // リクエストボディを取得
    const body = await request.arrayBuffer();

    // リクエストヘッダーをコピー
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // ホスト関連のヘッダーは除外
      if (
        !["host", "connection", "content-length"].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // キャッシュ無効化ヘッダーをリクエストに追加
    headers.set("Cache-Control", "no-cache");
    headers.set("Pragma", "no-cache");

    // プロキシ先のURLにリクエストを送信
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
      cache: "no-store", // fetchのキャッシュを無効化
    });

    // レスポンスのステータスコードとヘッダーをコピー
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (
        !["set-cookie", "access-control-allow-origin"].includes(
          key.toLowerCase()
        )
      ) {
        responseHeaders.set(key, value);
      }
    });

    const contentType = response.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    // キャッシュ無効化ヘッダーを追加
    addNoCacheHeaders(responseHeaders);

    // レスポンスボディを取得
    const responseData = await response.arrayBuffer();

    // レスポンスを返す
    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    const errorHeaders = new Headers();
    addNoCacheHeaders(errorHeaders);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500, headers: errorHeaders }
    );
  }
}
