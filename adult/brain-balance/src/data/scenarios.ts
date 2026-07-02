import { Scenario } from '../types';

// Local, self-contained scenario background images (see scripts/fetch-images.mjs).
// Using import.meta.env.BASE_URL keeps paths correct whether the app is served
// from a domain root or a GitHub Pages project subpath (e.g. /repo-name/).
const imagePath = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`;

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Public Speaking",
    text: "You have to give a presentation to 50 people. Your heart is racing and your palms are sweaty.",
    biasName: "Fear Avoidance",
    biasDescription: "Mistaking physical anxiety for a sign that you should quit.",
    choices: [
      { type: 'emotional', text: "I'll cancel. My body is telling me I'm not ready." },
      { type: 'logical', text: "I'll read the script exactly as written to avoid any mistakes." },
      { type: 'balanced', text: "I'll acknowledge my nerves as excitement and focus on the value I'm giving." }
    ],
    feedback: {
      emotionSignal: "Your brain is trying to protect you from social rejection.",
      logicCheck: "Reminds you that you've prepared and the audience wants you to succeed.",
      balancedInsight: "Nerves are energy; use them to fuel your delivery instead of fighting them.",
      abc: {
        a: "What am I feeling? (Fear of judgment) What's happening? (I'm prepared)",
        b: "Combine: I feel fear, but I have the skills to speak.",
        c: "Take action: Step on stage and start with a smile."
      }
    },
    bgImage: imagePath("scenario-01.jpg")
  },
  {
    id: 2,
    title: "Online Argument",
    text: "Someone posted a comment that completely misinterprets your point and calls you names.",
    biasName: "Reactive Aggression",
    biasDescription: "The urge to defend your ego immediately with an attack.",
    choices: [
      { type: 'emotional', text: "Reply immediately with an even sharper insult to put them in their place." },
      { type: 'logical', text: "Write a 10-paragraph rebuttal explaining every logical fallacy they used." },
      { type: 'balanced', text: "Close the app for 10 minutes, then decide if a short, calm clarification is worth it." }
    ],
    feedback: {
      emotionSignal: "Anger is signaling a boundary violation or perceived injustice.",
      logicCheck: "Notes that internet strangers rarely change their minds through insults.",
      balancedInsight: "Pausing breaks the reactive loop, allowing you to choose peace over 'winning'.",
      abc: {
        a: "What am I feeling? (Anger) What's happening? (A stranger is wrong)",
        b: "Combine: My anger is valid, but my time is more valuable than this fight.",
        c: "Take action: Walk away or post a neutral clarification."
      }
    },
    bgImage: imagePath("scenario-02.jpg")
  },
  {
    id: 3,
    title: "Trying Something New",
    text: "You're invited to a rock climbing gym, but you've never done it and you're afraid of looking clumsy.",
    biasName: "Status Quo Bias",
    biasDescription: "Preferring the safety of the known over the growth of the unknown.",
    choices: [
      { type: 'emotional', text: "Make an excuse to stay home where I'm comfortable and safe." },
      { type: 'logical', text: "Research climbing techniques for 3 hours before deciding if I'll go." },
      { type: 'balanced', text: "Go with the intention of being a beginner and focus on the fun of learning." }
    ],
    feedback: {
      emotionSignal: "Fear of looking foolish is a survival mechanism for group belonging.",
      logicCheck: "Everyone starts as a beginner; the gym is full of people focused on themselves.",
      balancedInsight: "Growth requires the 'beginner's mind'—accepting temporary clumsiness for long-term skill.",
      abc: {
        a: "What am I feeling? (Insecurity) What's happening? (A new opportunity)",
        b: "Combine: I feel awkward, but I want to learn new things.",
        c: "Take action: Put on the harness and try the easiest wall."
      }
    },
    bgImage: imagePath("scenario-03.jpg")
  },
  {
    id: 4,
    title: "Friend Conflict",
    text: "A close friend hasn't replied to your texts for two days. You feel ignored and hurt.",
    biasName: "Personalization Bias",
    biasDescription: "Assuming someone's behavior is a direct reaction to you.",
    choices: [
      { type: 'emotional', text: "Stop talking to them entirely until they apologize for ignoring me." },
      { type: 'logical', text: "Calculate the average response time and conclude our friendship is fading." },
      { type: 'balanced', text: "Consider they might be busy or overwhelmed, and send a low-pressure check-in." }
    ],
    feedback: {
      emotionSignal: "Hurt signals a threat to a valuable social connection.",
      logicCheck: "There are dozens of reasons for silence that have nothing to do with you.",
      balancedInsight: "Empathy for their potential stress prevents unnecessary drama in the relationship.",
      abc: {
        a: "What am I feeling? (Rejection) What's happening? (Silence)",
        b: "Combine: I feel hurt, but I don't have all the facts yet.",
        c: "Take action: Send a 'Thinking of you, hope you're okay' text."
      }
    },
    bgImage: imagePath("scenario-04.jpg")
  },
  {
    id: 5,
    title: "Risk Opportunity",
    text: "You have a chance to invest a small amount of savings into a project you believe in, but there's no guarantee.",
    biasName: "Loss Aversion",
    biasDescription: "The pain of losing is twice as powerful as the joy of gaining.",
    choices: [
      { type: 'emotional', text: "Keep the money in the bank. I can't stand the thought of losing a single cent." },
      { type: 'logical', text: "Wait until I have a 100% guaranteed success rate before investing." },
      { type: 'balanced', text: "Assess the risk vs. potential reward and only invest what I can afford to lose." }
    ],
    feedback: {
      emotionSignal: "Anxiety is trying to protect your resources for future survival.",
      logicCheck: "No risk means no growth; inflation slowly devalues 'safe' cash anyway.",
      balancedInsight: "Calculated risk is the only way to build a better future.",
      abc: {
        a: "What am I feeling? (Greed/Fear) What's happening? (An investment choice)",
        b: "Combine: I'm afraid of loss, but I see the potential for gain.",
        c: "Take action: Invest a responsible amount and monitor the results."
      }
    },
    bgImage: imagePath("scenario-05.jpg")
  },
  {
    id: 6,
    title: "Fear of Failure",
    text: "You want to start a creative project, but you're worried it won't be as good as you imagine.",
    biasName: "Perfectionism",
    biasDescription: "Using high standards as a shield against the vulnerability of being judged.",
    choices: [
      { type: 'emotional', text: "Wait for the 'perfect' moment when I feel 100% confident and inspired." },
      { type: 'logical', text: "Create a 50-step plan and don't start until every detail is mapped out." },
      { type: 'balanced', text: "Start with a 'messy' first draft just to get the momentum going." }
    ],
    feedback: {
      emotionSignal: "Fear is protecting your identity as a 'talented' person.",
      logicCheck: "The first version of everything is usually bad; iteration is the only path to quality.",
      balancedInsight: "Done is better than perfect. Momentum creates more confidence than planning.",
      abc: {
        a: "What am I feeling? (Pressure) What's happening? (Starting a project)",
        b: "Combine: I want it to be great, but I have to start somewhere.",
        c: "Take action: Spend 15 minutes on the first rough sketch."
      }
    },
    bgImage: imagePath("scenario-06.jpg")
  },
  {
    id: 7,
    title: "First Impression Bias",
    text: "You meet someone new who reminds you of a person you used to dislike. You feel instant friction.",
    biasName: "Halo/Horn Effect",
    biasDescription: "Judging a whole person based on one trait or a past association.",
    choices: [
      { type: 'emotional', text: "Avoid them. My 'gut feeling' is telling me they are a bad person." },
      { type: 'logical', text: "List all the ways they are similar to the person I disliked to justify my feeling." },
      { type: 'balanced', text: "Acknowledge the association, but look for three things that make them unique." }
    ],
    feedback: {
      emotionSignal: "Pattern matching is trying to help you avoid past pain.",
      logicCheck: "This is a different human being with a different life story.",
      balancedInsight: "Curiosity is the antidote to prejudice; give them a clean slate.",
      abc: {
        a: "What am I feeling? (Dislike) What's happening? (Meeting someone new)",
        b: "Combine: I feel a bias, but I want to be fair and open-minded.",
        c: "Take action: Ask them a question about their interests."
      }
    },
    bgImage: imagePath("scenario-07.jpg")
  },
  {
    id: 8,
    title: "Pressure Decision",
    text: "A salesperson tells you a 'limited time offer' expires in 5 minutes. You feel rushed and excited.",
    biasName: "Scarcity Bias",
    biasDescription: "The fear of missing out overrides your ability to judge value.",
    choices: [
      { type: 'emotional', text: "Buy it immediately! I can't let this deal slip through my fingers." },
      { type: 'logical', text: "Ask for a 20-page contract to review every detail before the timer runs out." },
      { type: 'balanced', text: "Step away from the pressure. If it's a good deal now, it's worth a calm decision later." }
    ],
    feedback: {
      emotionSignal: "Excitement is a biological response to perceived limited resources.",
      logicCheck: "Artificial urgency is a common manipulation tactic to stop you from thinking.",
      balancedInsight: "True value doesn't disappear in 5 minutes; clarity is more valuable than a discount.",
      abc: {
        a: "What am I feeling? (Urgency) What's happening? (A sales tactic)",
        b: "Combine: I want the deal, but I don't like being pressured.",
        c: "Take action: Walk away and check if I still want it tomorrow."
      }
    },
    bgImage: imagePath("scenario-08.jpg")
  },
  {
    id: 9,
    title: "Fear Inflates Risk",
    text: "You read a scary news headline about a rare event and now you're afraid to travel.",
    biasName: "Availability Heuristic",
    biasDescription: "Judging the probability of an event based on how easily you can recall it.",
    choices: [
      { type: 'emotional', text: "Cancel all my travel plans. The world is clearly too dangerous right now." },
      { type: 'logical', text: "Read every news article about the event to 'stay informed' and safe." },
      { type: 'balanced', text: "Look at the actual statistics and realize the risk is still extremely low." }
    ],
    feedback: {
      emotionSignal: "Vivid stories trigger the brain's alarm system more than dry facts.",
      logicCheck: "One headline doesn't change global safety data or your personal risk level.",
      balancedInsight: "Don't let a single loud story drown out the quiet reality of safety.",
      abc: {
        a: "What am I feeling? (Vulnerability) What's happening? (A news story)",
        b: "Combine: I feel scared, but the data says I'm safe.",
        c: "Take action: Stick to my plans and enjoy the trip."
      }
    },
    bgImage: imagePath("scenario-09.jpg")
  },
  {
    id: 10,
    title: "Taking Initiative",
    text: "You see a problem at work or school that needs fixing, but it's not 'your job'.",
    biasName: "Bystander Effect",
    biasDescription: "The assumption that someone else will handle it so you don't have to.",
    choices: [
      { type: 'emotional', text: "Wait and see if anyone else notices. I don't want to be the 'annoying' one." },
      { type: 'logical', text: "Write a memo explaining why this is someone else's responsibility." },
      { type: 'balanced', text: "Take small, immediate action to fix it or bring it to the right person's attention." }
    ],
    feedback: {
      emotionSignal: "Social anxiety is trying to keep you from standing out or taking blame.",
      logicCheck: "If everyone waits, the problem grows; taking initiative builds leadership.",
      balancedInsight: "Responsibility is taken, not given. Small actions lead to big impacts.",
      abc: {
        a: "What am I feeling? (Hesitation) What's happening? (A problem needs solving)",
        b: "Combine: I'm worried about the spotlight, but I can help.",
        c: "Take action: Fix the issue or speak up to the team."
      }
    },
    bgImage: imagePath("scenario-10.jpg")
  }
];
