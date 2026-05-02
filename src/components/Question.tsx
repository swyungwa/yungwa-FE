import type { LoveQuestion, QuestionOption } from '../data/loveTest';

type QuestionProps = {
  question: LoveQuestion;
  currentIndex: number;
  totalCount: number;
  onSelect: (option: QuestionOption) => void;
};

export default function Question({ question, currentIndex, totalCount, onSelect }: QuestionProps) {
  return (
    <div className="rounded-xl bg-[#fffaf0] ink-border card-shadow-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#d8bd78]/60 bg-[#f3e2b9] px-5 py-4">
        <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#9b742f]">
          QUESTION {String(question.id).padStart(2, '0')}
        </span>
        <span className="rounded-full bg-[#2e1c0e] px-3 py-1 text-sm font-bold text-[#f8e8b4]">
          {currentIndex + 1} / {totalCount}
        </span>
      </div>

      <div className="px-5 py-7 sm:px-6">
        <h3 className="font-serif-kr text-2xl font-black leading-snug text-[#2e1c0e]">
          {question.question}
        </h3>

        <div className="mt-7 grid gap-3">
          {question.options.map((option) => (
            <button
              key={option.text}
              type="button"
              onClick={() => onSelect(option)}
              className="group rounded-lg border border-[#d4b87a] bg-[#fffdf7] px-4 py-4 text-left text-sm font-bold leading-relaxed text-[#4b301b] transition duration-200 hover:-translate-y-0.5 hover:border-[#ab1729] hover:bg-[#fff3e0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ab1729]/35"
            >
              <span className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ead097] text-xs text-[#6b421d] transition group-hover:bg-[#ab1729] group-hover:text-white">
                  선택
                </span>
                <span>{option.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

