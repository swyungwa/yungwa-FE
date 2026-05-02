import { motion } from 'framer-motion';
import { GoldCornerFrame } from '../decorations';

const FEATURES = [
  {
    emoji: '📜',
    title: '테스트',
    description: '연애 유형 테스트로\n나를 알아가요.',
    barColor: '#ab1729',
    accentBg: '#f9e8ea',
    iconBg: '#f2cfd3',
  },
  {
    emoji: '🪪',
    title: '카드 등록',
    description: '나만의 연분첩 카드를\n생성하고 등록해요.',
    barColor: '#1e50a2',
    accentBg: '#e8eef9',
    iconBg: '#c8d8f5',
  },
  {
    emoji: '🃏',
    title: '카드 보기',
    description: '다른 사람들의 카드를\n구경하고 인연을 찾아보세요.',
    barColor: '#1a6b2a',
    accentBg: '#e8f5ec',
    iconBg: '#c4e8cc',
  },
  {
    emoji: '🎒',
    title: '뽑기권 등록',
    description: '뽑기권을 등록하고\n더 많은 인연을 만나보세요.',
    barColor: '#5c2d8a',
    accentBg: '#f2ebfc',
    iconBg: '#dcc8f5',
  },
];

export default function ActionSection() {
  return (
    <section className="w-full py-12 px-5 scroll-section">
      {/* 섹션 헤더 */}
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
        <h2 className="font-serif-kr font-black text-2xl sm:text-3xl text-[#2e1c0e]"
          style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
          주요 기능
        </h2>
      </motion.div>

      {/* 두루마리 프레임 */}
      <div className="relative max-w-md mx-auto">
        {/* 두루마리 상단 롤 */}
        <div className="h-4 rounded-t-full mx-2"
          style={{
            background: 'linear-gradient(180deg, #c9a84c 0%, #e8cc80 40%, #b89038 100%)',
            boxShadow: '0 3px 8px rgba(100,65,10,0.3)',
          }} />

        {/* 두루마리 본문 */}
        <div className="relative py-6 px-4"
          style={{
            background: 'linear-gradient(180deg, #f5ecd6 0%, #f8f0de 50%, #f5ecd6 100%)',
            boxShadow: '4px 0 12px rgba(100,65,10,0.12), -4px 0 12px rgba(100,65,10,0.12), inset 0 0 40px rgba(180,130,40,0.05)',
            borderLeft: '3px solid rgba(201,168,76,0.35)',
            borderRight: '3px solid rgba(201,168,76,0.35)',
          }}>
          <GoldCornerFrame className="opacity-40" />

          {/* 기능 그리드 */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="rounded-xl flex flex-col items-center text-center overflow-hidden cursor-pointer"
                style={{
                  background: feature.accentBg,
                  border: `1.5px solid ${feature.barColor}25`,
                  boxShadow: '0 2px 10px rgba(80,50,10,0.08)',
                }}
              >
                {/* 컬러 상단 바 */}
                <div className="w-full h-1.5"
                  style={{ background: feature.barColor }} />

                <div className="p-4 flex flex-col items-center">
                  {/* 아이콘 */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
                    style={{
                      background: feature.iconBg,
                      boxShadow: `0 3px 10px ${feature.barColor}20`,
                      border: `1px solid ${feature.barColor}18`,
                    }}>
                    {feature.emoji}
                  </div>

                  <h3 className="font-serif-kr font-bold text-[15px] text-[#2e1c0e] mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-[#7a5530] text-[11px] leading-relaxed font-sans whitespace-pre-line">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 두루마리 하단 롤 */}
        <div className="h-4 rounded-b-full mx-2"
          style={{
            background: 'linear-gradient(180deg, #b89038 0%, #e8cc80 60%, #c9a84c 100%)',
            boxShadow: '0 4px 8px rgba(100,65,10,0.3)',
          }} />
      </div>
    </section>
  );
}
