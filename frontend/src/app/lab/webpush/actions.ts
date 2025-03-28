'use server';

import webpush, { type PushSubscription } from 'web-push';

webpush.setVapidDetails(
  'mailto:nowi41cic77mav@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribeUser(sub: PushSubscription) {
  console.log(sub);
  return { success: true };
}

export async function unsubscribeUser() {
  return { success: true };
}

export async function sendNotification(
  subscription: PushSubscription,
  title: string,
  message: string,
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: title.length === 0 ? 'Test Notification' : title,
        body: message,
        icon: '/favicon.png',
      }),
    );
    return { success: true };
  } catch {
    return { success: false };
  }
}
