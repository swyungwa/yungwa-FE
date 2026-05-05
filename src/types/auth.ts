export type Gender = 'MALE' | 'FEMALE';

export type LoveType =
  | 'YANGBAN'
  | 'JANGGUN'
  | 'SATTO'
  | 'DOLSOE'
  | 'WANGJOK'
  | 'GWANGDAE'
  | 'GENERAL'
  | 'ROYAL'
  | 'CLOWN';

export type SignupRequest = {
  instagramId: string;
  password: string;
  gender: Gender;
  mbti?: string | null;
  loveTypeCode?: string | null;
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
  gender?: Gender;
  mbti?: string | null;
  introduction?: string | null;
  emoji?: string | null;
  loveTypeCode?: string | null;
  loveTypeName?: string | null;
  ticketCount?: number;
  token?: string;
};
