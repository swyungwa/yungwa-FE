import { motion } from 'framer-motion';
import { GoldCornerFrame } from '../decorations';

type CardBrowsePageProps = {
  onBackHome: () => void;
  onStartTest: () => void;
};

export default function CardBrowsePage({ onBackHome, onStartTest }: CardBrowsePageProps) {
  return (
    <section className="w-full flex-1 px-5 py-12 hanji-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto max-w-md overflow-hidden rounded-xl p-6 text-center ink-border card-shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #fff7e6 0%, #f5ecd6 100%)',
        }}
      >
        <GoldCornerFrame className="opacity-35" />

        <div className="relative z-10">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl text-3xl"
            style={{
              background: 'linear-gradient(160deg, #1e3a6e 0%, #132548 100%)',
              boxShadow: '0 6px 18px rgba(20,37,72,0.25)',
            }}
          >
            🎭
          </div>

          <h1 className="font-serif-kr text-2xl font-black text-[#2e1c0e] mb-2"
            style={{ textShadow: '1px 1px 0 rgba(201,168,76,0.3)' }}>
            카드 뽑기
          </h1>
          <p className="text-[#7a5530] text-sm leading-relaxed mb-8">
            곧 다른 인연들의 연분첩 카드가 이곳에 펼쳐질 예정이오.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBackHome}
              className="rounded-xl px-4 py-3 font-serif-kr text-sm font-bold text-[#3d2b1f] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              style={{
                border: '1.5px solid rgba(100,65,15,0.3)',
                background: 'rgba(240,220,170,0.45)',
              }}
            >
              처음으로
            </button>
            <button
              type="button"
              onClick={onStartTest}
              className="rounded-xl px-4 py-3 font-serif-kr text-sm font-bold text-[#f5e8d0] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              style={{
                background: 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)',
                boxShadow: '0 4px 14px rgba(140,18,32,0.34), 0 1px 0 rgba(255,255,255,0.12) inset',
                border: '1px solid rgba(255,255,255,0.13)',
              }}
            >
              테스트 시작
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
