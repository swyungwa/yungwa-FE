export const types = ['satto', 'general', 'yangban', 'dolsoe', 'royal', 'clown'] as const;

export type LoveType = (typeof types)[number];

export type Answer = {
  text: string;
  types: LoveType[];
};

export type Question = {
  id: number;
  question: string;
  answers: Answer[];
};

export type ScoreMap = Record<LoveType, number>;

export const loveTypeLabels: Record<LoveType, string> = {
  satto: '사또',
  general: '장군',
  yangban: '양반',
  dolsoe: '돌쇠',
  royal: '왕족',
  clown: '광대',
};

export const questions: Question[] = [
  {
    id: 1,
    question: '장터에서 마음에 드는 이를 발견하였다면?',
    answers: [
      { text: '"부끄럽구려..." 슬쩍 바라보기만 한다', types: ['yangban', 'satto'] },
      { text: '"거기 잠깐 멈추시오!" 곧장 다가간다', types: ['general', 'clown'] },
    ],
  },
  {
    id: 2,
    question: '"달이 참 곱소이다"라는 편지를 받았다면?',
    answers: [
      { text: '"그대 눈이 더 빛나오..." 감성 답장', types: ['royal', 'yangban'] },
      { text: '"달 떴으면 잘 시간이오" 현실 답장', types: ['satto', 'general'] },
    ],
  },
  {
    id: 3,
    question: '그 사람이 크게 혼나 속상해한다면?',
    answers: [
      { text: '"오죽했겠소..." 곁에서 다독인다', types: ['dolsoe', 'royal'] },
      { text: '"어찌하여 그리 되었소?" 이유를 묻는다', types: ['satto', 'clown'] },
    ],
  },
  {
    id: 4,
    question: '말다툼이 벌어졌다면?',
    answers: [
      { text: '"잠시 물러나 생각해 봅시다"', types: ['yangban', 'dolsoe'] },
      { text: '"지금 당장 결판을 냅시다!"', types: ['general', 'satto'] },
    ],
  },
  {
    id: 5,
    question: '"모든 걸 버리고 떠날까요?"라 한다면?',
    answers: [
      { text: '"어찌 먹고 살 것이오?" 현실부터 따진다', types: ['satto', 'yangban'] },
      { text: '"짐 싸시오. 내가 책임지겠소"', types: ['general', 'royal'] },
    ],
  },
  {
    id: 6,
    question: '연인이 다른 이와 웃고 있다면?',
    answers: [
      { text: '겉으로는 웃되 속으로 거리를 둔다', types: ['yangban', 'satto'] },
      { text: '"이분은 뉘시오?" 자연스럽게 끼어든다', types: ['clown', 'general'] },
    ],
  },
  {
    id: 7,
    question: '그 사람이 병상에 누워 있다면?',
    answers: [
      { text: '죽을 쑤고 밤새 곁을 지킨다', types: ['dolsoe', 'royal'] },
      { text: '"이겨내시오. 내가 지켜보고 있소"', types: ['general', 'dolsoe'] },
    ],
  },
  {
    id: 8,
    question: '데이트 중 갑자기 비가 내린다면?',
    answers: [
      { text: '"이 또한 낭만 아니겠소?" 함께 웃는다', types: ['clown', 'royal'] },
      { text: '말없이 우산을 씌워준다', types: ['yangban', 'royal'] },
    ],
  },
  {
    id: 9,
    question: '고백을 해야 하는 순간이라면?',
    answers: [
      { text: '"소인은 그대를 오래도록 연모하였소..."', types: ['yangban', 'dolsoe'] },
      { text: '"내 사람이 되어주시오!" 단번에 직진', types: ['general', 'royal'] },
    ],
  },
  {
    id: 10,
    question: '연인이 삐쳐 마음을 닫았다면?',
    answers: [
      { text: '"내가 부족하였소..." 먼저 다가간다', types: ['dolsoe', 'clown'] },
      { text: '"무엇이 문제인지 말해보시오" 차분히 풀려 한다', types: ['satto', 'clown'] },
    ],
  },
];

export const createInitialScores = (): ScoreMap =>
  types.reduce(
    (scores, type) => ({
      ...scores,
      [type]: 0,
    }),
    {} as ScoreMap,
  );

export const calculateNextScores = (scores: ScoreMap, answer: Answer): ScoreMap => {
  const nextScores = { ...scores };

  answer.types.forEach((type) => {
    nextScores[type] += 1;
  });

  return nextScores;
};

export const getTopType = (scores: ScoreMap, lastSelectedTypes: LoveType[] = []): LoveType => {
  const highestScore = Math.max(...types.map((type) => scores[type]));
  const tiedTypes = types.filter((type) => scores[type] === highestScore);

  if (tiedTypes.length === 1) {
    return tiedTypes[0];
  }

  const lastSelectedWinner = lastSelectedTypes.find((type) => tiedTypes.includes(type));

  return lastSelectedWinner ?? tiedTypes[Math.floor(Math.random() * tiedTypes.length)];
};
