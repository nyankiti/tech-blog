// types/index.ts
export interface User {
  username: string;
  avatar: string;
}

export interface VideoData {
  id: string;
  url: string;
  user: User;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface SwipeHandlers {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export type DeviceType = "mobile" | "desktop";
