export default function Header() {
  return (
    <header className="w-full px-5 py-3 flex items-center justify-between sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(220,195,140,0.97) 0%, rgba(236,224,184,0.95) 100%)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(160,110,40,0.25)',
        boxShadow: '0 2px 12px rgba(100,65,15,0.12)',
      }}>
      {/* 로고 */}
      <div className="flex items-center gap-2.5">
        {/* 전통 도장 느낌 뱃지 */}
        <div className="w-8 h-8 rounded flex items-center justify-center font-serif-kr font-black text-xs text-[#f5e8d0]"
          style={{ background: 'linear-gradient(135deg, #8b1a1a, #6b1010)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          龍
        </div>
        <div>
          <p className="text-[#3d2b1f] text-sm font-bold font-serif-kr leading-tight tracking-wider">
            융과 사는 남자
          </p>
        </div>
      </div>
      {/* 로그인 버튼 */}
      <button
        className="px-4 py-1.5 font-serif-kr text-xs font-bold tracking-wider text-[#3d2b1f] rounded transition-all duration-200 hover:text-[#f5e8d0]"
        style={{
          border: '1.5px solid rgba(100,65,15,0.4)',
          background: 'rgba(240,220,170,0.5)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = '#3d2b1f';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#3d2b1f';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,220,170,0.5)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(100,65,15,0.4)';
        }}
      >
        로그인
      </button>
    </header>
  );
}
