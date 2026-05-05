import { useMemo, useState, type FormEvent } from 'react';
import { saveSession } from '../services/auth';
import { CloudCluster, CraneDecor, GoldCornerFrame, HanokRoofDecor, PlumBranch } from '../decorations';
import type { AuthData, Gender, LoveType as ApiLoveType, SignupRequest } from '../types/auth';
import type { LoveType as TestLoveType } from '../data/loveTest';

type CardRegisterPageProps = {
  resultType: TestLoveType | null;
  onComplete: (data: AuthData) => void;
  onBrowseCards: () => void;
  onGoHome: () => void;
  onBackToTest: () => void;
};

const LOVE_TYPE_OPTIONS: { value: TestLoveType; label: string; color: string; image: string }[] = [
  { value: 'satto', label: '사또', color: '#1a6b2a', image: '/characters/satto.png' },
  { value: 'general', label: '장군', color: '#ab1729', image: '/characters/janggun.png' },
  { value: 'yangban', label: '양반', color: '#1e50a2', image: '/characters/yangban.png' },
  { value: 'dolsoe', label: '돌쇠', color: '#b87a1a', image: '/characters/dolsoe.png' },
  { value: 'royal', label: '왕족', color: '#5c2d8a', image: '/characters/wangjok.png' },
  { value: 'clown', label: '광대', color: '#1a2050', image: '/characters/gwangdae.png' },
];

const API_LOVE_TYPE_MAP: Record<TestLoveType, ApiLoveType> = {
  yangban: 'YANGBAN',
  general: 'JANGGUN',
  satto: 'SATTO',
  dolsoe: 'DOLSOE',
  royal: 'WANGJOK',
  clown: 'GWANGDAE',
};

const EMOJI_OPTIONS = [
  { value: '🐶', label: '강아지상' },
  { value: '🐱', label: '고양이상' },
  { value: '🦊', label: '여우상' },
  { value: '🐰', label: '토끼상' },
  { value: '🐻', label: '곰상' },
];

const inputStyle = {
  background: 'rgba(255,255,255,0.74)',
  border: '1.5px solid rgba(160,110,40,0.3)',
  fontFamily: 'Noto Sans KR, sans-serif',
} as const;

const getLoveTypeOption = (type: TestLoveType | '') =>
  LOVE_TYPE_OPTIONS.find((option) => option.value === type) ?? null;

export default function CardRegisterPage({ resultType, onComplete, onBrowseCards, onGoHome, onBackToTest }: CardRegisterPageProps) {
  const [selectedLoveType, setSelectedLoveType] = useState<TestLoveType | ''>(() => resultType ?? '');
  const [isTypeListOpen, setIsTypeListOpen] = useState(() => !resultType);
  const [instagramId, setInstagramId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [introduction, setIntroduction] = useState('');
  const [emoji, setEmoji] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showTicketPanel, setShowTicketPanel] = useState(false);

  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const passwordMatches = passwordConfirm.length > 0 && password === passwordConfirm && password.length >= 6;

  const validationError = useMemo(() => {
    if (!selectedLoveType) return '유형을 선택해주세요.';
    if (!instagramId.trim()) return '인스타그램 ID를 입력해주세요.';
    if (password.length < 6) return '비밀번호는 6자 이상입니다.';
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    if (!gender) return '성별을 선택해주세요.';
    if (!emoji) return '대표 이모지를 선택해주세요.';
    if (!introduction.trim()) return '한줄 소개를 입력해주세요.';
    if (!privacyAgreed) return '개인정보 수집 및 이용에 동의해주세요.';
    return null;
  }, [emoji, gender, instagramId, introduction, password, passwordConfirm, privacyAgreed, selectedLoveType]);

  const canSubmit = !validationError;
  const selectedOption = getLoveTypeOption(selectedLoveType);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationError) {
      setError(validationError);
      return;
    }

    const signupPayload: SignupRequest = {
      instagramId: instagramId.trim(),
      password,
      gender: gender as Gender,
      loveType: API_LOVE_TYPE_MAP[selectedLoveType as TestLoveType],
      mbti: null,
      introduction: introduction.trim() || null,
      emoji,
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

  if (submitted && selectedOption) {
    return (
      <section
        className="relative w-full flex-1 overflow-hidden py-10 px-4"
        style={{
          background: 'linear-gradient(175deg, #dfc88a 0%, #e8d4a0 20%, #f0e2c2 55%, #ece0b8 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px)',
            }}
          />
          <div className="absolute -top-12 -left-7 origin-top-left scale-[0.62] opacity-30 sm:-top-4 sm:-left-4 sm:scale-100 sm:opacity-42">
            <PlumBranch />
          </div>
          <div className="absolute top-0 right-0 opacity-35">
            <HanokRoofDecor />
          </div>
          <CraneDecor className="absolute top-28 -right-10 scale-[0.72] opacity-[0.13] sm:top-20 sm:right-2 sm:scale-110 sm:opacity-[0.16]" />
          <div className="absolute top-20 right-0 scale-75 opacity-25 sm:top-14 sm:right-8 sm:scale-100 sm:opacity-45">
            <CloudCluster />
          </div>
          <GoldCornerFrame className="opacity-30" />
        </div>

        <div
          className="relative z-10 mx-auto max-w-md rounded-xl p-5 text-center ink-border card-shadow-lg"
          style={{
            background: 'linear-gradient(180deg, rgba(248,240,222,0.8) 0%, rgba(242,232,208,0.68) 100%)',
            backdropFilter: 'blur(1px)',
          }}
        >
          <h2 className="font-serif-kr text-2xl font-black text-[#2e1c0e]">카드가 완성되었소</h2>

          <article
            className="mt-6 rounded-xl px-4 py-5 text-left card-shadow"
            style={{
              background: `linear-gradient(180deg, ${selectedOption.color}16 0%, rgba(255,250,240,0.92) 100%)`,
              border: `1.5px solid ${selectedOption.color}30`,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden rounded-xl"
                style={{
                  background: `linear-gradient(180deg, ${selectedOption.color}18 0%, #fff7e6 100%)`,
                  border: `1px solid ${selectedOption.color}30`,
                }}
              >
                <img
                  src={selectedOption.image}
                  alt={`${selectedOption.label} 유형`}
                  className="h-full w-full object-contain object-bottom p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#8b6b45]">연애 유형</p>
                <h3 className="mt-1 font-serif-kr text-3xl font-black text-[#2e1c0e]">{selectedOption.label}</h3>
                {emoji && (
                  <p className="mt-3 text-sm font-bold leading-relaxed text-[#5a3e25]">
                    대표 이모지: {emoji}
                  </p>
                )}
                <p className="mt-1 text-sm font-bold leading-relaxed text-[#5a3e25]">
                  한줄 소개: {introduction}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-[#fff7e6]/80 px-3 py-2 text-sm font-bold text-[#4b301b]">
              인스타그램 ID: {instagramId.trim()}
            </div>
          </article>

          <div className="mt-6 space-y-3 font-serif-kr text-sm font-black leading-relaxed text-[#5a3e25]">
            <p>
              다른 인연의 인스타그램 ID를 확인하려면
              <br />
              뽑기권이 필요하오
            </p>
            <p>
              뽑기권은 융합소프트웨어학부 부스를 찾아
              <br />
              받아보시오
            </p>
          </div>

          {showTicketPanel && (
            <div className="mt-5 rounded-xl border border-[#d4b87a] bg-[#fff7e6] px-4 py-4 text-left">
              <p className="font-serif-kr text-sm font-black text-[#2e1c0e]">관리자 코드 입력</p>
              <input
                type="text"
                placeholder="관리자 코드를 입력해주시오4"
                className="mt-3 w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
                style={inputStyle}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setShowTicketPanel(true)}
              className="rounded-xl py-3 font-serif-kr text-sm font-bold text-[#f5e8d0] transition hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)',
                boxShadow: '0 4px 16px rgba(140,18,32,0.34)',
              }}
            >
              뽑기권 받기
            </button>
            <button
              type="button"
              onClick={onBrowseCards}
              className="rounded-xl border border-[#d4b87a] bg-[#fff7e6] py-3 font-serif-kr text-sm font-bold text-[#4b301b] transition hover:-translate-y-0.5 hover:bg-[#fff0d0]"
            >
              다른 인연 살펴보기
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="rounded-xl border border-[#d4b87a] bg-[#fff7e6] py-3 font-serif-kr text-sm font-bold text-[#4b301b] transition hover:-translate-y-0.5 hover:bg-[#fff0d0]"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full flex-1 overflow-hidden py-10 px-4"
      style={{
        background: 'linear-gradient(175deg, #dfc88a 0%, #e8d4a0 20%, #f0e2c2 55%, #ece0b8 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px)',
          }}
        />
        <div className="absolute -top-12 -left-7 origin-top-left scale-[0.62] opacity-30 sm:-top-4 sm:-left-4 sm:scale-100 sm:opacity-42">
          <PlumBranch />
        </div>
        <div className="absolute top-0 right-0 opacity-35">
          <HanokRoofDecor />
        </div>
        <CraneDecor className="absolute top-28 -right-10 scale-[0.72] opacity-[0.13] sm:top-20 sm:right-2 sm:scale-110 sm:opacity-[0.16]" />
        <div className="absolute top-20 right-0 scale-75 opacity-25 sm:top-14 sm:right-8 sm:scale-100 sm:opacity-45">
          <CloudCluster />
        </div>
        <div className="absolute top-32 left-28 scale-75 opacity-24">
          <CloudCluster />
        </div>
        <GoldCornerFrame className="opacity-30" />
      </div>
      <div
        className="relative z-10 mx-auto max-w-md rounded-xl p-5 ink-border card-shadow-lg"
        style={{
          background: 'linear-gradient(180deg, rgba(248,240,222,0.68) 0%, rgba(242,232,208,0.58) 100%)',
          backdropFilter: 'blur(1px)',
        }}
      >
        <div className="mb-6 text-center">
          <h2 className="font-serif-kr text-2xl font-black text-[#2e1c0e]">카드 만들기</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-3">
            <p className="font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              연애 유형 <span className="text-[#ab1729]">*</span>
            </p>

            {selectedOption && !isTypeListOpen && (
              <div
                className="mt-3 flex items-center gap-4 rounded-xl px-4 py-3 card-shadow"
                style={{
                  background: `linear-gradient(180deg, ${selectedOption.color}18 0%, rgba(255,250,240,0.86) 100%)`,
                  border: `1.5px solid ${selectedOption.color}33`,
                }}
              >
                <div
                  className="flex h-20 w-16 shrink-0 items-end justify-center overflow-hidden rounded-lg"
                  style={{
                    background: `linear-gradient(180deg, ${selectedOption.color}18 0%, #fff7e6 100%)`,
                    border: `1px solid ${selectedOption.color}30`,
                  }}
                >
                  <img
                    src={selectedOption.image}
                    alt={`${selectedOption.label} 유형`}
                    className="h-full w-full object-contain object-bottom p-1.5"
                    loading="lazy"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsTypeListOpen(true)}
                  className="flex flex-1 items-center justify-between text-left"
                >
                  <span>
                    <span className="block font-serif-kr text-lg font-black text-[#2e1c0e]">
                      유형: {selectedOption.label}
                    </span>
                    <span className="mt-1 block text-[11px] font-bold" style={{ color: selectedOption.color }}>
                      눌러서 다른 유형 선택
                    </span>
                  </span>
                  <span className="text-[#6b4825]" aria-hidden="true">⌄</span>
                </button>
              </div>
            )}

            {isTypeListOpen && (
              <div className="mt-3 overflow-hidden rounded-xl bg-white/80 ink-border card-shadow">
                <div className="max-h-[360px] overflow-y-auto">
                  {LOVE_TYPE_OPTIONS.map((option, index) => {
                    const isSelected = selectedLoveType === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedLoveType(option.value);
                          setIsTypeListOpen(false);
                          setError('');
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f6ecd2]"
                        style={{
                          background: isSelected
                            ? `${option.color}14`
                            : index % 2 === 1
                              ? 'rgba(232,212,160,0.18)'
                              : 'rgba(255,255,255,0.76)',
                          boxShadow: isSelected ? `inset 4px 0 0 ${option.color}` : 'none',
                        }}
                        aria-pressed={isSelected}
                      >
                        <span
                          className="flex h-14 w-11 shrink-0 items-end justify-center overflow-hidden rounded-lg"
                          style={{
                            background: `linear-gradient(180deg, ${option.color}18 0%, #fff7e6 100%)`,
                            border: `1px solid ${option.color}30`,
                          }}
                        >
                          <img
                            src={option.image}
                            alt={`${option.label} 카드`}
                            className="h-full w-full object-contain object-bottom p-1"
                            loading="lazy"
                          />
                        </span>
                        <span className="font-serif-kr text-base font-black text-[#2e1c0e]">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              인스타그램 ID <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={instagramId}
              onChange={(e) => {
                setInstagramId(e.target.value);
                setError('');
              }}
              placeholder="instagram_id"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              required
            />
            <p className="mt-1 text-[11px] font-bold text-[#8b6b45]">현재 사용중인 id를 입력해주시오</p>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              비밀번호 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="6자 이상"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              required
            />
            <p className="mt-1 text-[11px] font-bold text-[#8b6b45]">비밀번호는 6자 이상으로 입력해주시오</p>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              비밀번호 확인 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setError('');
              }}
              placeholder="비밀번호를 한 번 더 입력"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              required
            />
            {passwordMismatch && (
              <p className="mt-1 text-[11px] font-bold text-[#ab1729]">비밀번호가 일치하지 않습니다.</p>
            )}
            {passwordMatches && (
              <p className="mt-1 text-[11px] font-bold text-[#1a6b2a]">비밀번호가 일치합니다.</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              성별 <span className="text-[#ab1729]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([['MALE', '남자'], ['FEMALE', '여자']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setGender(value);
                    setError('');
                  }}
                  className="rounded-lg py-2.5 font-serif-kr text-sm font-bold transition hover:-translate-y-0.5"
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
            <label className="mb-2 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              대표 이모지 <span className="text-[#ab1729]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setEmoji(option.value);
                    setError('');
                  }}
                  className="rounded-lg px-2 py-3 text-center transition hover:-translate-y-0.5"
                  style={{
                    background: emoji === option.value ? 'linear-gradient(180deg, #fff4cf 0%, #ead097 100%)' : 'rgba(255,255,255,0.72)',
                    border: emoji === option.value ? '2px solid #c41e32' : '1.5px solid rgba(160,110,40,0.3)',
                    boxShadow: emoji === option.value ? '0 4px 12px rgba(140,18,32,0.18)' : 'none',
                  }}
                  aria-label={option.label}
                >
                  <span className="block text-2xl">{option.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-serif-kr text-xs font-bold tracking-wide text-[#3d2b1f]">
              한줄 소개 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={introduction}
              onChange={(e) => {
                setIntroduction(e.target.value.slice(0, 30));
                setError('');
              }}
              placeholder="나를 한 줄로 소개해보시오"
              maxLength={30}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
            />
            <p className="mt-0.5 text-right text-[10px] text-[#a08050]">{introduction.length} / 30</p>
          </div>

          <div className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-3 py-3">
            <label className="flex items-center gap-2 text-xs font-bold text-[#6b4825]">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => {
                  setPrivacyAgreed(e.target.checked);
                  setError('');
                }}
                className="h-4 w-4 accent-[#ab1729]"
              />
              개인정보 수집 및 이용에 동의합니다.
            </label>
            <button
              type="button"
              onClick={() => setShowPrivacyNotice((value) => !value)}
              className="mt-2 font-serif-kr text-[11px] font-bold text-[#7a5530] underline underline-offset-4"
            >
              개인정보 수집 및 이용동의서 {showPrivacyNotice ? '닫기' : '보기'}
            </button>
            {showPrivacyNotice && (
              <div className="mt-3 rounded-lg bg-white/65 px-3 py-3 text-left text-[11px] font-bold leading-relaxed text-[#6b4825]">
                <p>수집 항목: 인스타그램 ID, 성별, 연애 유형, 대표 이모지, 한줄 소개</p>
                <p className="mt-1">수집 목적: 카드 생성 및 카드 조회 서비스 제공</p>
                <p className="mt-1">보관 기간: 서비스 운영 기간 또는 이용자 삭제 요청 시까지</p>
              </div>
            )}
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

          {!canSubmit && (
            <p className="text-center font-serif-kr text-xs font-bold text-[#7a5530]">
              모든 항목을 입력해 주시오
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-1 w-full rounded-xl py-3 font-serif-kr text-sm font-bold text-[#f5e8d0] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: canSubmit
                ? 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)'
                : 'linear-gradient(160deg, #9b8a72 0%, #6d5d4b 100%)',
              boxShadow: canSubmit ? '0 4px 16px rgba(140,18,32,0.4)' : 'none',
            }}
          >
            카드 만들기
          </button>

          {!resultType && (
            <button
              type="button"
              onClick={onBackToTest}
              className="font-serif-kr text-xs font-bold text-[#7a5530] underline underline-offset-4"
            >
              테스트 먼저 진행하기
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
