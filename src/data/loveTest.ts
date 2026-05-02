export const types = ['사또', '장군', '양반', '돌쇠', '왕족', '광대'] as const;

export type LoveType = (typeof types)[number];

export type QuestionOption = {
  text: string;
  type: LoveType[];
};

export type LoveQuestion = {
  id: number;
  question: string;
  options: QuestionOption[];
};

export type ScoreMap = Record<LoveType, number>;

export const questions: LoveQuestion[] = [
  {
    id: 1,
    question: '북적이는 장터에서 내 마음에 쏙 드는 이를 발견했다면?',
    options: [
      { text: '"부끄럽구려..." 헛기침하며 슬쩍 눈치만 본다.', type: ['양반', '사또'] },
      { text: '"잠깐 멈추시오!" 대뜸 앞을 가로막고 통성명을 청한다.', type: ['장군', '광대'] },
    ],
  },
  {
    id: 2,
    question: '그 사람이 밤늦게 "오늘 달이 참 예쁘군요"라고 편지를 보냈다면?',
    options: [
      { text: '"그대의 눈동자가 달보다 더 빛나오." 간지러운 답장을 보낸다.', type: ['왕족', '양반'] },
      { text: '"달이 떴으니 잠이나 자야지, 웬 헛소리요?" 현실적으로 답한다.', type: ['사또', '장군'] },
    ],
  },
  {
    id: 3,
    question: '그 사람이 "오늘 일터에서 크게 혼나 속상하오"라며 울먹인다면?',
    options: [
      { text: '"오죽했겠소... 내 마음이 다 아프구려." 일단 토닥여준다.', type: ['돌쇠', '왕족'] },
      { text: '"대체 왜 혼난 거요? 그대가 뭘 잘못했소?" 이유부터 따진다.', type: ['사또', '장군'] },
    ],
  },
  {
    id: 4,
    question: '의견이 안 맞아 말다툼을 하게 되었다면?',
    options: [
      { text: '"나중에 얘기합시다." 일단 자리를 피하고 혼자 생각한다.', type: ['양반', '돌쇠'] },
      { text: '"지금 당장 시시비비를 가립시다!" 끝장을 봐야 직성이 풀린다.', type: ['장군', '사또'] },
    ],
  },
  {
    id: 5,
    question: '그 사람이 "우리 다 버리고 멀리 도망가서 살까요?"라고 묻는다면?',
    options: [
      { text: '"가서 뭐 먹고 살려고 그러오?" 현실적인 걱정부터 한다.', type: ['사또', '양반'] },
      { text: '"짐 싸시오! 내가 당신 하나 못 먹여 살리겠소?"', type: ['장군', '왕족'] },
    ],
  },
  {
    id: 6,
    question: '그 사람이 다른 이성과 웃으며 대화하는 걸 목격했다면?',
    options: [
      { text: '겉으론 웃지만, 속으로는 이미 이별의 준비를 한다.', type: ['양반', '사또'] },
      { text: '당장 옆에 가서 팔짱을 끼고 "이분은 뉘시오?" 하며 눈치를 준다.', type: ['장군', '광대'] },
    ],
  },
];

export const resultPriority: LoveType[] = ['장군', '사또', '왕족', '양반', '돌쇠', '광대'];

export const createInitialScores = (): ScoreMap =>
  types.reduce(
    (scores, type) => ({
      ...scores,
      [type]: 0,
    }),
    {} as ScoreMap,
  );

export const getTopType = (scores: ScoreMap): LoveType =>
  resultPriority.reduce((winner, type) => {
    if (scores[type] > scores[winner]) {
      return type;
    }

    return winner;
  }, resultPriority[0]);

