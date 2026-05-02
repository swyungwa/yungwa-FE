import { useState } from 'react';
import { login, saveSession } from '../services/auth';
import { isApiError } from '../lib/api';
import type { AuthData } from '../types/auth';

type Props = {
  onClose: () => void;
  onSuccess: (data: AuthData) => void;
};

export default function LoginModal({ onClose, onSuccess }: Props) {
  const [instagramId, setInstagramId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!instagramId.trim()) return '인스타그램 ID를 입력해주세요.';
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 4) return '비밀번호는 최소 4자 이상이어야 합니다.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      const data = await login({ instagramId: instagramId.trim(), password });
      saveSession(data);
      onSuccess(data);
    } catch (err) {
      setError(isApiError(err) ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(30,16,8,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{
          background: 'linear-gradient(180deg, #f8f0de 0%, #f2e8d0 100%)',
          border: '2px solid rgba(201,168,76,0.5)',
          boxShadow: '0 20px 60px rgba(30,16,8,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 상단 금 장식선 */}
        <div className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-[#7a5530] hover:text-[#2e1c0e] transition-colors"
          style={{ background: 'rgba(201,168,76,0.15)' }}
        >
          ✕
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded font-serif-kr font-black text-[#f5e8d0] text-sm mb-3"
            style={{ background: 'linear-gradient(135deg, #8b1a1a, #6b1010)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            龍
          </div>
          <h2 className="font-serif-kr font-black text-[#2e1c0e] text-xl">로그인</h2>
          <p className="text-[#8b6b45] text-xs mt-1">인연을 확인하러 오셨군요</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              인스타그램 ID
            </label>
            <input
              type="text"
              value={instagramId}
              onChange={e => setInstagramId(e.target.value)}
              placeholder="instagram_id"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(160,110,40,0.3)',
                fontFamily: 'Noto Sans KR, sans-serif',
              }}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')}
              onBlur={e => (e.target.style.borderColor = 'rgba(160,110,40,0.3)')}
            />
          </div>

          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="최소 4자"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(160,110,40,0.3)',
                fontFamily: 'Noto Sans KR, sans-serif',
              }}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')}
              onBlur={e => (e.target.style.borderColor = 'rgba(160,110,40,0.3)')}
            />
          </div>

          {error && (
            <p className="text-[#ab1729] text-xs text-center py-2 px-3 rounded-lg"
              style={{ background: 'rgba(171,23,41,0.08)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3 rounded-xl font-serif-kr font-bold text-sm text-[#f5e8d0] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{
              background: 'linear-gradient(160deg, #c41e32 0%, #8b1220 100%)',
              boxShadow: '0 4px 16px rgba(140,18,32,0.4)',
            }}
          >
            {loading ? '확인 중…' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(160,110,40,0.2)' }} />
          <span className="text-[#c9a84c] text-xs">◆</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(160,110,40,0.2)' }} />
        </div>

        <p className="text-center text-xs text-[#8b6b45]">
          아직 카드가 없으신가요? 테스트를 먼저 진행해주세요.
        </p>
      </div>
    </div>
  );
}
