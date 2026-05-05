import { useState } from 'react';
import { signup, saveSession } from '../services/auth';
import { isApiError } from '../lib/api';
import type { AuthData, Gender, LoveType } from '../types/auth';

type Props = {
  onClose: () => void;
  onSuccess: (data: AuthData) => void;
  onSwitchToLogin: () => void;
};

const LOVE_TYPE_OPTIONS: { value: LoveType; label: string }[] = [
  { value: 'YANGBAN', label: '양반 — 신중/체면' },
  { value: 'JANGGUN', label: '장군 — 직진/용맹' },
  { value: 'SATTO', label: '사또 — 주도/통제' },
  { value: 'DOLSOE', label: '돌쇠 — 헌신/순정' },
  { value: 'WANGJOK', label: '왕족 — 고귀/도도' },
  { value: 'GWANGDAE', label: '광대 — 재치/자유' },
];

const inputStyle = {
  background: 'rgba(255,255,255,0.7)',
  border: '1.5px solid rgba(160,110,40,0.3)',
  fontFamily: 'Noto Sans KR, sans-serif',
} as const;

export default function SignupModal({ onClose, onSuccess, onSwitchToLogin }: Props) {
  const [instagramId, setInstagramId] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [loveType, setLoveType] = useState<LoveType | ''>('');
  const [mbti, setMbti] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!instagramId.trim()) return '인스타그램 ID를 입력해주세요.';
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 4) return '비밀번호는 최소 4자 이상이어야 합니다.';
    if (!gender) return '성별을 선택해주세요.';
    if (introduction.length > 255) return '자기소개는 255자 이내로 입력해주세요.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      const data = await signup({
        instagramId: instagramId.trim(),
        password,
        gender: gender as Gender,
        loveTypeCode: loveType || null,
        introduction: introduction.trim() || null,
        emoji: emoji.trim() || null,
      });
      saveSession(data);
      onSuccess(data);
    } catch (err) {
      setError(isApiError(err) ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#c9a84c';
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(160,110,40,0.3)';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{ background: 'rgba(30,16,8,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 my-auto"
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
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded font-serif-kr font-black text-[#f5e8d0] text-sm mb-3"
            style={{ background: 'linear-gradient(135deg, #8b1a1a, #6b1010)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            龍
          </div>
          <h2 className="font-serif-kr font-black text-[#2e1c0e] text-xl">카드 등록</h2>
          <p className="text-[#8b6b45] text-xs mt-1">나만의 연분첩 카드를 만들어보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* 인스타그램 ID */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              인스타그램 ID <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="text"
              value={instagramId}
              onChange={e => setInstagramId(e.target.value)}
              placeholder="instagram_id"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              비밀번호 <span className="text-[#ab1729]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="최소 4자"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-2 tracking-wide">
              성별 <span className="text-[#ab1729]">*</span>
            </label>
            <div className="flex gap-2">
              {([['MALE', '남성'], ['FEMALE', '여성']] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGender(val)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-serif-kr font-bold transition-all duration-150"
                  style={{
                    background: gender === val ? 'linear-gradient(135deg, #1e50a2, #132f6e)' : 'rgba(255,255,255,0.7)',
                    color: gender === val ? '#f5e8d0' : '#3d2b1f',
                    border: gender === val ? '1.5px solid #1e50a2' : '1.5px solid rgba(160,110,40,0.3)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 연애 유형 */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              연애 유형 <span className="text-[#8b6b45] font-normal">(선택)</span>
            </label>
            <select
              value={loveType}
              onChange={e => setLoveType(e.target.value as LoveType | '')}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            >
              <option value="">유형 선택 안함</option>
              {LOVE_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* MBTI */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              MBTI <span className="text-[#8b6b45] font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={mbti}
              onChange={e => setMbti(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="INFP"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              자기소개 <span className="text-[#8b6b45] font-normal">(선택)</span>
            </label>
            <textarea
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
              placeholder="나를 한 줄로 표현한다면…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none resize-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
            <p className="text-right text-[10px] text-[#a08050] mt-0.5">
              {introduction.length} / 255
            </p>
          </div>

          {/* 대표 이모지 */}
          <div>
            <label className="block font-serif-kr text-[#3d2b1f] text-xs font-bold mb-1.5 tracking-wide">
              대표 이모지 <span className="text-[#8b6b45] font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              placeholder="🌸"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-[#2e1c0e] outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
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
            {loading ? '등록 중…' : '카드 등록하기'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(160,110,40,0.2)' }} />
          <span className="text-[#c9a84c] text-xs">◆</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(160,110,40,0.2)' }} />
        </div>

        <p className="text-center text-xs text-[#8b6b45]">
          이미 카드가 있으신가요?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-[#ab1729] underline underline-offset-2"
          >
            로그인하기
          </button>
        </p>
      </div>
    </div>
  );
}
