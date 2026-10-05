/* The ten biases, each with a case in which the bias is never named.
   `confusers` are the three plausible alternatives offered alongside the correct diagnosis. */
window.BIASES = {
  confirmation: {
    name: "Confirmation Bias",
    short: "Favouring evidence that supports what we already believe.",
    img: "assets/adult_confirmation_bias-jpg.webp",
    mechanism: "Once we hold a view, we search for, interpret and remember information in ways that protect it. Contrary evidence is scrutinised harshly; supporting evidence is waved through.",
    evidence: "Lord, Ross and Lepper (1979) gave supporters and opponents of capital punishment the same mixed set of studies. Both groups rated the studies supporting their own view as more convincing, and both left more entrenched than they arrived.",
    counter: "Consider the opposite. Before deciding, write down the strongest case that you are wrong, and ask someone who disagrees to stress-test it."
  },
  loss: {
    name: "Loss Aversion",
    short: "Feeling losses more intensely than equivalent gains.",
    img: "assets/adult_loss_aversion-jpg.webp",
    mechanism: "A loss registers more powerfully than a gain of the same size, so we reject favourable risks and cling to positions simply to avoid the sting of losing.",
    evidence: "In Kahneman and Tversky's prospect theory (1979) and the studies that followed, people typically demanded a potential gain roughly twice the size of the potential loss before accepting a fair coin-flip bet.",
    counter: "Frame broadly. Judge each decision as one of many you will make over a lifetime, and ask what you would choose if this were the hundredth such bet rather than the first."
  },
  anchoring: {
    name: "Anchoring Bias",
    short: "Leaning too heavily on the first number we encounter.",
    img: "assets/adult_anchoring_bias-jpg.webp",
    mechanism: "An initial figure, even an arbitrary one, becomes the reference point from which we adjust. We rarely adjust far enough.",
    evidence: "In Englich, Mussweiler and Strack (2006), experienced German judges rolled loaded dice before recommending a sentence. Those who rolled high recommended substantially longer sentences for the same case.",
    counter: "Set your own anchor first. Research the range independently before you hear the other party's number, and list the reasons their figure might be wrong."
  },
  availability: {
    name: "Availability Heuristic",
    short: "Judging likelihood by how easily examples come to mind.",
    img: "assets/adult_availability_heuristic-jpg.webp",
    mechanism: "Vivid, recent or heavily reported events are easy to recall, so we mistake them for common ones and misjudge real risk.",
    evidence: "Gerd Gigerenzer (2006) estimated that the shift from flying to driving in the year after 9/11 led to roughly 1,600 additional road deaths in the United States, far more than the passengers killed on the four flights.",
    counter: "Ask for the base rate. Before reacting to a vivid story, find out how often the event actually occurs, and compare it with the risk of the alternative."
  },
  hindsight: {
    name: "Hindsight Bias",
    short: "Believing, after the fact, that the outcome was predictable.",
    img: "assets/adult_hindsight_bias.jpg",
    mechanism: "Knowing how events turned out quietly rewrites our memory of what we knew before. Uncertainty that was real at the time disappears from the story.",
    evidence: "Fischhoff and Beyth (1975) asked people to estimate the odds of outcomes of President Nixon's 1972 visits to China and the USSR. Afterwards, they recalled having given higher odds to the events that actually occurred.",
    counter: "Keep a decision journal. Record what you knew, what you expected and how confident you were at the time, then judge decisions by that, not by the outcome."
  },
  overconfidence: {
    name: "Overconfidence Bias",
    short: "Overestimating our own knowledge, skill and accuracy.",
    img: "assets/adult_overconfidence_bias-jpg.webp",
    mechanism: "We are more certain than our track record justifies. Our estimates are too narrow and our plans assume that nothing will go wrong.",
    evidence: "In Svenson's study (1981), 93% of the American drivers surveyed rated themselves as more skilful than the median driver, which is statistically impossible.",
    counter: "Run a pre-mortem. Imagine it is a year from now and the plan has failed, then write down why. Widen every estimate and budget for the reasons you found."
  },
  selfserving: {
    name: "Self-Serving Bias",
    short: "Crediting success to ourselves and failure to circumstance.",
    img: "assets/adult_self_serving_bias-jpg.webp",
    mechanism: "To protect self-esteem we attribute good outcomes to our skill and bad outcomes to luck, timing or other people, which means we learn the wrong lessons from both.",
    evidence: "A meta-analysis by Mezulis and colleagues (2004), covering 266 studies, found the self-serving attributional bias across ages, cultures and settings.",
    counter: "Apply one standard. For every success, ask what role luck played; for every failure, ask what you controlled. Use the same questions in both directions."
  },
  statusquo: {
    name: "Status Quo Bias",
    short: "Preferring the current state of affairs because it is current.",
    img: "assets/adult_status_quo_bias-jpg.webp",
    mechanism: "The existing option feels safe and switching feels like effort and risk, so defaults persist long after better choices become available.",
    evidence: "Madrian and Shea (2001) found that when a US employer switched to enrolling new staff in its retirement plan automatically, participation among new hires rose from about 37% to 86%. The plan was identical; only the default had changed.",
    counter: "Use the reversal test. Ask: if I were choosing from scratch today, would I pick what I have now? If not, the only thing keeping it is inertia."
  },
  negativity: {
    name: "Negativity Bias",
    short: "Giving negative information more weight than positive.",
    img: "assets/adult_negativity_bias-jpg.webp",
    mechanism: "Criticism, threats and setbacks command attention and linger in memory, while praise and good news fade quickly, so the overall picture tilts darker than the facts.",
    evidence: "Reviewing a wide body of research, Baumeister and colleagues (2001) concluded that “bad is stronger than good” across relationships, feedback, learning and health. Gottman's studies of couples found stable relationships needed roughly five positive interactions for every negative one.",
    counter: "Read the whole ledger. Write down the positives alongside the criticism, weigh them deliberately, and wait a day before acting on a negative reaction."
  },
  themus: {
    name: "Them-vs-Us Bias",
    short: "Favouring our own group and judging outsiders more harshly.",
    img: "assets/adult_them_vs_us_bias-jpg.webp",
    mechanism: "We explain our own group's failings by circumstance and the other group's by character. Group membership quietly changes the standard of evidence.",
    evidence: "In Henri Tajfel's minimal group experiments (1971), schoolboys divided by a trivial preference for one painter over another consistently favoured their own group, even at the cost of a larger total reward.",
    counter: "Individuate. Picture a specific person from the other group, apply the explanation you would give for one of your own, and look for the identities you share."
  }
};

window.CASES = [
  {
    bias: "confirmation", domain: "Strategy", title: "The due diligence",
    text: "You have championed an acquisition for months. Two days before the board meeting, an analyst's report flags serious concerns about the target's customer churn. You email two contacts you know are enthusiastic about the deal and ask them to confirm the business is sound.",
    confusers: ["overconfidence", "selfserving", "anchoring"]
  },
  {
    bias: "loss", domain: "Money", title: "The coin toss",
    text: "A colleague offers a friendly bet on a fair coin: heads, you win $150; tails, you lose $100. The sum is trivial to your finances and the odds are plainly in your favour, yet you decline without a second thought.",
    confusers: ["negativity", "statusquo", "overconfidence"]
  },
  {
    bias: "anchoring", domain: "Career", title: "The generous offer",
    text: "A recruiter asks your current salary and you tell them: $82,000. They offer $90,000 and you accept, pleased with the increase. A month later you find market data placing the role at $110,000 to $120,000.",
    confusers: ["loss", "availability", "statusquo"]
  },
  {
    bias: "availability", domain: "Family", title: "The long drive",
    text: "After a week of coverage of a passenger jet crash, you cancel your family's flights and drive 900 kilometres instead, over two long days on the motorway. It feels like the responsible choice.",
    confusers: ["negativity", "loss", "confirmation"]
  },
  {
    bias: "hindsight", domain: "Leadership", title: "The post-mortem",
    text: "A product launch has failed. In the review, three directors agree that the warning signs were obvious. Six months ago those same directors approved it with enthusiasm, and, if you are honest, it now looks obvious to you too.",
    confusers: ["selfserving", "overconfidence", "confirmation"]
  },
  {
    bias: "overconfidence", domain: "Home", title: "The renovation",
    text: "You estimate that your kitchen renovation will take six weeks and cost $40,000. You have never managed a building project, but you have thought it through carefully, so you set aside no contingency for time or money.",
    confusers: ["anchoring", "statusquo", "availability"]
  },
  {
    bias: "selfserving", domain: "Work", title: "Two quarters",
    text: "In the first quarter your team beats its targets, and you credit the new strategy you introduced. In the second the numbers fall, and you explain to your manager that market headwinds and a difficult hiring pool were to blame.",
    confusers: ["hindsight", "confirmation", "themus"]
  },
  {
    bias: "statusquo", domain: "Money", title: "The default fund",
    text: "Ten years ago you were enrolled in your employer's default pension fund. Its fees are three times those of an equivalent fund on the same platform, available in a few clicks. You have meant to look into it for years but have never switched.",
    confusers: ["loss", "anchoring", "overconfidence"]
  },
  {
    bias: "negativity", domain: "Work", title: "The annual review",
    text: "Your annual review contains eleven paragraphs of genuine praise and one suggestion about delegating more. Three days later the suggestion is the only part you can quote word for word, and you have begun to wonder whether your job is at risk.",
    confusers: ["selfserving", "availability", "confirmation"]
  },
  {
    bias: "themus", domain: "Organisation", title: "After the merger",
    text: "Since your company merged with a competitor, you notice a pattern. When one of “their” managers misses a deadline, colleagues call it typical of that culture. When one of “ours” does, it was an unusually difficult week.",
    confusers: ["selfserving", "confirmation", "negativity"]
  }
];
