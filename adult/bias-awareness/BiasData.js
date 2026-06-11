export const BiasData = [
    {
        id: "confirmation_bias",
        title: "Confirmation Bias",
        description: "We favor information that supports what we already believe and ignore what challenges it.",
        question: "You strongly believe a new tech is safe. What do you do when you see a negative report?",
        instinctOptions: [
            "Read it carefully and reconsider your view",
            "Dismiss it as 'biased' or 'fake news'",
            "Search for three other reports that say it's safe"
        ],
        instinctCorrectIndex: 1, // Dismissing challenges
        bg: "01_confirmation_bias.png"
    },
    {
        id: "loss_aversion",
        title: "Loss Aversion",
        description: "We feel losses more strongly than gains.",
        question: "Which would upset you more? Losing $50 or missing a chance to win $100?",
        instinctOptions: [
            "Losing $50 (Losses hurt more)",
            "Missing the $100 win",
            "Neither, they feel the same"
        ],
        instinctCorrectIndex: 0, // Loss hurts more
        bg: "02_loss_aversion.png"
    },
    {
        id: "anchoring_bias",
        title: "Anchoring Bias",
        description: "We rely too much on the first piece of information we receive.",
        question: "A shirt is marked $100, then 'sale' $50. You buy it thinking it's a steal. Why?",
        instinctOptions: [
            "The $50 sale price is a fair market value",
            "The original $100 price made $50 seem like a bargain",
            "The color of the shirt was exactly what you wanted"
        ],
        instinctCorrectIndex: 1, // Original price was the anchor
        bg: "03_anchoring_bias.png"
    },
    {
        id: "availability_heuristic",
        title: "Availability Heuristic",
        description: "We judge the truth of something by how easily examples come to mind.",
        question: "Why are people more afraid of plane crashes than car crashes?",
        instinctOptions: [
            "Plane crashes are statistically more common",
            "Plane crashes are more vivid and memorable",
            "Cars are objectively safer than planes"
        ],
        instinctCorrectIndex: 1, // Vividness makes it seem more likely
        bg: "04_availability_heuristic.png"
    },
    {
        id: "hindsight_bias",
        title: "Hindsight Bias",
        description: "We tend to believe, after an event has occurred, that we would have predicted it.",
        question: "After a surprise sports win, you say 'I knew they'd win!' What is likely happening?",
        instinctOptions: [
            "You actually have psychic abilities",
            "Your brain is rewriting your memory to fit the outcome",
            "You were 100% certain before the game started"
        ],
        instinctCorrectIndex: 1, // Rewriting memory
        bg: "05_hindsight_bias.png"
    },
    {
        id: "overconfidence_bias",
        title: "Overconfidence Bias",
        description: "We overestimate our own skills and the accuracy of our predictions.",
        question: "80% of drivers think they are 'above average' skill. Why is this?",
        instinctOptions: [
            "Most drivers have exceptional training",
            "Most people overestimate their own abilities",
            "The 'average' is actually very low"
        ],
        instinctCorrectIndex: 1, // Overestimating abilities
        bg: "06_overconfidence_bias.png"
    },
    {
        id: "self_serving_bias",
        title: "Self-Serving Bias",
        description: "We credit wins to ourselves and blame losses on outside factors.",
        question: "You failed a test. Who or what is most likely to get the blame in your mind?",
        instinctOptions: [
            "Your own lack of preparation",
            "The 'unfair' questions or a loud testing room",
            "Your genuine misunderstanding of the material"
        ],
        instinctCorrectIndex: 1, // Blaming outside factors for failure
        bg: "07_self_serving_bias.png"
    },
    {
        id: "status_quo_bias",
        title: "Status Quo Bias",
        description: "We prefer things to stay the same and perceive change as a loss.",
        question: "Why do most people stick with their default phone settings for years?",
        instinctOptions: [
            "The default is always the best setting",
            "Changing things feels risky or unnecessarily effortful",
            "They simply didn't know settings could be changed"
        ],
        instinctCorrectIndex: 1, // Preferring the same/default
        bg: "08_status_quo_bias.png"
    },
    {
        id: "negativity_bias",
        title: "Negativity Bias",
        description: "Negative events affect us more psychologically than positive ones.",
        question: "You got 9 compliments and 1 insult today. What do you think about at night?",
        instinctOptions: [
            "The 9 compliments you received",
            "The 1 insult (Negative focus)",
            "A balanced mix of all feedback"
        ],
        instinctCorrectIndex: 1, // Focusing on the negative
        bg: "09_negativity_bias.png"
    },
    {
        id: "them_vs_us_bias",
        title: "Them vs Us Bias",
        description: "We divide people into groups and assume our group is superior or 'correct'.",
        question: "You see your rival school's team break a rule. You're more likely to think:",
        instinctOptions: [
            "They are just dishonest people by nature",
            "It was an honest mistake that anyone could make",
            "The referee was actually being too hard on them"
        ],
        instinctCorrectIndex: 0, // Assuming bad nature of 'them'
        bg: "10_them_vs_us_bias.png"
    }
];

export const IdentificationDistractors = [
    "Dunning-Kruger Effect",
    "Bandwagon Effect",
    "Halo Effect",
    "Framing Effect",
    "Optimism Bias",
    "Sunk Cost Fallacy",
    "Base Rate Fallacy",
    "Availability Cascade",
    "Choice-Supportive Bias",
    "Outcome Bias"
];
