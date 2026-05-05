import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PREVIEW_TYPES = [
  {
    name: '사또',
    keyword: '통제형',
    image: '/characters/satto.png',
    color: '#1a6b2a',
  },
  {
    name: '장군',
    keyword: '직진형',
    image: '/characters/janggun.png',
    color: '#ab1729',
  },
  {
    name: '양반',
    keyword: '신중형',
    image: '/characters/yangban.png',
    color: '#1e50a2',
  },
  {
    name: '돌쇠',
    keyword: '헌신형',
    image: '/characters/dolsoe.png',
    color: '#b87a1a',
  },
  {
    name: '왕족',
    keyword: '고귀형',
    image: '/characters/wangjok.png',
    color: '#5c2d8a',
  },
  {
    name: '광대',
    keyword: '유머형',
    image: '/characters/gwangdae.png',
    color: '#1a2050',
  },
];

export default function TypePreviewSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const hasUserInteractedRef = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !window.matchMedia('(max-width: 639px)').matches) return;

    const markInteracted = () => {
      hasUserInteractedRef.current = true;
    };

    window.addEventListener('pointerdown', markInteracted, { passive: true });
    window.addEventListener('touchstart', markInteracted, { passive: true });
    window.addEventListener('wheel', markInteracted, { passive: true });

    const hintTimer = window.setTimeout(() => {
      if (hasUserInteractedRef.current) return;
      scroller.scrollBy({ left: 56, behavior: 'smooth' });
    }, 700);

    return () => {
      window.clearTimeout(hintTimer);
      window.removeEventListener('pointerdown', markInteracted);
      window.removeEventListener('touchstart', markInteracted);
      window.removeEventListener('wheel', markInteracted);
    };
  }, []);

  const stopHint = () => {
    hasUserInteractedRef.current = true;
  };

  return (
    <section className="w-full px-5 py-8 sm:py-12 hanji-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }} />
          <span className="text-[#c9a84c]">◆</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }} />
        </div>
        <h2 className="font-serif-kr font-black text-2xl sm:text-3xl text-[#2e1c0e] mb-2"
          style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
          이런 유형이 있소
        </h2>
        <p className="text-[#8b6b45] text-sm font-sans">
          그대 안에 깃든 조선 연애 유형을 살펴보시오
        </p>
      </motion.div>

      <div
        ref={scrollerRef}
        onPointerDown={stopHint}
        onTouchStart={stopHint}
        onWheel={stopHint}
        onScroll={stopHint}
        className="grid grid-flow-col auto-cols-[42%] gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 pr-10 snap-x snap-mandatory touch-pan-x hide-scrollbar sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 sm:overflow-visible sm:pr-0 sm:pb-0 sm:gap-4"
      >
        {PREVIEW_TYPES.map((type, index) => (
          <motion.article
            key={type.name}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="snap-start rounded-xl overflow-hidden card-shadow ink-border sm:hover:-translate-y-1 sm:transition-transform sm:duration-200"
            style={{
              background: 'linear-gradient(180deg, #fff7e6 0%, #f6ecd2 100%)',
            }}
          >
            <div className="h-1.5" style={{ background: type.color }} />
            <div className="p-3 text-center">
              <div
                className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg"
                style={{
                  background: `linear-gradient(180deg, ${type.color}18 0%, rgba(255,250,240,0.85) 100%)`,
                  border: `1px solid ${type.color}22`,
                }}
              >
                <img
                  src={type.image}
                  alt={`${type.name} ${type.keyword}`}
                  className="h-full w-full object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif-kr font-black text-[#2e1c0e] text-base sm:text-lg leading-tight">
                {type.name}
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-bold" style={{ color: type.color }}>
                {type.keyword}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
