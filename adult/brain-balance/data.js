// Brain Balance — scenario content.
// Each scenario offers three responses: one led by the heart (emotional),
// one led by the head (logical, but rigid or overthought), and one balanced.

const SCENARIOS = [
  {
    id: 1,
    title: "Public Speaking",
    image: "assets/scene-01.jpg",
    text: "You have to give a presentation to 50 people. Your heart is racing and your palms are sweaty.",
    biasName: "Fear Avoidance",
    biasDescription: "Mistaking physical anxiety for a sign that you should quit.",
    choices: [
      { type: "emotional", text: "I'll cancel. My body is telling me I'm not ready." },
      { type: "logical", text: "I'll read the script word for word so I can't make any mistakes." },
      { type: "balanced", text: "I'll treat my nerves as excitement and focus on what I'm giving the audience." }
    ],
    feedback: {
      emotionSignal: "Your brain is trying to protect you from social rejection.",
      logicCheck: "You've prepared, and the audience wants you to succeed.",
      balancedInsight: "Nerves are energy. Use them to fuel your delivery instead of fighting them.",
      abc: {
        a: "Feeling: fear of judgment. Facts: I'm prepared.",
        b: "I feel fear, but I have the skills to speak.",
        c: "Step on stage and start with a smile."
      }
    }
  },
  {
    id: 2,
    title: "Online Argument",
    image: "assets/scene-02.jpg",
    text: "Someone posts a comment that completely misreads your point and calls you names.",
    biasName: "Reactive Aggression",
    biasDescription: "The urge to defend your ego immediately with an attack.",
    choices: [
      { type: "emotional", text: "Reply right away with an even sharper insult to put them in their place." },
      { type: "logical", text: "Write a 10-paragraph rebuttal listing every logical fallacy they used." },
      { type: "balanced", text: "Close the app for 10 minutes, then decide whether a short, calm clarification is worth it." }
    ],
    feedback: {
      emotionSignal: "Anger is signaling a crossed boundary or a perceived injustice.",
      logicCheck: "Internet strangers rarely change their minds because of insults.",
      balancedInsight: "Pausing breaks the reactive loop so you can choose peace over winning.",
      abc: {
        a: "Feeling: anger. Facts: a stranger misunderstood me.",
        b: "My anger is valid, but my time is worth more than this fight.",
        c: "Walk away, or post one neutral clarification."
      }
    }
  },
  {
    id: 3,
    title: "Trying Something New",
    image: "assets/scene-03.jpg",
    text: "You're invited to a rock climbing gym. You've never climbed and you're afraid of looking clumsy.",
    biasName: "Status Quo Bias",
    biasDescription: "Preferring the safety of the familiar over the growth of the unknown.",
    choices: [
      { type: "emotional", text: "Make an excuse and stay home where I'm comfortable." },
      { type: "logical", text: "Research climbing technique for three hours before deciding whether to go." },
      { type: "balanced", text: "Go as a beginner and focus on the fun of learning something new." }
    ],
    feedback: {
      emotionSignal: "Fear of looking foolish is an old instinct for staying accepted by the group.",
      logicCheck: "Everyone starts as a beginner, and most people at the gym are focused on themselves.",
      balancedInsight: "Growth needs a beginner's mind: accept a little clumsiness now for real skill later.",
      abc: {
        a: "Feeling: insecurity. Facts: a new opportunity.",
        b: "I feel awkward, but I want to learn new things.",
        c: "Put on the harness and try the easiest wall."
      }
    }
  },
  {
    id: 4,
    title: "Friend Conflict",
    image: "assets/scene-04.jpg",
    text: "A close friend hasn't replied to your texts for two days. You feel ignored and hurt.",
    biasName: "Personalization Bias",
    biasDescription: "Assuming someone's behavior is a direct reaction to you.",
    choices: [
      { type: "emotional", text: "Stop talking to them until they apologize for ignoring me." },
      { type: "logical", text: "Calculate their average reply time and conclude the friendship is fading." },
      { type: "balanced", text: "Consider that they may be busy or overwhelmed, and send a low-pressure check-in." }
    ],
    feedback: {
      emotionSignal: "Hurt signals a threat to a connection you value.",
      logicCheck: "There are dozens of reasons for silence that have nothing to do with you.",
      balancedInsight: "Empathy for what they might be going through prevents needless drama.",
      abc: {
        a: "Feeling: rejection. Facts: silence, and nothing more.",
        b: "I feel hurt, but I don't have all the facts yet.",
        c: "Send a “thinking of you, hope you're okay” text."
      }
    }
  },
  {
    id: 5,
    title: "Risk Opportunity",
    image: "assets/scene-05.jpg",
    text: "You could invest a small amount of savings in a project you believe in, but nothing is guaranteed.",
    biasName: "Loss Aversion",
    biasDescription: "The pain of losing feels about twice as strong as the joy of gaining.",
    choices: [
      { type: "emotional", text: "Keep it all in the bank. I can't stand the thought of losing a cent." },
      { type: "logical", text: "Wait until success is 100% guaranteed before investing anything." },
      { type: "balanced", text: "Weigh the risk against the reward, and only invest what I can afford to lose." }
    ],
    feedback: {
      emotionSignal: "Anxiety is trying to protect your resources for the future.",
      logicCheck: "Nothing is ever 100% certain, and no risk often means no growth.",
      balancedInsight: "A calculated, affordable risk is how a better future gets built.",
      abc: {
        a: "Feeling: fear of loss. Facts: a real but uncertain opportunity.",
        b: "I'm afraid of losing, but I can see the potential gain.",
        c: "Invest a responsible amount and keep an eye on it."
      }
    }
  },
  {
    id: 6,
    title: "Fear of Failure",
    image: "assets/scene-06.jpg",
    text: "You want to start a creative project, but you're worried it won't be as good as you imagine.",
    biasName: "Perfectionism",
    biasDescription: "Using high standards as a shield against the vulnerability of being judged.",
    choices: [
      { type: "emotional", text: "Wait for the perfect moment, when I feel fully confident and inspired." },
      { type: "logical", text: "Write a 50-step plan and don't begin until every detail is mapped out." },
      { type: "balanced", text: "Start a messy first draft just to get some momentum going." }
    ],
    feedback: {
      emotionSignal: "Fear is protecting your image of yourself as a talented person.",
      logicCheck: "First versions are usually rough. Improving through drafts is how quality happens.",
      balancedInsight: "Done beats perfect. Momentum builds more confidence than planning does.",
      abc: {
        a: "Feeling: pressure. Facts: I'm just starting a project.",
        b: "I want it to be great, but I have to start somewhere.",
        c: "Spend 15 minutes on a first rough sketch."
      }
    }
  },
  {
    id: 7,
    title: "First Impressions",
    image: "assets/scene-07.jpg",
    text: "You meet someone new who reminds you of a person you used to dislike. You feel instant friction.",
    biasName: "Halo / Horn Effect",
    biasDescription: "Judging a whole person by one trait or a past association.",
    choices: [
      { type: "emotional", text: "Avoid them. My gut says they're a bad person." },
      { type: "logical", text: "List every way they resemble the person I disliked, to justify the feeling." },
      { type: "balanced", text: "Notice the association, then look for three things that make them unique." }
    ],
    feedback: {
      emotionSignal: "Pattern-matching is trying to help you avoid past pain.",
      logicCheck: "This is a different person with a different life story.",
      balancedInsight: "Curiosity is the antidote to prejudice. Give them a clean slate.",
      abc: {
        a: "Feeling: dislike. Facts: I just met this person.",
        b: "I notice a bias, but I want to be fair and open-minded.",
        c: "Ask them a question about their interests."
      }
    }
  },
  {
    id: 8,
    title: "Pressure Decision",
    image: "assets/scene-08.jpg",
    text: "A salesperson says a “limited-time offer” expires in five minutes. You feel rushed and excited.",
    biasName: "Scarcity Bias",
    biasDescription: "Fear of missing out overrides your ability to judge value.",
    choices: [
      { type: "emotional", text: "Buy it now! I can't let this deal slip away." },
      { type: "logical", text: "Demand a 20-page contract and review every clause before the timer runs out." },
      { type: "balanced", text: "Step away from the pressure. A good deal now is still worth a calm decision later." }
    ],
    feedback: {
      emotionSignal: "Excitement is a natural response to something that seems scarce.",
      logicCheck: "Artificial urgency is a common sales tactic meant to stop you from thinking.",
      balancedInsight: "Real value doesn't vanish in five minutes. Clarity is worth more than a discount.",
      abc: {
        a: "Feeling: urgency. Facts: this is a sales tactic.",
        b: "I want the deal, but I don't like being pressured.",
        c: "Walk away and see if I still want it tomorrow."
      }
    }
  },
  {
    id: 9,
    title: "Fear Inflates Risk",
    image: "assets/scene-09.jpg",
    text: "You read a scary headline about a rare event, and now you're afraid to travel.",
    biasName: "Availability Heuristic",
    biasDescription: "Judging how likely something is by how easily you can picture it.",
    choices: [
      { type: "emotional", text: "Cancel all my travel plans. The world is clearly too dangerous right now." },
      { type: "logical", text: "Read every article about the event so I stay fully informed and safe." },
      { type: "balanced", text: "Look at the actual statistics, and see that the risk is still extremely low." }
    ],
    feedback: {
      emotionSignal: "Vivid stories trigger the brain's alarm system more than dry facts do.",
      logicCheck: "One headline doesn't change the safety data or your personal risk.",
      balancedInsight: "Don't let one loud story drown out the quiet reality of safety.",
      abc: {
        a: "Feeling: vulnerable. Facts: one news story.",
        b: "I feel scared, but the data says I'm safe.",
        c: "Keep my plans and enjoy the trip."
      }
    }
  },
  {
    id: 10,
    title: "Taking Initiative",
    image: "assets/scene-10.jpg",
    text: "You notice a problem at work or school that needs fixing, but it's not “your job.”",
    biasName: "Bystander Effect",
    biasDescription: "Assuming someone else will handle it, so you don't have to.",
    choices: [
      { type: "emotional", text: "Wait and see if anyone else notices. I don't want to be the annoying one." },
      { type: "logical", text: "Write a memo explaining why this is someone else's responsibility." },
      { type: "balanced", text: "Take a small step now: fix it, or tell the right person about it." }
    ],
    feedback: {
      emotionSignal: "Social anxiety is trying to keep you from standing out or getting blamed.",
      logicCheck: "If everyone waits, the problem grows. Taking initiative builds leadership.",
      balancedInsight: "Responsibility is taken, not given. Small actions lead to big impact.",
      abc: {
        a: "Feeling: hesitation. Facts: a problem needs solving.",
        b: "I'm wary of the spotlight, but I can help.",
        c: "Fix the issue, or speak up to the team."
      }
    }
  }
];

const REFLECTIONS = [
  "When did fear or frustration last make a decision for you?",
  "What might have gone differently if you had paused, asked, and balanced?",
  "What is one thing you'll do this week even though part of you hesitates?"
];
