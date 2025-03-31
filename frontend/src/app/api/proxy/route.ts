import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  try {
    // URLパラメータからプロキシ先のURLを取得（デコード済み）
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    // URLパラメータが存在しない場合はエラーを返す
    if (!urlParam) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // URLをデコード（searchParams.get() で既にデコードされているが、二重エンコードの場合に備えて）
    let targetUrl: string;
    try {
      targetUrl = decodeURIComponent(urlParam);
    } catch {
      // デコードに失敗した場合、既にデコード済みと判断
      targetUrl = urlParam;
    }

    // ドメインがホワイトリストにあるか確認
    if (!isAllowedDomain(targetUrl)) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
      );
    }

    // プロキシ先のURLにリクエストを送信
    const response = await fetch(targetUrl, {
      headers: {
        // 必要に応じてヘッダーを追加
        "User-Agent": "next-proxy-api",
      },
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

    // レスポンスボディを取得
    const responseData = await response.arrayBuffer();

    // レスポンスを返す
    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // URLをデコード（必要な場合）
    let targetUrl: string;
    try {
      targetUrl = decodeURIComponent(urlParam);
    } catch {
      // デコードに失敗した場合、既にデコード済みと判断
      targetUrl = urlParam;
    }

    // ドメインがホワイトリストにあるか確認
    if (!isAllowedDomain(targetUrl)) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
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

    // プロキシ先のURLにリクエストを送信
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
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

    // レスポンスボディを取得
    const responseData = await response.arrayBuffer();

    // レスポンスを返す
    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    );
  }
}
