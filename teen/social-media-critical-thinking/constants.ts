import { Mechanism } from './types';

export const MECHANISMS: Mechanism[] = [
  { 
    id: 1, 
    name: "Dopamine Hijack", 
    trigger: "Algorithm-driven “likes,” endless scroll, novelty", 
    effect: "Addictive reward loops, impulsive checking, FOMO", 
    antidote: "Use time limits, dopamine detox days, prioritize in-person joy", 
    image: "/images/mechanism-1.jpg"
  },
  { 
    id: 2, 
    name: "Fear & Anger Amplification", 
    trigger: "Outrage headlines, emotionally charged content", 
    effect: "Activates amygdala, narrows thinking, promotes reactivity", 
    antidote: "Pause, label the emotion, verify the facts, take 3 slow breaths", 
    image: "/images/mechanism-2.jpg"
  },
  { 
    id: 3, 
    name: "Them-Us Bias", 
    trigger: "Echo chambers, political polarization, targeted messaging", 
    effect: "Reinforces in-group bias, reduces empathy for others", 
    antidote: "Follow diverse voices, ask “What might they be feeling?”, seek common ground", 
    image: "/images/mechanism-3.jpg"
  },
  { 
    id: 4, 
    name: "Confirmation Bias", 
    trigger: "Personalized feeds show what you already believe", 
    effect: "Reinforces existing beliefs, blocks learning", 
    antidote: "Intentionally search opposing views, reflect on “What if I’m wrong?”", 
    image: "/images/mechanism-4.jpg"
  },
  { 
    id: 5, 
    name: "Social Comparison Trap", 
    trigger: "Highlight reels of others’ lives, beauty filters", 
    effect: "Reduces self-esteem, increases anxiety", 
    antidote: "Practice gratitude, unfollow toxic comparisons, celebrate real accomplishments", 
    image: "/images/mechanism-5.jpg"
  },
  { 
    id: 6, 
    name: "Authority Bias", 
    trigger: "Influencers, “experts” without credentials", 
    effect: "Overtrusts confident or popular sources", 
    antidote: "Check credentials, fact-check, remember popularity ≠ truth", 
    image: "/images/mechanism-6.jpg"
  },
  { 
    id: 7, 
    name: "Scarcity & Urgency Triggers", 
    trigger: "Flash sales, countdowns, “limited time only”", 
    effect: "Triggers survival mode, impulsive decisions", 
    antidote: "Step back, ask “Do I really need this?”, wait 24 hours before acting", 
    image: "/images/mechanism-7.jpg"
  },
  { 
    id: 8, 
    name: "Deepfakes & Misinformation", 
    trigger: "AI-generated images, false quotes, memes", 
    effect: "Confuses truth detection, warps reality", 
    antidote: "Reverse image search, check multiple sources, ask “Who benefits from this?”", 
    image: "/images/mechanism-8.jpg"
  },
  { 
    id: 9, 
    name: "Repetition Effect", 
    trigger: "Same content shared repeatedly across platforms", 
    effect: "Makes lies feel true over time", 
    antidote: "Watch for repeat phrases, mentally tag them as “requires fact check”", 
    image: "/images/mechanism-9.jpg"
  },
  { 
    id: 10, 
    name: "Hijacking Mirror Neurons", 
    trigger: "Viral trends, mimicry challenges, contagious behavior", 
    effect: "Promotes automatic mimicry without thought", 
    antidote: "Ask: “Does this align with my values?”, pause before copying trends", 
    image: "/images/mechanism-10.jpg"
  }
];
