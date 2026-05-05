import type { LoveType } from '../data/loveTest';
import { compatibleLoveTypes } from '../data/loveCompatibility';

type CharacterProfile = {
  name: string;
  romanized: string;
  keyword: string;
  description: string;
  image: string;
  color: string;
};

type ResultProps = {
  type: LoveType;
  profile: CharacterProfile;
  onGoHome: () => void;
  onRestart: () => void;
};

export default function Result({ type, profile, onGoHome, onRestart }: ResultProps) {
  const recommendations = compatibleLoveTypes[type];

  return (
    <div className="text-center">
      <article className="rounded-xl bg-[#fffaf0] px-5 py-7 ink-border card-shadow-lg sm:px-6">
        <p className="font-serif-kr text-base font-black text-[#8a6426]">나의 연애 유형</p>
        <h3 className="mt-2 font-serif-kr text-5xl font-black leading-tight text-[#2e1c0e]">
          {profile.name}
        </h3>

        <div className="mx-auto mt-5 flex h-44 max-w-[240px] items-end justify-center overflow-hidden rounded-xl border border-[#d4b87a] bg-[#f3e2b9]">
          <img src={profile.image} alt={profile.name} className="h-full w-full object-contain object-bottom" />
        </div>

        <p
          className="mt-5 inline-flex rounded-full px-3 py-1 text-sm font-black"
          style={{ background: `${profile.color}18`, color: profile.color }}
        >
          {profile.keyword}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm font-bold leading-relaxed text-[#5a3e25]">
          {profile.description}
        </p>
      </article>

      <section className="mt-8 rounded-xl bg-[#fff7e6]/90 px-4 py-5 ink-border card-shadow sm:px-5">
        <h4 className="font-serif-kr text-xl font-black text-[#2e1c0e]">잘 맞는 유형</h4>
        <div className="mt-4 grid gap-3">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.type}
              className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-[#d4b87a] bg-[#fffaf0] p-3 text-left"
            >
              <div className="flex h-[72px] w-[72px] items-end justify-center overflow-hidden rounded-lg bg-[#f1ddb0]">
                <img
                  src={recommendation.image}
                  alt={recommendation.name}
                  className="h-full w-full object-contain object-bottom"
                />
              </div>
              <div className="min-w-0">
                <p className="font-serif-kr text-lg font-black leading-tight text-[#2e1c0e]">
                  {recommendation.name}
                </p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-[#7a5530]">
                  {recommendation.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-7">
        <p className="font-serif-kr text-base font-black leading-relaxed text-[#5a3e25]">
          그대와 잘 맞는 인연이 궁금하다면
          <br />
          카드를 만들어 확인해보시오
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-3 text-sm font-black text-[#4b301b] transition hover:-translate-y-0.5 hover:bg-[#fff0d0] focus:outline-none focus:ring-2 focus:ring-[#2e1c0e]/20"
        >
          다시 테스트하기
        </button>
        <button
          type="button"
          onClick={onGoHome}
          className="rounded-lg border border-[#d4b87a] bg-[#fff7e6] px-4 py-3 text-sm font-black text-[#4b301b] transition hover:-translate-y-0.5 hover:bg-[#fff0d0] focus:outline-none focus:ring-2 focus:ring-[#2e1c0e]/20"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
