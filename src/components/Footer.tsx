export default function Footer() {
  return (
    <footer className="w-full"
      style={{
        background: 'linear-gradient(180deg, #2e1c0e 0%, #1e1008 100%)',
        borderTop: '3px solid #c9a84c',
      }}>
      {/* 금색 상단 장식 줄 */}
      <div className="h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #c9a84c80, #c9a84c, #c9a84c80, transparent)' }} />

      <div className="flex items-center justify-between gap-4 px-6 py-5 max-w-lg mx-auto">
        <p className="text-[#c9a84c] text-xs font-bold tracking-wider">
          @mju_build
        </p>
        <p className="text-right text-[#a08050] text-[10px] leading-relaxed">
          © 2026 ConversonseSoftware.<br />All rights reserved.
        </p>
      </div>
    </footer>
  );
}
