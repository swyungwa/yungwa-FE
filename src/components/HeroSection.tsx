import { motion } from 'framer-motion';
import { PlumBranch, HanokRoofDecor, CloudWaveDivider, CloudCluster, GoldCornerFrame, CraneDecor } from '../decorations';

type Props = {
  onTestClick: () => void;
  onBrowseClick: () => void;
};

export default function HeroSection({ onTestClick, onBrowseClick }: Props) {
  return (
    <section className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(175deg, #dfc88a 0%, #e8d4a0 20%, #f0e2c2 55%, #ece0b8 100%)',
        minHeight: '540px',
      }}>

      {/* ── 배경 격자 패턴 ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(160,110,40,0.04) 0, rgba(160,110,40,0.04) 1px, transparent 1px, transparent 28px)',
        }} />

      {/* ── 좌상단 매화 가지 ── */}
      <div className="absolute -top-4 -left-4 pointer-events-none opacity-60">
        <PlumBranch />
      </div>

      {/* ── 우상단 한옥 처마 ── */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-55">
        <HanokRoofDecor />
      </div>

      {/* ── 우상단 두루미 ── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-16 right-2 pointer-events-none"
        style={{ opacity: 0.82 }}
      >
        <CraneDecor />
      </motion.div>

      {/* ── 구름 장식 ── */}
      <div className="absolute top-14 right-8 pointer-events-none opacity-70">
        <CloudCluster />
      </div>
      <div className="absolute top-32 left-28 pointer-events-none opacity-40" style={{ transform: 'scale(0.7)' }}>
        <CloudCluster />
      </div>

      {/* ── 금색 코너 프레임 ── */}
      <GoldCornerFrame className="opacity-50" />

      {/* ── 메인 콘텐츠 ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-14 pb-20">

        {/* 소제목 배너 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="text-[#c9a84c] text-sm">◈</span>
          <p className="font-serif-kr text-[#7a5428] text-xs sm:text-sm tracking-[0.2em] font-medium">
            조선시대 연애 유형으로 만나는 인연
          </p>
          <span className="text-[#c9a84c] text-sm">◈</span>
        </motion.div>

        {/* 메인 타이틀 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-serif-kr font-black text-[#2e1c0e] leading-none mb-8"
            style={{
              fontSize: 'clamp(48px, 12vw, 76px)',
              textShadow: '3px 3px 0 rgba(201,168,76,0.25), 1px 1px 0 rgba(201,168,76,0.5)',
              letterSpacing: '-0.02em',
            }}>
            융과 사는 남자
          </h1>
        </motion.div>

        {/* 설명문 */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55 }}
          className="font-sans text-[#6b4825] text-sm sm:text-base leading-relaxed mb-10 max-w-xs"
          style={{ textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}
        >
          연애 유형 테스트로 나만의 카드를 만들고,<br />
          인연의 인스타그램 ID를 확인해보세요!
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative z-20 flex flex-col sm:flex-row gap-3 w-full max-w-[360px]"
        >
          {/* 테스트 시작 — 적색 */}
          <button
            type="button"
            onClick={onTestClick}
            className="flex-1 flex items-center justify-center gap-2 font-serif-kr font-bold text-base text-[#f5e8d0] py-5 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            style={{
              background: 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)',
              boxShadow: '0 6px 20px rgba(140,18,32,0.5), 0 1px 0 rgba(255,255,255,0.15) inset',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            <span className="text-lg">📜</span>
            테스트 시작하기
          </button>
          {/* 카드 둘러보기 — 남색 */}
          <button
            type="button"
            onClick={onBrowseClick}
            className="flex-1 flex items-center justify-center gap-2 font-serif-kr font-bold text-base text-[#f5e8d0] py-5 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            style={{
              background: 'linear-gradient(160deg, #1e3a6e 0%, #132548 100%)',
              boxShadow: '0 6px 20px rgba(20,37,72,0.45), 0 1px 0 rgba(255,255,255,0.1) inset',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
            <span className="text-lg">🪭</span>
            카드 둘러보기
          </button>
        </motion.div>
      </div>

      {/* ── 하단 구름 물결 전환 ── */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <CloudWaveDivider fill="#ece0b8" />
      </div>
    </section>
  );
}
