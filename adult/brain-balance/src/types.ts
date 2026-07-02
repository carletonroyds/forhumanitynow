export type ChoiceType = 'emotional' | 'logical' | 'balanced';

export interface Choice {
  type: ChoiceType;
  text: string;
}

export interface ABCBreakdown {
  a: string;
  b: string;
  c: string;
}

export interface Feedback {
  emotionSignal: string;
  logicCheck: string;
  balancedInsight: string;
  abc: ABCBreakdown;
}

export interface Scenario {
  id: number;
  title: string;
  text: string;
  biasName: string;
  biasDescription: string;
  choices: Choice[];
  feedback: Feedback;
  bgImage: string;
}
