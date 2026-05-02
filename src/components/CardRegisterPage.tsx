import { useState } from 'react';
import { saveSession } from '../services/auth';
import type { AuthData, Gender, LoveType as ApiLoveType, SignupRequest } from '../types/auth';
import type { LoveType as TestLoveType } from '../data/loveTest';

type CardRegisterPageProps = {
  resultType: TestLoveType | null;
  onComplete: (data: AuthData) => void;
  onBackToTest: () => void;
};

const LOVE_TYPE_LABELS: Record<TestLoveType, string> = {
  사또: '사또형',
  장군: '장군형',
  양반: '양반형',
  돌쇠: '돌쇠형',
  왕족: '왕족형',
  광대: '광대형',
};

const API_LOVE_TYPE_MAP: Record<TestLoveType, ApiLoveType> = {
  양반: 'YANGBAN',
  장군: 'JANGGUN',
  사또: 'SATTO',
  돌쇠: 'DOLSOE',
  왕족: 'WANGJOK',
  광대: 'GWANGDAE',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.74)',
  border: '1.5px solid rgba(160,110,40,0.3)',
  fontFamily: 'Noto Sans KR, sans-serif',
} as const;

export default function CardRegisterPage({ resultType, onComplete, onBackToTest }: CardRegisterPageProps) {
  const [instagramId, setInstagramId] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [mbti, setMbti] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!resultType) return '테스트 결과가 필요합니다. 테스트를 먼저 완료해주세요.';
    if (!instagramId.trim()) return '인스타그램 ID를 입력해주세요.';
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 4) return '비밀번호는 최소 4자 이상이어야 합니다.';
    if (!gender) return '성별을 선택해주세요.';
    if (!mbti.trim()) return 'MBTI를 입력해주세요.';
    if (!introduction.trim()) return '자기소개를 입력해주세요.';
    if (introduction.length > 255) return '자기소개는 255자 이내로 입력해주세요.';
    if (!emoji.trim()) return '대표 이모지를 입력해주세요.';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const signupPayload: SignupRequest = {
      instagramId: instagramId.trim(),
      password,
      gender: gender as Gender,
      loveType: API_LOVE_TYPE_MAP[resultType as TestLoveType],
      mbti: mbti.trim(),
      introduction: introduction.trim(),
      emoji: emoji.trim(),
    };

    console.info('signup payload ready:', signupPayload);

    const mockAuthData: AuthData = {
      userId: Date.now(),
      instagramId: signupPayload.instagramId,
    };

    saveSession(mockAuthData);
    setSubmitted(true);
    onComplete(mockAuthData);
  };

  if (!resultType) {
    return (
      <section className="w-full flex-1 py-16 px-4 hanji-section">
        <div className="mx-auto max-w-sm rounded-xl bg-[#fffaf0] p-6 text-center ink-border card-shadow-lg">
          <h2 className="font-serif-kr text-2xl font-black text-[#2e1c0e]">테스트 결과가 필요합니다</h2>
          <p className="mt-3 text-sm font-bold leading-relaxed text-[#6b4825]">
            카드 등록은 테스트 결과 유형을 기준으로 진행됩니다.
          </p>
          <button
            type="button"
            onClick={onBackToTest}
            className="mt-6 rounded-lg bg-[#2e1c0e] px-5 py-3 text-sm font-black text-[#f8e8b4]"
          >
            테스트하러 가기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 py-10 px-4 hanji-section">
      <div
        className="mx-auto max-w-md rounded-xl p-5 ink-border card-shadow-lg"
        style={{ background: 'linear-gradient(180deg, #f8f0de 0%, #f2e8d0 100%)' }}
      >
        <div className="mb-6 text-center">
          <p className="font-mono text-xs font-bold tracking-[0.22em] text-[#9b742f]">CARD REGISTER</p>
          <h2 className="mt-2 font-serif-kr text-2xl font-black text-[#2e1c0e]">카드 등록하기</h2>
          <p className="mt-1 text-xs font-bold text-[#8b6b45]">테스트 결과를 바탕으로 나만의 연분첩 카드를 만듭니다.</p>
          <p className="mt-3 rounded-lg bg-[#fff7e6] px-3 py-2 text-xs font-bold leading-relaxed text-[#6b4825]">
            인스타그램 ID와 비밀번호는 추후 로그인할 때 사용됩니다. 모든 항목을 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-3">
            <p className="font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">연애 유형</p>
            <p className="mt-1 text-lg font-black text-[#ab1729]">{LOVE_TYPE_LABELS[resultType]}</p>
            <p className="mt-1 text-[11px] font-bold text-[#8b6b45]">테스트 결과로 자동 입력되며 수정할 수 없습니다.</p>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              인스타그램 ID <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder="instagram_id"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
            <p className="mt-1 text-[11px] font-bold text-[#8b6b45]">추후 로그인 ID로 사용됩니다.</p>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              비밀번호 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 4자"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
            <p className="mt-1 text-[11px] font-bold text-[#8b6b45]">추후 로그인 비밀번호로 사용됩니다.</p>
          </div>

          <div>
            <label className="mb-2 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              성별 <span className="text-[#ab1729]">*</span>
            </label>
            <div className="flex gap-2">
              {([['MALE', '남성'], ['FEMALE', '여성']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className="flex-1 rounded-lg py-2.5 font-serif-kr text-sm font-bold transition"
                  style={{
                    background: gender === value ? 'linear-gradient(135deg, #1e50a2, #132f6e)' : 'rgba(255,255,255,0.72)',
                    color: gender === value ? '#f5e8d0' : '#3d2b1f',
                    border: gender === value ? '1.5px solid #1e50a2' : '1.5px solid rgba(160,110,40,0.3)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              MBTI <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={mbti}
              onChange={(e) => setMbti(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="INFP"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              자기소개 <span className="text-[#ab1729]">*</span>
            </label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="나를 한 줄로 표현한다면..."
              rows={3}
              className="w-full resize-none rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
            <p className="mt-0.5 text-right text-[10px] text-[#a08050]">{introduction.length} / 255</p>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              대표 이모지 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="꽃"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="rounded-lg px-3 py-2 text-center text-xs text-[#ab1729]" style={{ background: 'rgba(171,23,41,0.08)' }}>
              {error}
            </p>
          )}

          {submitted && (
            <p className="rounded-lg px-3 py-2 text-center text-xs font-bold text-[#1a6b2a]" style={{ background: 'rgba(26,107,42,0.08)' }}>
              카드 등록 정보가 준비되었습니다. API 연결 시 이 값으로 가입 요청을 보내면 됩니다.
            </p>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-xl py-3 font-serif-kr text-sm font-bold text-[#f5e8d0] transition hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)',
              boxShadow: '0 4px 16px rgba(140,18,32,0.4)',
            }}
          >
            카드 등록 완료
          </button>
        </form>
      </div>
    </section>
  );
}
