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

      <div className="flex items-center justify-between px-6 py-5 max-w-lg mx-auto">
        {/* 로고 + 슬로건 */}
        <div className="flex items-center gap-3">
          {/* 전통 도장 */}
          <div className="w-11 h-11 rounded flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8b1a1a 0%, #5a0e0e 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(201,168,76,0.4)',
            }}>
            <span className="font-serif-kr font-black text-[#f5d888] text-base leading-none">龍</span>
            <span className="font-serif-kr text-[#f5d888]/60 text-[8px] leading-none">男</span>
          </div>
          <div>
            <p className="font-serif-kr font-bold text-[#f5e0b0] text-sm leading-tight">
              융과 사는 남자
            </p>
            <p className="text-[#a08050] text-[10px] tracking-wider mt-0.5">
              좋은 인연을 연결해드립니다.
            </p>
          </div>
        </div>

        {/* 저작권 */}
        <div className="text-right">
          <p className="text-[#a08050] text-[10px] leading-relaxed">
            © 2026 ConversonseSoftware.<br />All rights reserved.
          </p>
        </div>
      </div>

      {/* 하단 금 장식선 */}
      <div className="h-px mx-6"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      <div className="text-center py-2">
        <span className="text-[#c9a84c]/40 text-xs font-serif-kr tracking-[0.3em]">龍 · 男 · 緣</span>
      </div>
    </footer>
  );
}
