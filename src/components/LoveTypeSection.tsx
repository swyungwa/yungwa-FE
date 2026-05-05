import { useState } from 'react';
import { motion } from 'framer-motion';
import Question from './Question';
import Result from './Result';
import { CloudCluster, CraneDecor, GoldCornerFrame, HanokRoofDecor, PlumBranch } from '../decorations';
import {
  calculateNextScores,
  createInitialScores,
  getTopType,
  questions,
  type Answer,
  type LoveType,
  type ScoreMap,
} from '../data/loveTest';


const LOVE_TYPE_PROFILES: Record<LoveType, {
  name: string;
  romanized: string;
  keyword: string;
  hanja: string;
  description: string;
  image: string;
  imageScale: number;
  color: string;
}> = {
  yangban: {
    name: '양반',
    romanized: 'YANGBAN',
    keyword: '신중/체면',
    hanja: '兩班',
    description: '예의를 중시하고 밀당을 즐기며, 천천히 타오르는 스타일',
    image: '/characters/yangban.png',
    imageScale: 1,
    color: '#1e50a2',
  },
  general: {
    name: '장군',
    romanized: 'JANGGUN',
    keyword: '직진/용맹',
    hanja: '將軍',
    description: '눈치 안 보고 돌진! 내 사랑은 내가 지킨다는 과감한 직진 스타일',
    image: '/characters/janggun.png',
    imageScale: 1,
    color: '#ab1729',
  },
  satto: {
    name: '사또',
    romanized: 'SATTO',
    keyword: '주도/통제',
    hanja: '使道',
    description: '내가 계획한 대로 따라와야 직성이 풀리는 리더 스타일',
    image: '/characters/satto.png',
    imageScale: 1,
    color: '#1a6b2a',
  },
  dolsoe: {
    name: '돌쇠',
    romanized: 'DOLSOE',
    keyword: '헌신/순정',
    hanja: '乭釗',
    description: '무슨 일이든 다 해주고 싶은 조선 최고의 순정 사랑꾼',
    image: '/characters/dolsoe.png',
    imageScale: 1,
    color: '#b87a1a',
  },
  royal: {
    name: '왕족',
    romanized: 'WANGJOK',
    keyword: '고귀/도도',
    hanja: '王族',
    description: '사랑받는 게 자연스럽고, 품격 있게 마음을 전하는 스타일',
    image: '/characters/wangjok.png',
    imageScale: 1,
    color: '#5c2d8a',
  },
  clown: {
    name: '광대',
    romanized: 'GWANGDAE',
    keyword: '재치/자유',
    hanja: '廣大',
    description: '입담과 유머로 상대를 매일 웃게 만드는 자유로운 스타일',
    image: '/characters/gwangdae.png',
    imageScale: 1,
    color: '#1a2050',
  },
};

export default function LoveTypeSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<ScoreMap>(() => createInitialScores());
  const [resultType, setResultType] = useState<LoveType | null>(null);

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const resultProfile = resultType ? LOVE_TYPE_PROFILES[resultType] : null;

  const handleSelect = (answer: Answer) => {
    const nextScores = calculateNextScores(scores, answer);

    if (currentIndex === questions.length - 1) {
      setScores(nextScores);
      setResultType(getTopType(nextScores, answer.types));
      return;
    }

    setScores(nextScores);
    setCurrentIndex((index) => index + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScores(createInitialScores());
    setResultType(null);
  };

  return (
    <section
      className="relative w-full overflow-hidden py-12"
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
        <CraneDecor className="absolute top-24 -right-10 scale-[0.72] opacity-[0.13] sm:top-20 sm:right-2 sm:scale-110 sm:opacity-[0.16]" />
        <div className="absolute top-20 right-0 scale-75 opacity-25 sm:top-14 sm:right-8 sm:scale-100 sm:opacity-45">
          <CloudCluster />
        </div>
        <div className="absolute top-32 left-28 scale-75 opacity-24">
          <CloudCluster />
        </div>
        <GoldCornerFrame className="opacity-30" />
      </div>

      <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 px-5"
      >
        {/* 상단 선 장식 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }} />
          <span className="text-[#c9a84c]">◆</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }} />
        </div>

        <h2 className="font-serif-kr font-black text-2xl sm:text-3xl text-[#2e1c0e] mb-2"
          style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
          연애 유형 테스트
        </h2>
        <p className="text-[#8b6b45] text-sm font-sans">열 문답으로 알아보는 나의 조선 연애 캐릭터</p>
      </motion.div>

      {!resultType && (
        <div className="mx-4 mb-4 rounded-xl px-4 py-3 ink-border card-shadow"
          style={{ background: 'rgba(255,247,230,0.7)' }}>
          <div className="mb-2 flex items-center justify-between text-xs font-black text-[#7c5a2c]">
            <span>진행률</span>
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#d8bd78]/70">
            <div
              className="h-full rounded-full bg-[#ab1729] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative mx-4 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #d4b87a 0%, #c9a84c 2%, #e8d498 4%, #f5edd8 6%, #f5edd8 94%, #e8d498 96%, #c9a84c 98%, #d4b87a 100%)',
          padding: '6px',
          boxShadow: '0 4px 20px rgba(100,65,10,0.2), inset 0 0 0 1px rgba(201,168,76,0.4)',
        }}>
        <div className="relative lattice-bg rounded-lg px-4 py-5 sm:px-5"
          style={{ background: 'rgba(245,237,216,0.8)' }}>
          {resultType && resultProfile ? (
            <Result
              profile={resultProfile}
              onRestart={handleRestart}
            />
          ) : (
            <Question
              question={currentQuestion}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      </div>
    </section>
  );
}
