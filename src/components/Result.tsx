import type { LoveType } from '../data/loveTest';

type CharacterProfile = {
  name: LoveType;
  romanized: string;
  keyword: string;
  description: string;
  image: string;
  color: string;
};

type ResultProps = {
  resultType: LoveType;
  profile: CharacterProfile;
  onRestart: () => void;
  onRegister: () => void;
};

export default function Result({ resultType, profile, onRestart, onRegister }: ResultProps) {
  return (
    <div className="rounded-xl bg-[#fffaf0] ink-border card-shadow-lg overflow-hidden text-center">
      <div
        className="px-5 py-6 text-white"
        style={{ background: `linear-gradient(135deg, ${profile.color} 0%, ${profile.color}dd 100%)` }}
      >
        <p className="font-mono text-xs font-bold tracking-[0.22em] text-white/65">YOUR LOVE TYPE</p>
        <h3 className="mt-2 font-serif-kr text-5xl font-black">{resultType}</h3>
        <p className="mt-1 font-mono text-xs font-bold tracking-[0.28em] text-white/60">{profile.romanized}</p>
      </div>

      <div className="px-5 py-7 sm:px-6">
        <div className="mx-auto flex h-44 max-w-[240px] items-end justify-center overflow-hidden rounded-xl border border-[#d4b87a] bg-[#f3e2b9]">
          <img src={profile.image} alt={resultType} className="h-full w-full object-contain object-bottom" />
        </div>

        <p className="mt-5 inline-flex rounded-full px-3 py-1 text-sm font-black" style={{ background: `${profile.color}18`, color: profile.color }}>
          {profile.keyword}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm font-bold leading-relaxed text-[#5a3e25]">
          {profile.description}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-5 py-3 text-sm font-black text-[#4b301b] transition hover:-translate-y-0.5 hover:bg-[#fff0d0] focus:outline-none focus:ring-2 focus:ring-[#2e1c0e]/20"
          >
            다시 테스트하기
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="rounded-lg bg-[#2e1c0e] px-5 py-3 text-sm font-black text-[#f8e8b4] transition hover:-translate-y-0.5 hover:bg-[#4a2d16] focus:outline-none focus:ring-2 focus:ring-[#2e1c0e]/30"
          >
            카드 등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
