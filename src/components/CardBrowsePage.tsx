import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchClient, isApiError } from '../lib/api';
import { GoldCornerFrame } from '../decorations';
import type { Gender, LoveType } from '../types/auth';

type CardBrowsePageProps = {
  onBackHome: () => void;
  onStartTest: () => void;
};

type UserCard = {
  id: number;
  loveType: LoveType;
  gender: Gender;
  emoji: string | null;
  introduction: string | null;
};

type InstagramResponse = {
  instagramId: string;
};

type UnlockState = {
  instagramId?: string;
  isLoading?: boolean;
  message?: string;
  showTicketButton?: boolean;
};

const LOVE_TYPE_LABELS: Record<LoveType, string> = {
  YANGBAN: '양반',
  JANGGUN: '장군',
  SATTO: '사또',
  DOLSOE: '돌쇠',
  WANGJOK: '왕족',
  GWANGDAE: '광대',
};

const LOVE_TYPE_COLORS: Record<LoveType, string> = {
  YANGBAN: '#1e50a2',
  JANGGUN: '#ab1729',
  SATTO: '#1a6b2a',
  DOLSOE: '#b87a1a',
  WANGJOK: '#5c2d8a',
  GWANGDAE: '#1a2050',
};

const GENDER_LABELS: Record<Gender, string> = {
  MALE: '남자',
  FEMALE: '여자',
};

export default function CardBrowsePage({ onBackHome, onStartTest }: CardBrowsePageProps) {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [unlockStates, setUnlockStates] = useState<Record<number, UnlockState>>({});
  const [showTicketPanel, setShowTicketPanel] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadCards = async () => {
      try {
        const nextCards = await fetchClient<UserCard[]>('/api/cards');
        if (!isActive) return;

        setCards(nextCards);
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
  }, []);

  const handleRevealInstagram = async (cardId: number) => {
    setUnlockStates((states) => ({
      ...states,
      [cardId]: {
        isLoading: true,
        message: '인스타그램 ID를 확인하려면 뽑기권이 필요하오',
      },
    }));

    try {
      const data = await fetchClient<InstagramResponse>(`/api/cards/${cardId}/instagram`);
      setUnlockStates((states) => ({
        ...states,
        [cardId]: {
          instagramId: data.instagramId,
        },
      }));
    } catch (err) {
      setUnlockStates((states) => ({
        ...states,
        [cardId]: {
          message: isApiError(err) ? err.message : '뽑기권 확인에 실패했소.',
          showTicketButton: true,
        },
      }));
    }
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

          {showTicketPanel && (
            <div className="mt-5 rounded-xl border border-[#d4b87a] bg-[#fffaf0] px-4 py-4">
              <p className="font-serif-kr text-sm font-black text-[#2e1c0e]">뽑기권 받기</p>
              <p className="mt-2 text-xs font-bold leading-relaxed text-[#7a5530]">
                융합소프트웨어학부 부스를 찾아 관리자 코드를 받아보시오.
              </p>
              <input
                type="text"
                placeholder="관리자 코드"
                className="mt-3 w-full rounded-lg border border-[#d4b87a] bg-white/80 px-3 py-2.5 text-sm font-bold text-[#2e1c0e] outline-none"
              />
            </div>
          )}

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
                <p className="text-sm font-bold text-[#7a5530]">아직 펼쳐진 카드가 없소.</p>
                <button
                  type="button"
                  onClick={onStartTest}
                  className="mt-4 rounded-lg bg-[#ab1729] px-4 py-2.5 font-serif-kr text-sm font-bold text-[#fff7e6]"
                >
                  테스트 시작
                </button>
              </div>
            )}

            {cards.map((card) => {
              const unlockState = unlockStates[card.id] ?? {};
              const loveTypeColor = LOVE_TYPE_COLORS[card.loveType];

              return (
                <article key={card.id} className="rounded-xl bg-[#fffaf0] p-4 text-left ink-border card-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif-kr text-lg font-black text-[#2e1c0e]">
                        {LOVE_TYPE_LABELS[card.loveType]}
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
                    {unlockState.instagramId ? (
                      <p className="text-sm font-black text-[#2e1c0e]">{unlockState.instagramId}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleRevealInstagram(card.id)}
                        disabled={unlockState.isLoading}
                        className="w-full text-left text-sm font-black text-[#4b301b] disabled:opacity-60"
                      >
                        {unlockState.isLoading ? '확인하는 중이오...' : '🔒 인스타그램 ID 잠김'}
                      </button>
                    )}

                    {unlockState.message && (
                      <p className="mt-2 text-xs font-bold leading-relaxed text-[#ab1729]">
                        {unlockState.message}
                      </p>
                    )}

                    {unlockState.showTicketButton && (
                      <button
                        type="button"
                        onClick={() => setShowTicketPanel(true)}
                        className="mt-3 rounded-lg bg-[#ab1729] px-3 py-2 font-serif-kr text-xs font-bold text-[#fff7e6]"
                      >
                        뽑기권 받기
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
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
