import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getCurrentUser, saveSession, signup } from '../services/auth';
import { identifyUser, trackCardCreated, trackTicketGranted } from '../lib/analytics';
import { grantTicket } from '../services/tickets';
import { isApiError } from '../lib/api';
import { CloudCluster, CraneDecor, GoldCornerFrame, HanokRoofDecor, PlumBranch } from '../decorations';
import type { AuthData, Gender, SignupRequest } from '../types/auth';
import { types, type LoveType as TestLoveType } from '../data/loveTest';

type CardRegisterPageProps = {
  resultType: TestLoveType | null;
  onComplete: (data: AuthData) => void;
  onBrowseCards: () => void;
  onGoHome: () => void;
  onBackToTest: () => void;
};

const LOVE_TYPE_OPTIONS: {
  value: TestLoveType;
  label: string;
  color: string;
  image: string;
  description: string;
}[] = [
  { value: 'satto', label: '사또', color: '#1a6b2a', image: '/characters/satto.png', description: '내가 계획한 대로 따라와야 직성이 풀리는 리더 스타일' },
  { value: 'general', label: '장군', color: '#ab1729', image: '/characters/janggun.png', description: '눈치 안 보고 돌진! 내 사랑은 내가 지킨다는 과감한 직진 스타일' },
  { value: 'yangban', label: '양반', color: '#1e50a2', image: '/characters/yangban.png', description: '예의를 중시하고 밀당을 즐기며, 천천히 타오르는 스타일' },
  { value: 'dolsoe', label: '돌쇠', color: '#b87a1a', image: '/characters/dolsoe.png', description: '무슨 일이든 다 해주고 싶은 조선 최고의 순정 사랑꾼' },
  { value: 'royal', label: '왕족', color: '#5c2d8a', image: '/characters/wangjok.png', description: '사랑받는 게 자연스럽고, 품격 있게 마음을 전하는 스타일' },
  { value: 'clown', label: '광대', color: '#1a2050', image: '/characters/gwangdae.png', description: '입담과 유머로 상대를 매일 웃게 만드는 자유로운 스타일' },
];

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

const BACKEND_LOVE_TYPE_MAP: Record<string, TestLoveType> = {
  YANGBAN: 'yangban',
  GENERAL: 'general',
  JANGGUN: 'general',
  SATTO: 'satto',
  DOLSOE: 'dolsoe',
  ROYAL: 'royal',
  WANGJOK: 'royal',
  CLOWN: 'clown',
  GWANGDAE: 'clown',
};

const getLoveTypeCode = (type: TestLoveType) => type.toUpperCase();

const normalizeLoveTypeCode = (code?: string | null): TestLoveType | null => {
  if (!code) return null;

  const lowerCode = code.toLowerCase();
  if (types.includes(lowerCode as TestLoveType)) {
    return lowerCode as TestLoveType;
  }

  return BACKEND_LOVE_TYPE_MAP[code.toUpperCase()] ?? null;
};

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
  const [isRestoringCard, setIsRestoringCard] = useState(() => Boolean(localStorage.getItem('token')));
  const [showTicketPanel, setShowTicketPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') ?? '');
  const [myCard, setMyCard] = useState<AuthData | null>(null);
  const [myCardError, setMyCardError] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [isGrantingTicket, setIsGrantingTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketGranted, setTicketGranted] = useState(false);

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
  const myCardLoveType = normalizeLoveTypeCode(myCard?.loveTypeCode) ?? (selectedLoveType || null);
  const myCardOption = myCardLoveType ? getLoveTypeOption(myCardLoveType) : selectedOption;
  const myCardLoveTypeName = myCard?.loveTypeName ?? myCardOption?.label ?? selectedOption?.label ?? '';
  const myCardInstagramId = myCard?.instagramId ?? instagramId.trim();
  const myCardIntroduction = myCard?.introduction ?? introduction.trim();
  const myCardEmoji = myCard?.emoji ?? emoji;
  const myTicketCount = myCard?.ticketCount ?? 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let isActive = true;

    const restoreMyCard = async () => {
      try {
        const data = await getCurrentUser(token);
        if (!isActive) return;

        saveSession(data);
        setAuthToken(token);
        setMyCard(data);
        setSubmitted(true);
        setMyCardError('');
      } catch {
        if (!isActive) return;

        setMyCard(null);
        setSubmitted(false);
      } finally {
        if (isActive) {
          setIsRestoringCard(false);
        }
      }
    };

    void restoreMyCard();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!submitted) return;
    if (myCard) return;
    if (!authToken) {
      onGoHome();
      return;
    }

    let isActive = true;

    const loadMyCard = async () => {
      try {
        const data = await getCurrentUser(authToken);
        if (!isActive) return;

        setMyCard(data);
        setMyCardError('');
      } catch (err) {
        if (!isActive) return;

        setMyCardError(isApiError(err) ? err.message : '내 카드 정보를 불러오지 못했소.');
      }
    };

    void loadMyCard();

    return () => {
      isActive = false;
    };
  }, [authToken, myCard, onGoHome, submitted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const signupPayload: SignupRequest = {
      instagramId: instagramId.trim(),
      password,
      gender: gender as Gender,
      introduction: introduction.trim() || null,
      emoji,
      loveTypeCode: getLoveTypeCode(selectedLoveType as TestLoveType),
    };

    try {
      const authData = await signup(signupPayload);

      if (!authData.token) {
        setError('인증 토큰을 받지 못했소.');
        return;
      }

      localStorage.setItem('token', authData.token);
      setAuthToken(authData.token);
      saveSession(authData);
      setMyCard(authData);
      setSubmitted(true);
      identifyUser(authData.userId);
      trackCardCreated({
        userId: authData.userId,
        loveTypeCode: getLoveTypeCode(selectedLoveType as TestLoveType),
        gender,
        hasEmoji: Boolean(emoji),
      });
      onComplete(authData);
    } catch (err) {
      setError(isApiError(err) ? err.message : '회원가입에 실패했소.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrantTicket = async () => {
    const trimmedCode = adminCode.trim();

    if (!trimmedCode) {
      setTicketError('관리자 코드를 입력하시오.');
      setTicketMessage('');
      return;
    }

    const parsedTicketAmount = Number(ticketAmount || 0);

    if (parsedTicketAmount < 0) {
      setTicketError('지급 개수를 다시 확인하시오.');
      setTicketMessage('');
      return;
    }

    setIsGrantingTicket(true);
    setTicketError('');
    setTicketMessage('');

    try {
      const result = await grantTicket(trimmedCode, parsedTicketAmount);
      const nextUser = await getCurrentUser(authToken);

      setMyCard({
        ...nextUser,
        ticketCount: nextUser.ticketCount ?? result.ticketCount ?? myCard?.ticketCount,
      });
      trackTicketGranted({
        amount: parsedTicketAmount,
        ticketCount: result.ticketCount ?? parsedTicketAmount,
      });
      setTicketMessage('뽑기권을 받았소');
      setTicketGranted(true);
      setAdminCode('');
    } catch {
      setTicketError('코드를 다시 확인해보시오');
    } finally {
      setIsGrantingTicket(false);
    }
  };

  if (isRestoringCard) {
    return (
      <section
        className="relative flex w-full flex-1 items-center justify-center overflow-hidden px-4 py-10"
        style={{
          background: 'linear-gradient(175deg, #dfc88a 0%, #e8d4a0 20%, #f0e2c2 55%, #ece0b8 100%)',
        }}
      >
        <div
          className="relative z-10 mx-auto max-w-md rounded-xl px-5 py-8 text-center ink-border card-shadow-lg"
          style={{
            background: 'linear-gradient(180deg, rgba(248,240,222,0.8) 0%, rgba(242,232,208,0.68) 100%)',
          }}
        >
          <p className="font-serif-kr text-sm font-black text-[#5a3e25]">
            완성된 연분첩을 불러오는 중이오...
          </p>
        </div>
      </section>
    );
  }

  if (submitted && myCardOption) {
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
              background: `linear-gradient(180deg, ${myCardOption.color}16 0%, rgba(255,250,240,0.92) 100%)`,
              border: `1.5px solid ${myCardOption.color}30`,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden rounded-xl"
                style={{
                  background: `linear-gradient(180deg, ${myCardOption.color}18 0%, #fff7e6 100%)`,
                  border: `1px solid ${myCardOption.color}30`,
                }}
              >
                <img
                  src={myCardOption.image}
                  alt={`${myCardLoveTypeName} 유형`}
                  className="h-full w-full object-contain object-bottom p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#8b6b45]">연애 유형</p>
                <h3 className="mt-1 font-serif-kr text-3xl font-black text-[#2e1c0e]">{myCardLoveTypeName}</h3>
                <p className="mt-2 text-xs font-bold leading-relaxed text-[#7a5530]">
                  {myCardOption.description}
                </p>
                {myCardEmoji && (
                  <p className="mt-3 text-sm font-bold leading-relaxed text-[#5a3e25]">
                    대표 이모지: {myCardEmoji}
                  </p>
                )}
                <p className="mt-1 text-sm font-bold leading-relaxed text-[#5a3e25]">
                  한줄 소개: {myCardIntroduction}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-[#fff7e6]/80 px-3 py-2 text-sm font-bold text-[#4b301b]">
              인스타그램 ID: {myCardInstagramId}
            </div>
            <div className="mt-2 rounded-lg bg-[#fff7e6]/80 px-3 py-2 text-sm font-bold text-[#4b301b]">
              보유 뽑기권: {myTicketCount}장
            </div>
          </article>

          {myCardError && (
            <p className="mt-3 rounded-lg px-3 py-2 text-xs font-bold text-[#ab1729]" style={{ background: 'rgba(171,23,41,0.08)' }}>
              {myCardError}
            </p>
          )}

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
              <p className="font-serif-kr text-sm font-black text-[#2e1c0e]">관리자 코드를 입력하시오</p>
              {!ticketGranted ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    type="text"
                    value={adminCode}
                    onChange={(e) => {
                      setAdminCode(e.target.value);
                      setTicketError('');
                    }}
                    placeholder="관리자 코드"
                    className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    min={0}
                    value={ticketAmount}
                    onChange={(e) => {
                      setTicketAmount(e.target.value);
                      setTicketError('');
                    }}
                    placeholder="지급 개수"
                    className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => void handleGrantTicket()}
                    disabled={isGrantingTicket}
                    className="rounded-lg bg-[#ab1729] px-4 py-2.5 font-serif-kr text-sm font-bold text-[#fff7e6] disabled:opacity-60 sm:col-span-2"
                  >
                    {isGrantingTicket ? '확인 중' : '확인'}
                  </button>
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-bold text-[#1a6b2a]">
                  지급 완료
                </p>
              )}
              {ticketMessage && (
                <p className="mt-3 text-sm font-bold text-[#1a6b2a]">{ticketMessage}</p>
              )}
              {ticketError && (
                <p className="mt-3 text-sm font-bold text-[#ab1729]">{ticketError}</p>
              )}
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
              placeholder="본인의 인스타 아이디를 입력하시오"
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
              placeholder="비밀번호는 6자 이상이오"
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
              placeholder="비밀번호를 한 번 더 입력하시오"
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
            <p className="-mt-1 mb-2 text-[11px] font-bold text-[#8b6b45]">
              자신을 나타낼 상징을 고르시오
            </p>
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
              placeholder="본인을 한 줄로 소개해보시오"
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
            disabled={!canSubmit || isSubmitting}
            className="mt-1 w-full rounded-xl py-3 font-serif-kr text-sm font-bold text-[#f5e8d0] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: canSubmit && !isSubmitting
                ? 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)'
                : 'linear-gradient(160deg, #9b8a72 0%, #6d5d4b 100%)',
              boxShadow: canSubmit && !isSubmitting ? '0 4px 16px rgba(140,18,32,0.4)' : 'none',
            }}
          >
            {isSubmitting ? '카드를 만드는 중이오...' : '카드 만들기'}
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
