import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchClient, isApiError } from '../lib/api';
import { getCurrentUser } from '../services/auth';
import { GoldCornerFrame } from '../decorations';
import type { Gender, LoveType } from '../types/auth';

type CardBrowsePageProps = {
  onBackHome: () => void;
  onCreateCard: () => void;
  onLoginClick: () => void;
  onStartTest: () => void;
};

type UserCard = {
  id?: number;
  userId?: number;
  loveType?: LoveType;
  loveTypeCode?: string | null;
  loveTypeName?: string | null;
  gender: Gender;
  emoji: string | null;
  introduction: string | null;
  instagramId: string;
};

type OpenedCard = UserCard & {
  targetUserId?: number;
};

type InstagramResponse = string | {
  instagramId: string;
};

type UnlockState = {
  isLoading?: boolean;
  message?: string;
  needsCard?: boolean;
};

type GenderFilter = 'ALL' | Gender;

const FILTER_OPTIONS: { value: GenderFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
];

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

const getCardUserId = (card: UserCard | OpenedCard) =>
  card.userId ?? ('targetUserId' in card ? card.targetUserId : undefined) ?? card.id ?? 0;

const mergeOpenedCards = (cards: UserCard[], openedCards: OpenedCard[]) => {
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

export default function CardBrowsePage({ onBackHome, onCreateCard, onLoginClick, onStartTest }: CardBrowsePageProps) {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('ALL');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [unlockStates, setUnlockStates] = useState<Record<number, UnlockState>>({});

  useEffect(() => {
    let isActive = true;

    const loadCards = async () => {
      try {
        setIsLoading(true);
        const nextCards = await fetchClient<UserCard[]>(`/api/cards?gender=${genderFilter}`, { auth: false });
        if (!isActive) return;

        const token = localStorage.getItem('token');

        if (!token) {
          setCards(nextCards);
          setIsLoggedIn(false);
          setListError('');
          return;
        }

        try {
          await getCurrentUser(token);
          const nextOpenedCards = await fetchClient<OpenedCard[]>('/api/unlocks/me');
          if (!isActive) return;

          setCards(mergeOpenedCards(nextCards, nextOpenedCards));
          setIsLoggedIn(true);
        } catch {
          if (!isActive) return;

          setCards(nextCards);
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
  }, [genderFilter]);

  const handleRevealInstagram = async (targetUserId: number) => {
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
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          isLoading: false,
        },
      }));
    } catch {
      setUnlockStates((states) => ({
        ...states,
        [targetUserId]: {
          isLoading: false,
          message: '인스타그램 ID를 확인하려면 뽑기권이 필요하오',
          needsCard: false,
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
      <article key={targetUserId} className="rounded-xl bg-[#fffaf0] p-4 text-left ink-border card-shadow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-serif-kr text-lg font-black text-[#2e1c0e]">
              {loveTypeLabel}
            </p>
            <p className="mt-1 text-xs font-black text-[#7a5530]">
              {GENDER_LABELS[card.gender]}
            </p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-black"
            style={{ background: `${loveTypeColor}18`, color: loveTypeColor }}
          >
            연애 유형
          </span>
        </div>

        <p className="mt-3 rounded-lg bg-[#f8ead0] px-3 py-2 text-sm font-bold leading-relaxed text-[#5a3e25]">
          {card.emoji && (
            <>
              대표 이모지: {card.emoji}
              <br />
            </>
          )}
          한줄 소개: {card.introduction || '아직 소개가 없소'}
        </p>

        <div className="mt-3 rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-3 py-3">
          {isInstagramLocked ? (
            <button
              type="button"
              onClick={() => void handleRevealInstagram(targetUserId)}
              disabled={unlockState.isLoading}
              className="w-full text-left text-sm font-black text-[#4b301b] disabled:opacity-60"
            >
              {unlockState.isLoading ? '확인하는 중이오...' : '🔒 인스타그램 ID'}
            </button>
          ) : (
            <p className="text-sm font-black text-[#2e1c0e]">{card.instagramId}</p>
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
              카드는 자유롭게 둘러보고, 인스타그램 ID는 뽑기권으로 확인하시오.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-[#d4b87a] bg-[#fffaf0] p-1.5">
            {FILTER_OPTIONS.map((option) => {
              const isSelected = genderFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setGenderFilter(option.value);
                    setUnlockStates({});
                  }}
                  className="rounded-lg px-3 py-2 font-serif-kr text-sm font-black transition"
                  style={{
                    background: isSelected ? 'linear-gradient(160deg, #ab1729 0%, #7d1020 100%)' : 'transparent',
                    color: isSelected ? '#fff7e6' : '#4b301b',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
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

            {!isLoading && !listError && cards.length === 0 && (
              <div className="rounded-xl bg-[#fffaf0] px-4 py-5 text-center ink-border">
                <p className="text-sm font-bold text-[#7a5530]">아직 해당 인연 카드가 없소.</p>
                <button
                  type="button"
                  onClick={onStartTest}
                  className="mt-4 rounded-lg bg-[#ab1729] px-4 py-2.5 font-serif-kr text-sm font-bold text-[#fff7e6]"
                >
                  테스트 시작
                </button>
              </div>
            )}

            {!isLoading && !listError && cards.length > 0 && (
              cards.map(renderCard)
            )}
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="mt-6 w-full rounded-xl border border-[#d4b87a] bg-[#fff7e6] px-4 py-3 font-serif-kr text-sm font-bold text-[#3d2b1f] transition hover:-translate-y-0.5 hover:bg-[#fff0d0]"
          >
            홈으로 이동
          </button>
        </div>
      </motion.div>
    </section>
  );
}
