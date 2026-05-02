export type Gender = 'MALE' | 'FEMALE';

export type LoveType =
  | 'YANGBAN'
  | 'JANGGUN'
  | 'SATTO'
  | 'DOLSOE'
  | 'WANGJOK'
  | 'GWANGDAE';

export type SignupRequest = {
  instagramId: string;
  password: string;
  gender: Gender;
  mbti?: string | null;
  loveType?: LoveType | null;
  introduction?: string | null;
  emoji?: string | null;
};

export type LoginRequest = {
  instagramId: string;
  password: string;
};

export type AuthData = {
  userId: number;
  instagramId: string;
};
