import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchClient, isApiError } from '../lib/api';
import {
  trackViewCards,
  trackUnlockAttempted,
  trackUnlockSucceeded,
  trackUnlockFailed,
  trackTicketGranted,
  trackUserLoggedOut,
  resetUser,
} from '../lib/analytics';
import { getCurrentUser } from '../services/auth';
import { grantTicket } from '../services/tickets';
import { GoldCornerFrame } from '../decorations';
import type { AuthData, Gender, LoveType } from '../types/auth';

type CardBrowsePageProps = {
  currentUser: AuthData | null;
  onBackHome: () => void;
  onCreateCard: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
};

type UserCard = {
  id?: number;
  userId?: number;
  targetUserId?: number;
  loveType?: LoveType;
  loveTypeCode?: string | null;
  loveTypeName?: string | null;
  gender: Gender;
  mbti?: string | null;
  emoji: string | null;
  introduction: string | null;
  instagramId: string;
};

type InstagramResponse = string | {
  instagramId: string;
};

type UnlockState = {
  isLoading?: boolean;
  message?: string;
  needsCard?: boolean;
  confirmOpen?: boolean;
};

type CardTab = 'ALL' | 'MALE' | 'FEMALE' | 'OPENED';

const CARD_TABS: { value: CardTab; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
  { value: 'OPENED', label: '내가 열람한 카드' },
];

const PAGE_SIZE = 6;

const LOVE_TYPE_LABELS: Record<LoveType, string> = {
  YANGBAN: '양반',
  JANGGUN: '장군',
  GENERAL: '장군',
  SATTO: '사또',
  DOLSOE: '돌쇠',
  WANGJOK: '왕족',
  ROYAL: '왕족',
  GWANGDAE: '광대',
  CLOWN: '광대',
};

const LOVE_TYPE_COLORS: Record<LoveType, string> = {
  YANGBAN: '#1e50a2',
  JANGGUN: '#ab1729',
  GENERAL: '#ab1729',
  SATTO: '#1a6b2a',
  DOLSOE: '#b87a1a',
  WANGJOK: '#5c2d8a',
  ROYAL: '#5c2d8a',
  GWANGDAE: '#1a2050',
  CLOWN: '#1a2050',
};

const GENDER_LABELS: Record<Gender, string> = {
  MALE: '남자',
  FEMALE: '여자',
};

const getCardLoveType = (card: UserCard): LoveType => {
  const code = (card.loveTypeCode ?? card.loveType ?? 'GENERAL').toUpperCase();

  if (code === 'GENERAL') return 'GENERAL';
  if (code === 'ROYAL') return 'ROYAL';
  if (code === 'CLOWN') return 'CLOWN';
  if (code === 'JANGGUN') return 'JANGGUN';
  if (code === 'WANGJOK') return 'WANGJOK';
  if (code === 'GWANGDAE') return 'GWANGDAE';
  if (code === 'YANGBAN') return 'YANGBAN';
  if (code === 'SATTO') return 'SATTO';
  if (code === 'DOLSOE') return 'DOLSOE';

  return 'GENERAL';
};

const getCardUserId = (card: UserCard) => card.userId ?? card.targetUserId ?? card.id ?? 0;

const mergeOpenedCards = (cards: UserCard[], openedCards: UserCard[]) => {
  const openedInstagramByUserId = new Map(
    openedCards.map((card) => [getCardUserId(card), card.instagramId]),
  );

  return cards.map((card) => {
    const openedInstagramId = openedInstagramByUserId.get(getCardUserId(card));
    return openedInstagramId
      ? {
        ...card,
        instagramId: openedInstagramId,
      }
      : card;
  });
};

export default function CardBrowsePage({
  currentUser,
  onBackHome,
  onCreateCard,
  onLoginClick,
  onLogout,
}: CardBrowsePageProps) {
  const initialCurrentUser = useRef(currentUser);
  useEffect(() => {
    trackViewCards(Boolean(initialCurrentUser.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [openedCards, setOpenedCards] = useState<UserCard[]>([]);
  const [selectedTab, setSelectedTab] = useState<CardTab>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewer, setViewer] = useState<AuthData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [unlockStates, setUnlockStates] = useState<Record<number, UnlockState>>({});
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketAdminCode, setTicketAdminCode] = useState('');
  const [ticketAmount, setTicketAmount] = useState('0');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [isGrantingTicket, setIsGrantingTicket] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadCards = async () => {
      try {
        setIsLoading(true);
        const nextCards = await fetchClient<UserCard[]>('/api/cards?gender=ALL', { auth: false });
        if (!isActive) return;

        const token = localStorage.getItem('token');
        if (!token) {
          setCards(nextCards);
          setViewer(null);
          setOpenedCards([]);
          setIsLoggedIn(false);
          setListError('');
          return;
        }

        try {
          const currentViewer = await getCurrentUser(token);
          const nextOpenedCards = await fetchClient<UserCard[]>('/api/unlocks/me');
          if (!isActive) return;

          setViewer(currentViewer);
          setOpenedCards(nextOpenedCards);
          setCards(mergeOpenedCards(nextCards, nextOpenedCards));
          setIsLoggedIn(true);
        } catch {
          if (!isActive) return;

          setCards(nextCards);
          setViewer(null);
          setOpenedCards([]);
          setIsLoggedIn(false);
        }

        setListError('');
      } catch (err) {
        if (!isActive) return;

        setListError(isApiError(err) ? err.message : '카드 목록을 불러오지 못했소.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCards();

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  const handleLogout = () => {
    trackUserLoggedOut();
    resetUser();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('instagramId');
    onLogout();
    setViewer(null);
    setOpenedCards([]);
    setIsLoggedIn(false);
    setSelectedTab('ALL');
    setCurrentPage(1);
    setUnlockStates({});
    setIsTicketModalOpen(false);
    setTicketMessage('');
    setTicketError('');
  };

  const openTicketModal = () => {
    setTicketAdminCode('');
    setTicketAmount('0');
    setTicketError('');
    setIsTicketModalOpen(true);
  };

  const handleTicketAmountChange = (value: string) => {
    if (!value) {
      setTicketAmount('');
      return;
    }

    const onlyDigits = value.replace(/\D/g, '');
    setTicketAmount(onlyDigits ? String(Number(onlyDigits)) : '');
  };

  const handleGrantTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCode = ticketAdminCode.trim();
    const amount = Number(ticketAmount || 0);

    if (!trimmedCode) {
      setTicketError('코드를 다시 확인해보시오');
      return;
    }

    setIsGrantingTicket(true);
    setTicketError('');
    setTicketMessage('');

    try {
      const result = await grantTicket(trimmedCode, amount);
      setViewer((currentViewer) =>
        currentViewer
          ? {
            ...currentViewer,
            ticketCount: result.ticketCount ?? currentViewer.ticketCount,
          }
          : currentViewer,
      );
      trackTicketGranted({
        amount,
        ticketCount: result.ticketCount ?? amount,
      });
      setTicketMessage('뽑기권을 받았소');
      setIsTicketModalOpen(false);
      setTicketAdminCode('');
      setTicketAmount('0');
    } catch {
      setTicketError('코드를 다시 확인해보시오');
    } finally {
      setIsGrantingTicket(false);
    }
  };

  const requestRevealInstagram = (targetUserId: number) => {
    const targetCard = cards.find((card) => getCardUserId(card) === targetUserId);
    if (!targetCard || targetCard.instagramId !== 'LOCKED') return;

    const token = localStorage.getItem('token');
    if (!token || !isLoggedIn) {
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          message: '인스타그램 ID를 확인하려면 카드를 먼저 만들어야 하오',
          needsCard: true,
        },
      }));
      return;
    }

    if (currentUser?.userId === targetUserId) {
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          message: '내 카드는 열람할 수 없소',
        },
      }));
      return;
    }

    setUnlockStates((states) => ({
      ...states,
      [targetUserId]: {
        confirmOpen: true,
      },
    }));
  };

  const confirmRevealInstagram = async (targetUserId: number) => {
    const targetCard = cards.find((card) => getCardUserId(card) === targetUserId);
    if (!targetCard || targetCard.instagramId !== 'LOCKED') return;

    trackUnlockAttempted({
      targetUserId,
      targetLoveTypeCode: String(targetCard.loveTypeCode ?? targetCard.loveType ?? ''),
    });

    setUnlockStates((states) => ({
      ...states,
      [targetUserId]: {
        isLoading: true,
      },
    }));

    try {
      const data = await fetchClient<InstagramResponse>(`/api/cards/${targetUserId}/unlock`, {
        method: 'POST',
      });
      const unlockedInstagramId = typeof data === 'string' ? data : data.instagramId;

      trackUnlockSucceeded({
        targetUserId,
        targetLoveTypeCode: String(targetCard.loveTypeCode ?? targetCard.loveType ?? ''),
      });

      setCards((currentCards) =>
        currentCards.map((card) =>
          getCardUserId(card) === targetUserId
            ? {
              ...card,
              instagramId: unlockedInstagramId,
            }
            : card,
        ),
      );
      setOpenedCards((currentCards) => [
        ...currentCards.filter((card) => getCardUserId(card) !== targetUserId),
        {
          ...targetCard,
          instagramId: unlockedInstagramId,
        },
      ]);
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          isLoading: false,
        },
      }));
    } catch (err) {
      const reason =
        isApiError(err) && (err.errorCode === 'UNAUTHORIZED' || err.errorCode === 'FORBIDDEN')
          ? 'UNAUTHORIZED'
          : isApiError(err) && err.errorCode.toUpperCase().includes('TICKET')
            ? 'NO_TICKET'
            : 'UNKNOWN';
      trackUnlockFailed(reason);
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          isLoading: false,
          message: '인스타그램 ID를 확인하려면 뽑기권이 필요하오',
        },
      }));
    }
  };

  const renderCard = (card: UserCard) => {
    const targetUserId = getCardUserId(card);
    const unlockState = unlockStates[targetUserId] ?? {};
    const loveType = getCardLoveType(card);
    const loveTypeColor = LOVE_TYPE_COLORS[loveType];
    const loveTypeLabel = card.loveTypeName ?? LOVE_TYPE_LABELS[loveType];
    const isInstagramLocked = card.instagramId === 'LOCKED';

    return (
      <article key={targetUserId} className="rounded-xl bg-[#fffaf0] p-3 text-left ink-border card-shadow">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f8ead0] text-3xl">
            {card.emoji || '♡'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-serif-kr text-base font-black text-[#2e1c0e]">{loveTypeLabel}</p>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-black"
                style={{ background: `${loveTypeColor}18`, color: loveTypeColor }}
              >
                {GENDER_LABELS[card.gender]}
              </span>
            </div>
            {card.mbti && (
              <p className="mt-1 text-sm font-black leading-relaxed text-[#5a3e25]">
                {card.mbti.toUpperCase()}
              </p>
            )}
            <p className="mt-1 text-sm font-bold leading-relaxed text-[#5a3e25]">
              {card.introduction || '아직 소개가 없소'}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-3 py-2.5">
            {isInstagramLocked ? (
              <button
                type="button"
                onClick={() => requestRevealInstagram(targetUserId)}
                disabled={unlockState.isLoading}
                className="w-full rounded-lg bg-[#fffaf0] px-3 py-2 text-center font-serif-kr text-sm font-black text-[#4b301b] transition hover:bg-[#fff0d0] disabled:opacity-60"
              >
                {unlockState.isLoading ? '확인하는 중이오...' : '인스타 아이디 보기'}
              </button>
            ) : (
              <p className="rounded-lg bg-[#fffaf0] px-3 py-2 text-center text-sm font-black text-[#2e1c0e]">
                {card.instagramId}
              </p>
            )}

            {unlockState.confirmOpen && (
              <div className="mt-3 rounded-lg bg-[#f8ead0] px-3 py-3 text-center">
                <p className="text-xs font-bold leading-relaxed text-[#5a3e25]">
                  이 인연의 인스타그램 ID를 열람하시겠소?
                  <br />
                  확인 시 뽑기권 1장이 차감되오.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => void confirmRevealInstagram(targetUserId)}
                    className="rounded-lg bg-[#ab1729] px-3 py-2 font-serif-kr text-xs font-bold text-[#fff7e6]"
                  >
                    열람하기
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUnlockStates((states) => ({
                        ...states,
                        [targetUserId]: {},
                      }))
                    }
                    className="rounded-lg border border-[#d4b87a] bg-[#fffaf0] px-3 py-2 font-serif-kr text-xs font-bold text-[#4b301b]"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {unlockState.message && (
              <p className="mt-2 text-xs font-bold leading-relaxed text-[#ab1729]">
                {unlockState.message}
              </p>
            )}

            {unlockState.needsCard && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onCreateCard}
                  className="rounded-lg bg-[#ab1729] px-3 py-2 font-serif-kr text-xs font-bold text-[#fff7e6]"
                >
                  카드 만들기
                </button>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="rounded-lg border border-[#d4b87a] bg-[#fffaf0] px-3 py-2 font-serif-kr text-xs font-bold text-[#4b301b]"
                >
                  내 카드 불러오기
                </button>
              </div>
            )}
          </div>
      </article>
    );
  };

  const visibleCards =
    selectedTab === 'OPENED'
      ? openedCards
      : selectedTab === 'MALE'
        ? cards.filter((card) => card.gender === 'MALE')
        : selectedTab === 'FEMALE'
          ? cards.filter((card) => card.gender === 'FEMALE')
          : cards;

  const totalPages = Math.max(1, Math.ceil(visibleCards.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedCards = visibleCards.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const handleSelectTab = (tab: CardTab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <section className="w-full flex-1 px-5 py-10 hanji-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto max-w-md overflow-hidden rounded-xl p-5 ink-border card-shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #fff7e6 0%, #f5ecd6 100%)',
        }}
      >
        <GoldCornerFrame className="opacity-35" />

        <div className="relative z-10">
          <div className="text-center">
            <h1 className="font-serif-kr text-2xl font-black text-[#2e1c0e] mb-2"
              style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
              다른 인연 살펴보기
            </h1>
            <p className="text-[#7a5530] text-sm font-bold leading-relaxed">
              카드는 자유롭게 둘러보고,
              <br />
              인스타그램 ID는 뽑기권으로 확인하시오
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-[#d4b87a] bg-[#fffaf0] px-4 py-4 text-center card-shadow">
            {isLoggedIn && viewer ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="font-serif-kr text-sm font-black text-[#2e1c0e]">
                    @{viewer.instagramId}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#7a5530]">
                    보유 뽑기권 {viewer.ticketCount ?? 0}장
                  </p>
                  {ticketMessage && (
                    <p className="mt-1 text-xs font-black text-[#ab1729]">
                      {ticketMessage}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                  <button
                    type="button"
                    onClick={openTicketModal}
                    className="rounded-lg bg-[#ab1729] px-4 py-2 font-serif-kr text-xs font-bold text-[#fff7e6] transition hover:-translate-y-0.5"
                  >
                    뽑기권 받기
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-2 font-serif-kr text-xs font-bold text-[#4b301b] transition hover:bg-[#fff0d0]"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold leading-relaxed text-[#7a5530]">
                  인스타그램 ID 확인은 카드 생성 후 가능하오
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onCreateCard}
                    className="rounded-lg bg-[#ab1729] px-3 py-2 font-serif-kr text-xs font-bold text-[#fff7e6]"
                  >
                    카드 만들기
                  </button>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-3 py-2 font-serif-kr text-xs font-bold text-[#4b301b]"
                  >
                    내 카드 불러오기
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-[#d4b87a] bg-[#fffaf0] p-1.5">
            {CARD_TABS.slice(0, 3).map((tab) => {
              const isSelected = selectedTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleSelectTab(tab.value)}
                  className="rounded-lg px-3 py-2 font-serif-kr text-sm font-black transition"
                  style={{
                    background: isSelected ? 'linear-gradient(160deg, #ab1729 0%, #7d1020 100%)' : 'transparent',
                    color: isSelected ? '#fff7e6' : '#4b301b',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => handleSelectTab('OPENED')}
            className="mt-2 w-full rounded-xl border border-[#d4b87a] px-3 py-2.5 font-serif-kr text-sm font-black transition"
            style={{
              background: selectedTab === 'OPENED' ? 'linear-gradient(160deg, #1e3a6e 0%, #132548 100%)' : '#fffaf0',
              color: selectedTab === 'OPENED' ? '#fff7e6' : '#4b301b',
            }}
          >
            내가 열람한 카드
          </button>

          <div className="mt-6 grid gap-6">
            {isLoading && (
              <p className="rounded-xl bg-[#fffaf0] px-4 py-5 text-center text-sm font-bold text-[#7a5530] ink-border">
                연분첩을 펼치는 중이오...
              </p>
            )}

            {!isLoading && listError && (
              <p className="rounded-xl bg-[#fffaf0] px-4 py-5 text-center text-sm font-bold text-[#ab1729] ink-border">
                {listError}
              </p>
            )}

            {!isLoading && !listError && (
              selectedTab === 'OPENED' && !isLoggedIn ? (
                <div className="rounded-xl bg-[#fffaf0] px-4 py-5 text-center ink-border card-shadow">
                  <p className="text-sm font-bold leading-relaxed text-[#7a5530]">
                    로그인하면 열람한 카드를 확인할 수 있소
                  </p>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="mt-4 rounded-lg bg-[#ab1729] px-4 py-2.5 font-serif-kr text-sm font-bold text-[#fff7e6]"
                  >
                    내 카드 불러오기
                  </button>
                </div>
              ) : visibleCards.length > 0 ? (
                <div className="grid gap-3">
                  {paginatedCards.map(renderCard)}
                </div>
              ) : null
            )}
          </div>

          {!isLoading && !listError && visibleCards.length > PAGE_SIZE && !(selectedTab === 'OPENED' && !isLoggedIn) && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-[#d4b87a] bg-[#fffaf0] p-2">
              <button
                type="button"
                onClick={() => handleChangePage(activePage - 1)}
                disabled={activePage === 1}
                className="rounded-lg px-3 py-2 font-serif-kr text-xs font-bold text-[#4b301b] transition hover:bg-[#fff0d0] disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                const isSelected = activePage === page;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handleChangePage(page)}
                    className="h-8 min-w-8 rounded-lg px-2 font-serif-kr text-xs font-black transition"
                    style={{
                      background: isSelected ? 'linear-gradient(160deg, #ab1729 0%, #7d1020 100%)' : 'transparent',
                      color: isSelected ? '#fff7e6' : '#4b301b',
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleChangePage(activePage + 1)}
                disabled={activePage === totalPages}
                className="rounded-lg px-3 py-2 font-serif-kr text-xs font-bold text-[#4b301b] transition hover:bg-[#fff0d0] disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onBackHome}
            className="mt-6 w-full rounded-xl border border-[#d4b87a] bg-[#fff7e6] px-4 py-3 font-serif-kr text-sm font-bold text-[#3d2b1f] transition hover:-translate-y-0.5 hover:bg-[#fff0d0]"
          >
            홈으로 이동
          </button>
        </div>
      </motion.div>

      {isTicketModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(30,16,8,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsTicketModalOpen(false)}
        >
          <form
            onSubmit={handleGrantTicket}
            className="relative w-full max-w-sm rounded-2xl p-6 ink-border card-shadow-lg"
            style={{
              background: 'linear-gradient(180deg, #f8f0de 0%, #f2e8d0 100%)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="absolute left-8 right-8 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
            />

            <h2 className="text-center font-serif-kr text-xl font-black text-[#2e1c0e]">
              뽑기권 받기
            </h2>

            <div className="mt-5 grid gap-3">
              <label className="grid gap-1.5">
                <span className="font-serif-kr text-xs font-bold text-[#3d2b1f]">관리자 코드</span>
                <input
                  type="text"
                  value={ticketAdminCode}
                  onChange={(event) => setTicketAdminCode(event.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1.5px solid rgba(160,110,40,0.3)',
                  }}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="font-serif-kr text-xs font-bold text-[#3d2b1f]">지급 개수</span>
                <input
                  type="number"
                  min="0"
                  value={ticketAmount}
                  onChange={(event) => handleTicketAmountChange(event.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-[#2e1c0e] outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1.5px solid rgba(160,110,40,0.3)',
                  }}
                />
              </label>
            </div>

            {ticketError && (
              <p
                className="mt-3 rounded-lg px-3 py-2 text-center text-xs font-bold text-[#ab1729]"
                style={{ background: 'rgba(171,23,41,0.08)' }}
              >
                {ticketError}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={isGrantingTicket}
                className="rounded-lg bg-[#ab1729] px-4 py-3 font-serif-kr text-sm font-bold text-[#fff7e6] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isGrantingTicket ? '확인 중이오...' : '받기'}
              </button>
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-3 font-serif-kr text-sm font-bold text-[#4b301b] transition hover:bg-[#fff0d0]"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
