
import type { Question, ScoreTier } from './types';

export const questions: Question[] = [
  {
    id: 1,
    title: "Dopamine Hijack",
    statement: "I set time limits for social media and regularly take breaks to avoid addictive scrolling."
  },
  {
    id: 2,
    title: "Fear & Anger Amplification",
    statement: "I pause and check facts before reacting to emotionally charged content online."
  },
  {
    id: 3,
    title: "Social Comparison Trap",
    statement: "I focus on gratitude and my own progress instead of comparing myself to others online."
  },
  {
    id: 4,
    title: "Authority Bias",
    statement: "I verify the expertise and credentials of influencers or 'experts' before trusting their content."
  },
  {
    id: 5,
    title: "Scarcity & Urgency Triggers",
    statement: "I pause and reflect before acting on urgency-driven social media messages like flash sales or countdowns."
  },
  {
    id: 6,
    title: "Deepfakes & Misinformation",
    statement: "I critically examine viral content, use fact-checking tools, and ask 'Who benefits from this?'"
  },
  {
    id: 7,
    title: "Repetition Effect",
    statement: "I recognize when repeated content may be manipulating my perception of truth and question it."
  },
  {
    id: 8,
    title: "Confirmation Bias",
    statement: "I regularly challenge my own beliefs by seeking out opposing information."
  },
  {
    id: 9,
    title: "Hijacking Mirror Neurons",
    statement: "Before joining viral trends or mimicry, I ask myself if they reflect my values and real intentions."
  },
  {
    id: 10,
    title: "Them-Us Bias",
    statement: "I intentionally follow diverse viewpoints and try to understand opposing perspectives."
  }
];

export const scoringGuide: ScoreTier[] = [
  {
    range: "80-100",
    label: "Resilient",
    description: "You are strongly aware and actively empower yourself against social media manipulation.",
    minScore: 80,
    color: "from-emerald-400 to-teal-500"
  },
  {
    range: "50-79",
    label: "Aware",
    description: "You're moderately aware, with real opportunities to strengthen your habits and antidotes.",
    minScore: 50,
    color: "from-amber-400 to-orange-500"
  },
  {
    range: "0-49",
    label: "Vulnerable",
    description: "Consider becoming more conscious of how social media influences you and build antidote strategies.",
    minScore: 0,
    color: "from-rose-500 to-red-600"
  }
];
