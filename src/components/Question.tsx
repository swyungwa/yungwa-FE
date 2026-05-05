import type { Answer, Question as LoveQuestion } from '../data/loveTest';

type QuestionProps = {
  question: LoveQuestion;
  onSelect: (answer: Answer) => void;
};

export default function Question({ question, onSelect }: QuestionProps) {
  return (
    <div className="rounded-xl bg-[#fffaf0] ink-border card-shadow-lg overflow-hidden">
      <div className="px-5 py-7 sm:px-6">
        <h3 className="font-serif-kr text-2xl font-black leading-snug text-[#2e1c0e]">
          {question.question}
        </h3>

        <div className="mt-7 grid gap-3">
          {question.answers.map((answer) => (
            <button
              key={answer.text}
              type="button"
              onClick={() => onSelect(answer)}
              className="group rounded-lg border border-[#d4b87a] bg-[#fffdf7] px-4 py-4 text-left text-sm font-bold leading-relaxed text-[#4b301b] transition duration-200 hover:-translate-y-0.5 hover:border-[#ab1729] hover:bg-[#fff3e0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ab1729]/35"
            >
              <span className="flex items-start gap-3">
                <span>{answer.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
