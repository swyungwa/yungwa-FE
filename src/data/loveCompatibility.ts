import type { LoveType } from './loveTest';

export type CompatibleLoveType = {
  type: LoveType;
  name: string;
  image: string;
  summary: string;
  detail: string;
};

export const compatibleLoveTypes: Record<LoveType, CompatibleLoveType[]> = {
  general: [
    {
      type: 'royal',
      name: '왕족',
      image: '/characters/wangjok.png',
      summary: '직진의 기세에 품격 있는 여유를 더해주는 인연',
      detail: '장군의 빠른 결단과 왕족의 우아한 감각이 만나면 관계가 한층 당당해집니다. 장군은 마음을 숨기지 않고, 왕족은 그 마음을 자연스럽게 받아주며 균형을 잡아줍니다.',
    },
    {
      type: 'dolsoe',
      name: '돌쇠',
      image: '/characters/dolsoe.png',
      summary: '뜨거운 추진력 옆을 든든하게 지켜주는 짝',
      detail: '장군이 앞장서서 길을 열면 돌쇠는 묵묵히 곁을 지켜주는 조합입니다. 서로의 진심이 행동으로 드러나기 때문에 신뢰가 빠르게 쌓입니다.',
    },
  ],

  satto: [
    {
      type: 'yangban',
      name: '양반',
      image: '/characters/yangban.png',
      summary: '계획적인 마음과 신중한 온도가 잘 맞는 인연',
      detail: '사또의 주도적인 리듬에 양반의 예의와 신중함이 더해지면 안정적인 관계가 됩니다. 둘 다 기준이 분명해 천천히 맞춰가면 오래 단단해집니다.',
    },
    {
      type: 'royal',
      name: '왕족',
      image: '/characters/wangjok.png',
      summary: '분명한 리드와 고운 자존감이 어울리는 짝',
      detail: '사또는 관계의 방향을 잡고, 왕족은 분위기에 품격을 더합니다. 서로의 자존심을 존중하면 주도권 다툼보다 협력이 먼저 보입니다.',
    },
  ],

  yangban: [
    {
      type: 'satto',
      name: '사또',
      image: '/characters/satto.png',
      summary: '망설임에 선명한 방향을 잡아주는 인연',
      detail: '양반이 천천히 마음을 살피는 동안 사또는 관계의 다음 걸음을 제안합니다. 속도 차이를 배려하면 조심스러움과 추진력이 좋은 균형을 이룹니다.',
    },
    {
      type: 'dolsoe',
      name: '돌쇠',
      image: '/characters/dolsoe.png',
      summary: '섬세한 체면을 다정한 행동으로 녹여주는 짝',
      detail: '양반의 조심스러운 표현을 돌쇠가 꾸준한 행동으로 받아줍니다. 말보다 태도가 중요한 순간에 서로의 마음을 편안하게 확인할 수 있습니다.',
    },
  ],

  dolsoe: [
    {
      type: 'general',
      name: '장군',
      image: '/characters/janggun.png',
      summary: '헌신적인 마음에 용기 있는 확신을 더해주는 인연',
      detail: '돌쇠의 한결같은 애정에 장군의 솔직한 표현이 더해집니다. 돌쇠가 참기만 하지 않고, 장군이 앞서가기만 하지 않으면 서로를 크게 북돋웁니다.',
    },
    {
      type: 'yangban',
      name: '양반',
      image: '/characters/yangban.png',
      summary: '묵묵한 정성과 예의 바른 다정함이 닮은 짝',
      detail: '돌쇠의 순정과 양반의 배려는 모두 오래 보는 마음에서 나옵니다. 서두르지 않고 신뢰를 쌓을수록 관계가 조용히 깊어집니다.',
    },
  ],

  royal: [
    {
      type: 'general',
      name: '장군',
      image: '/characters/janggun.png',
      summary: '도도한 마음에도 곧게 다가와주는 인연',
      detail: '왕족의 여유와 장군의 직진력이 만나면 감정 표현이 선명해집니다. 왕족은 사랑받는 기쁨을, 장군은 인정받는 기쁨을 크게 느낄 수 있습니다.',
    },
    {
      type: 'satto',
      name: '사또',
      image: '/characters/satto.png',
      summary: '품격 있는 거리감과 확실한 리드가 맞는 짝',
      detail: '왕족은 관계의 품위를 지키고, 사또는 현실적인 방향을 잡아줍니다. 서로를 통제하려 하기보다 존중하면 근사한 조합이 됩니다.',
    },
  ],

  clown: [
    {
      type: 'dolsoe',
      name: '돌쇠',
      image: '/characters/dolsoe.png',
      summary: '자유로운 웃음을 따뜻하게 받아주는 짝',
      detail: '광대의 재치와 돌쇠의 다정함은 분위기를 편안하게 만듭니다. 광대가 장난 속 진심을 보여주고, 돌쇠가 부담 없이 받아주면 관계가 더욱 밝아집니다.',
    },
    {
      type: 'general',
      name: '장군',
      image: '/characters/janggun.png',
      summary: '유쾌한 에너지에 시원한 직진을 더하는 인연',
      detail: '광대가 관계를 가볍고 즐겁게 풀어내면 장군은 망설임 없이 마음을 표현합니다. 웃음과 용기가 함께 있어 지루할 틈이 적은 조합입니다.',
    },
  ],
};