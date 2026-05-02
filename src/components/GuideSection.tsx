import { motion } from 'framer-motion';
import { PlumBranch } from '../decorations';

const STEPS = [
  {
    step: '1',
    icon: '📜',
    hanja: '試',
    title: '테스트',
    description: '연애 유형 테스트를\n진행해요.',
    color: '#ab1729',
    shadowColor: 'rgba(171,23,41,0.3)',
  },
  {
    step: '2',
    icon: '🪪',
    hanja: '錄',
    title: '카드 등록',
    description: '나만의 연분첩 카드를\n등록해요.',
    color: '#b87a1a',
    shadowColor: 'rgba(184,122,26,0.3)',
  },
  {
    step: '3',
    icon: '🎒',
    hanja: '緣',
    title: '뽑기권 사용',
    description: '뽑기권을 사용해\n인연을 확인해요.',
    color: '#1e50a2',
    shadowColor: 'rgba(30,80,162,0.3)',
  },
  {
    step: '4',
    icon: '🔍',
    hanja: '覽',
    title: '인스타 열람',
    description: '인연의 인스타그램 ID를\n확인해요!',
    color: '#1a6b2a',
    shadowColor: 'rgba(26,107,42,0.3)',
  },
];

export default function GuideSection() {
  return (
    <section className="relative w-full py-14 hanji-section overflow-hidden">
      {/* 배경 매화 장식 (우하단) */}
      <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-20">
        <PlumBranch flip />
      </div>

      {/* 섹션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-5"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }} />
          <span className="text-[#c9a84c]">◆</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }} />
        </div>
        <h2 className="font-serif-kr font-black text-2xl sm:text-3xl text-[#2e1c0e]"
          style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
          이용 방법
        </h2>
      </motion.div>

      {/* 수평 연결선 (md+) */}
      <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-[188px] h-px w-[420px] pointer-events-none"
        style={{ background: 'repeating-linear-gradient(90deg, #c9a84c 0, #c9a84c 8px, transparent 8px, transparent 16px)' }} />

      {/* 모바일: 2×2, 데스크탑: 1×4 */}
      <div className="grid grid-cols-2 sm:flex sm:justify-center sm:items-start gap-6 sm:gap-0 px-8 sm:px-4 max-w-xl mx-auto relative z-10">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.12 }}
            className="flex flex-col items-center text-center sm:flex-1"
          >
            {/* 번호 + 원형 아이콘 */}
            <div className="relative mb-4">
              {/* 배경 후광 */}
              <div className="absolute inset-0 rounded-full blur-sm opacity-40"
                style={{ background: step.color, transform: 'scale(1.2)' }} />

              {/* 원형 아이콘 */}
              <div className="relative w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${step.color}ee, ${step.color}cc)`,
                  boxShadow: `0 6px 20px ${step.shadowColor}, 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
                  border: '2px solid rgba(255,255,255,0.2)',
                }}>
                <span className="text-[24px] leading-none">{step.icon}</span>
                <span className="text-white/60 font-serif-kr text-[9px] leading-none mt-0.5">{step.hanja}</span>
              </div>

              {/* 순서 번호 뱃지 */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white font-mono"
                style={{
                  background: '#2e1c0e',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(201,168,76,0.6)',
                }}>
                {step.step}
              </div>
            </div>

            {/* 텍스트 */}
            <h3 className="font-serif-kr font-bold text-sm text-[#2e1c0e] mb-1.5">
              {step.title}
            </h3>
            <p className="text-[#7a5530] text-[11px] leading-relaxed font-sans whitespace-pre-line">
              {step.description}
            </p>

            {/* 화살표 (데스크탑, 마지막 제외) */}
            {i < STEPS.length - 1 && (
              <div className="hidden sm:flex absolute mt-[28px]" style={{ marginLeft: '110px' }}>
                {/* handled by connector line above */}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 화살표 오버레이 (sm+) */}
      <div className="hidden sm:flex justify-center max-w-xl mx-auto px-4 -mt-12 mb-4 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 flex justify-center items-center" style={{ marginTop: '-8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12 L19 12 M14 7 L19 12 L14 17"
                stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* 하단 장식 텍스트 */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center font-serif-kr text-[#c9a84c] text-sm tracking-widest mt-8"
      >
        ◆ 좋은 인연을 만나보세요 ◆
      </motion.p>
    </section>
  );
}
