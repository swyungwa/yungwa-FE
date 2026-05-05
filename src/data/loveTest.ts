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
  imageUrl?: string;
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
    question: '북적이는 장터에서 처음 본, 마음에 드는 사람과 눈이 마주쳤다면?',
    answers: [
      { text: '"부끄럽구려..." 부채로 얼굴을 가리고 슬쩍 바라본다', types: ['yangban', 'satto'] },
      { text: '"거기 잠깐 멈추시오!" 사람들 사이를 헤치고 다가간다', types: ['general', 'clown'] },
    ],
    imageUrl: '/questions/question1.png',
  },
  {
    id: 2,
    question: '연인이 밤늦게 "달이 참 곱소이다"라는 편지를 보냈다면?',
    answers: [
      { text: '"그대 눈빛이 달보다 더 빛나오..." 정성껏 답장을 쓴다', types: ['royal', 'yangban'] },
      { text: '"달 떴으면 이제 잘 시간이오" 짧고 현실적으로 답한다', types: ['satto', 'general'] },
    ],
    imageUrl: '/questions/question2.png',
  },
  {
    id: 3,
    question: '마음에 둔 사람이 관아 앞에서 크게 혼나 울먹이고 있다면?',
    answers: [
      { text: '"오죽했겠소..." 말없이 곁에 앉아 다독인다', types: ['dolsoe', 'royal'] },
      { text: '"어찌하여 그리 되었소?" 자초지종을 차분히 묻는다', types: ['satto', 'clown'] },
    ],
    imageUrl: '/questions/question3.png',
  },
  {
    id: 4,
    question: '연인과 주막에서 작은 오해로 말다툼이 벌어졌다면?',
    answers: [
      { text: '"잠시 바람 좀 쐬고 다시 이야기합시다" 한 걸음 물러난다', types: ['yangban', 'dolsoe'] },
      { text: '"지금 당장 결판을 냅시다!" 그 자리에서 끝을 보려 한다', types: ['general', 'satto'] },
    ],
    imageUrl: '/questions/question4.png',
  },
  {
    id: 5,
    question: '연인이 "이 마을을 떠나 둘이 새로 시작할까요?"라고 한다면?',
    answers: [
      { text: '"어찌 먹고 살 것이오?" 집, 돈, 길부터 따져본다', types: ['satto', 'yangban'] },
      { text: '"짐 싸시오. 내가 책임지겠소" 망설임 없이 함께 떠난다', types: ['general', 'royal'] },
    ],
    imageUrl: '/questions/question5.png',
  },
  {
    id: 6,
    question: '잔칫날, 연인이 낯선 이와 웃으며 이야기를 나누고 있다면?',
    answers: [
      { text: '겉으로는 웃지만 속으로는 조용히 거리를 둔다', types: ['yangban', 'satto'] },
      { text: '"이분은 뉘시오?" 자연스럽게 끼어들어 분위기를 살핀다', types: ['clown', 'general'] },
    ],
    imageUrl: '/questions/question6.png',
  },
  {
    id: 7,
    question: '새벽녘, 연인이 열이 올라 병상에 누워 있다면?',
    answers: [
      { text: '죽을 쑤고 물수건을 갈아주며 밤새 곁을 지킨다', types: ['dolsoe', 'royal'] },
      { text: '"이겨내시오. 내가 여기 있소" 곁에서 씩씩하게 응원한다', types: ['clown', 'general'] },
    ],
    imageUrl: '/questions/question7.png',
  },
  {
    id: 8,
    question: '나루터 데이트 중 갑자기 소나기가 쏟아진다면?',
    answers: [
      { text: '"이 또한 낭만 아니겠소?" 비를 맞으며 함께 웃는다', types: ['clown', 'royal'] },
      { text: '아무 말 없이 우산을 기울여 상대 쪽으로 씌워준다', types: ['dolsoe', 'yangban'] },
    ],
    imageUrl: '/questions/question8.png',
  },
  {
    id: 9,
    question: '꽃등 축제 마지막 밤, 고백해야 할 순간이 왔다면?',
    answers: [
      { text: '"소인은 그대를 오래도록 연모하였소..." 조심스레 마음을 전한다', types: ['yangban', 'dolsoe'] },
      { text: '"내 사람이 되어주시오!" 망설임 없이 단번에 고백한다', types: ['general', 'royal'] },
    ],
    imageUrl: '/questions/question9.png',
  },
  {
    id: 10,
    question: '약속에 늦어, 연인이 아무 말 없이 삐쳐 있다면?',
    answers: [
      { text: '"내가 부족하였소..." 문밖에서 먼저 사과한다', types: ['dolsoe', 'clown'] },
      { text: '"무엇이 서운했는지 말해보시오" 차분히 풀어보려 한다', types: ['satto', 'royal'] },
    ],
    imageUrl: '/questions/question10.png',
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

// 돌쇠/광대는 6번 등장으로 나머지(7번)보다 적어 최대 점수가 낮아지는 문제를 보정:
// 돌쇠/광대 +7점, 나머지 +6점 → 모든 유형 최대 42점으로 동일
const TYPE_WEIGHTS: Record<LoveType, number> = {
  satto: 6,
  general: 6,
  yangban: 6,
  dolsoe: 7,
  royal: 6,
  clown: 7,
};

export const calculateNextScores = (scores: ScoreMap, answer: Answer): ScoreMap => {
  const nextScores = { ...scores };

  answer.types.forEach((type) => {
    nextScores[type] += TYPE_WEIGHTS[type];
  });

  return nextScores;
};

const balancedTieBreakOrder: LoveType[] = ['dolsoe', 'yangban', 'satto', 'general', 'royal', 'clown'];

export const getTopType = (scores: ScoreMap, lastSelectedTypes: LoveType[] = []): LoveType => {
  const highestScore = Math.max(...types.map((type) => scores[type]));
  const tiedTypes = types.filter((type) => scores[type] === highestScore);

  if (tiedTypes.length === 1) {
    return tiedTypes[0];
  }

  const lastSelectedWinner = lastSelectedTypes.find((type) => tiedTypes.includes(type));
  const balancedWinner = balancedTieBreakOrder.find((type) => tiedTypes.includes(type));

  return balancedWinner ?? lastSelectedWinner ?? tiedTypes[0];
};
