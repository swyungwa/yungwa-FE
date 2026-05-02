import { useRef, useState } from 'react';
import { motion } from 'framer-motion';


const LOVE_TYPES = [
  {
    id: '01',
    name: '양반',
    romanized: 'YANGBAN',
    keyword: '신중/체면',
    hanja: '兩班',
    description: '예의를 중시하고 밀당을 즐기며, 천천히 타오르는 스타일',
    image: '/characters/yangban.png',
    imageScale: 1,
    barColor: '#1e50a2',          // 청색
    cardBg: '#f2f6fd',
    accentBg: '#d4e4f7',
    labelBg: 'rgba(30,80,162,0.12)',
    labelText: '#1e50a2',
    borderColor: 'rgba(30,80,162,0.22)',
  },
  {
    id: '02',
    name: '장군',
    romanized: 'JANGGUN',
    keyword: '직진/용맹',
    hanja: '將軍',
    description: '눈치 안 보고 돌진! 내 사랑은 내가 지킨다는 과워 직진 스타일',
    image: '/characters/janggun.png',
    imageScale: 1.0,
    barColor: '#ab1729',          // 적색
    cardBg: '#fef2f3',
    accentBg: '#f5d4d7',
    labelBg: 'rgba(171,23,41,0.12)',
    labelText: '#ab1729',
    borderColor: 'rgba(171,23,41,0.22)',
  },
  {
    id: '03',
    name: '사또',
    romanized: 'SATTO',
    keyword: '주도/통제',
    hanja: '使道',
    description: '내가 계획한 대로 따라와야 직성이 풀리는 리더 스타일',
    image: '/characters/satto.png',
    imageScale: 1.0,
    barColor: '#1a6b2a',          // 녹색
    cardBg: '#f2faf4',
    accentBg: '#d4edd8',
    labelBg: 'rgba(26,107,42,0.12)',
    labelText: '#1a6b2a',
    borderColor: 'rgba(26,107,42,0.22)',
  },
  {
    id: '04',
    name: '돌쇠',
    romanized: 'DOLSOE',
    keyword: '헌신/순정',
    hanja: '乭釗',
    description: '무조건적인 사랑. 군은일 다 해주는 조선 최고의 사랑꾼',
    image: '/characters/dolsoe.png',
    imageScale: 1.0,
    barColor: '#b87a1a',          // 황토색
    cardBg: '#fdf8ee',
    accentBg: '#f5e4c0',
    labelBg: 'rgba(184,122,26,0.12)',
    labelText: '#8b5c10',
    borderColor: 'rgba(184,122,26,0.22)',
  },
  {
    id: '05',
    name: '왕족',
    romanized: 'WANGJOK',
    keyword: '고귀/도도',
    hanja: '王族',
    description: '사랑받는 게 당연한 타입. 언제 다가가기보다 상대를 기다리는 스타일',
    image: '/characters/wangjok.png',
    imageScale: 1.0,
    barColor: '#5c2d8a',          // 보라/금
    cardBg: '#f8f2fe',
    accentBg: '#e8d4f8',
    labelBg: 'rgba(92,45,138,0.12)',
    labelText: '#5c2d8a',
    borderColor: 'rgba(92,45,138,0.28)',
    highlighted: true,
  },
  {
    id: '06',
    name: '광대',
    romanized: 'GWANGDAE',
    keyword: '재치/자유',
    hanja: '廣大',
    description: '구속은 싫소! 입담과 유머로 상대를 매일 웃게 만드는 스타일',
    image: '/characters/gwangdae.png',
    imageScale: 1.0,
    barColor: '#1a2050',          // 먹색/남색
    cardBg: '#f4f5fc',
    accentBg: '#d4d8f2',
    labelBg: 'rgba(26,32,80,0.12)',
    labelText: '#1a2050',
    borderColor: 'rgba(26,32,80,0.22)',
  },
];

export default function LoveTypeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const cardWidth = scrollWidth / LOVE_TYPES.length;
    setActiveIndex(Math.min(Math.round(scrollLeft / cardWidth), LOVE_TYPES.length - 1));
  };

  const scrollTo = (i: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.scrollWidth / LOVE_TYPES.length;
    scrollRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    setActiveIndex(i);
  };

  return (
    <section className="w-full py-12 hanji-section">
      {/* 섹션 헤더 */}
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
          연애 유형 미리보기
        </h2>
        <p className="text-[#8b6b45] text-sm font-sans">당신은 어떤 유형의 인연일까요?</p>
      </motion.div>

      {/* 병풍 패널 래퍼 */}
      <div className="relative mx-4 rounded-xl overflow-hidden mb-4"
        style={{
          background: 'linear-gradient(180deg, #d4b87a 0%, #c9a84c 2%, #e8d498 4%, #f5edd8 6%, #f5edd8 94%, #e8d498 96%, #c9a84c 98%, #d4b87a 100%)',
          padding: '6px 0',
          boxShadow: '0 4px 20px rgba(100,65,10,0.2), inset 0 0 0 1px rgba(201,168,76,0.4)',
        }}>
        {/* 격자 배경 */}
        <div className="relative lattice-bg"
          style={{ background: 'rgba(245,237,216,0.8)' }}>

          {/* 스크롤 카드 영역 */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto px-4 py-5 snap-x snap-mandatory hide-scrollbar"
          >
            {LOVE_TYPES.map((type, i) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="flex-shrink-0 w-[196px] sm:w-[210px] rounded-xl snap-start flex flex-col overflow-hidden"
                style={{
                  background: type.cardBg,
                  border: `1.5px solid ${type.borderColor}`,
                  boxShadow: type.highlighted
                    ? `0 4px 20px ${type.barColor}30, 0 0 0 2px ${type.barColor}40`
                    : '0 2px 12px rgba(80,50,10,0.1), 0 6px 20px rgba(80,50,10,0.07)',
                }}
              >
                {/* 오방색 상단 바 + 한자 */}
                <div className="relative h-14 flex items-center justify-between px-4"
                  style={{ background: `linear-gradient(135deg, ${type.barColor} 0%, ${type.barColor}dd 100%)` }}>
                  <div>
                    <p className="text-white/60 text-[9px] font-mono tracking-widest leading-none">{type.romanized}</p>
                    <p className="text-white font-serif-kr font-black text-lg leading-tight">{type.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 font-serif-kr text-lg leading-none">{type.hanja}</p>
                    <p className="text-white/40 font-mono text-[9px] tracking-widest">{type.id}</p>
                  </div>
                  {/* 상단 바 하단 테두리 장식 */}
                  <div className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: 'rgba(255,255,255,0.2)' }} />
                </div>

                {/* 키워드 태그 */}
                <div className="px-4 pt-3 pb-2">
                  <span className="inline-flex items-center text-[11px] font-bold font-sans px-2.5 py-1 rounded-full"
                    style={{ background: type.labelBg, color: type.labelText }}>
                    [{type.keyword}]
                  </span>
                </div>

                {/* 캐릭터 이미지 영역 */}
                <div className="mx-4 mb-3 rounded-xl overflow-hidden flex items-end justify-center"
                  style={{
                    background: `linear-gradient(160deg, ${type.accentBg} 0%, ${type.accentBg}88 100%)`,
                    border: `1px solid ${type.borderColor}`,
                    height: '128px',
                  }}>
                  <img
                    src={type.image}
                    alt={type.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'bottom',
                      transform: `scale(${type.imageScale})`,
                      transformOrigin: 'center bottom',
                    }}
                  />
                </div>

                {/* 설명 */}
                <p className="px-4 text-[#5a3e25] text-[11px] leading-relaxed font-sans flex-1">
                  {type.description}
                </p>

                {/* 하단 구분선 */}
                <div className="mx-4 mb-4 mt-3 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${type.borderColor}, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {LOVE_TYPES.map((_t, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? '20px' : '8px',
              height: '8px',
              background: i === activeIndex ? LOVE_TYPES[activeIndex].barColor : 'rgba(160,110,40,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
