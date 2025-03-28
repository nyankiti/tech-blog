'use client';

import { useEffect, useState } from 'react';
import { sendNotification, subscribeUser, unsubscribeUser } from './actions';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [alert, setAlert] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Test Notification');

  useEffect(() => {
    requestPermission().then((permission) => {
      if (permission) registerServiceWorker();
    });
  }, []);

  async function requestPermission() {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      // 現在の通知権限の状態をチェック
      if (Notification.permission === 'granted') {
        return true;
      } else if (Notification.permission === 'default') {
        // 通知権限がまだ許可されていない場合、許可をリクエスト
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') return true;
        });
      } else {
        // Notification.permission === "denied" の場合、手動で権限を許可してもらう必要がある
        setAlert('通知権限が拒否されています。ブラウザの設定より手動で通知を許可してください');
      }
    } else {
      setAlert('このブラウザは通知をサポートしていません。');
    }
    return false;
  }

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const subscription = await registration.pushManager.getSubscription();
    setSubscription(subscription);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    setSubscription(subscription);
    // server actionで globalThis.PushSubscription から web-pushの PushSubscription に変換される
    await subscribeUser(JSON.parse(JSON.stringify(subscription)));
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      const res = await sendNotification(JSON.parse(JSON.stringify(subscription)), title, message);
      if (res.success === true) {
        setMessage('');
      } else {
        // 失敗の場合はアラートメッセージを出す
        setAlert('通知送信に失敗しました。一度 Unsubscribeしてから再度お試しください');
      }
    }
  }

  return (
    <div className="prose max-w-7xl px-5 py-24 mx-auto lg:px-32">
      {alert.length !== 0 && <p className=" text-red-500">{alert}</p>}
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>Push通知の購読済みです。</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={unsubscribeFromPush}
          >
            Unsubscribe
          </button>
          <br />

          <p className=" font-bold">通知テスト</p>
          <span>通知タイトル: </span>
          <input
            type="text"
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <span>通知内容: </span>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendTestNotification}
          >
            通知を送信する
          </button>
        </>
      ) : (
        <>
          <p>Push通知を購読する</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={subscribeToPush}
          >
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="prose mx-2">
      <PushNotificationManager />
      {/* <InstallPrompt /> */}
    </div>
  );
}
