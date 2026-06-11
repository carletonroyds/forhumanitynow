export const scenarios = [
    {
        id: 1,
        title: "The Missed Deadline",
        category: "Professional",
        image: 'work-deadline-img',
        description: "Your coworker was supposed to send a report by 5 PM yesterday, but you haven't received it yet.",
        options: [
            {
                text: "I'm checking in because the report is late and I'm wondering if there's a specific reason why you haven't been able to finish it yet?",
                correct: false,
                explanation: "This is blunt and lacks context. It might put the person on the defensive."
            },
            {
                text: "Is the report ready for me to review? I really need to have it finalized before our 10 AM meeting with the team today.",
                correct: false,
                explanation: "Better, but it focuses only on your immediate need without understanding their status."
            },
            {
                text: "I noticed the report didn't arrive by 5 PM; can you help me understand any blockers so we can update the timeline for the stakeholders?",
                correct: true,
                explanation: "Perfect! It combines the Big Picture (stakeholders/timeline) with the Detail (the specific time it was missed)."
            }
        ]
    },
    {
        id: 2,
        title: "Vacation Logistics",
        category: "Social",
        image: 'vacation-planning-img',
        description: "You're planning a group trip. Everyone is suggesting different dates and locations.",
        options: [
            {
                text: "Given we want a budget-friendly beach trip in July, can everyone list their available weekends so we can lock in the flights before prices rise?",
                correct: true,
                explanation: "Excellent. It states the context (budget/beach/July) and the specific detail needed (available weekends)."
            },
            {
                text: "When can everyone go on vacation? We need to figure out a time that works for the whole group so we can start looking at some actual destinations.",
                correct: false,
                explanation: "Too broad. This leads to endless back-and-forth without clear parameters."
            },
            {
                text: "I think we should go to Bali in the third week of July. Who's in? It seems like a great spot and that week usually has the best weather for surfing.",
                correct: false,
                explanation: "Too specific too fast. It ignores the group's preferences and doesn't gather facts."
            }
        ]
    },
    {
        id: 3,
        title: "Household Chores",
        category: "Personal",
        image: 'kitchen-chore-img',
        description: "Your partner hasn't done the dishes in three days, and the kitchen is messy.",
        options: [
            {
                text: "Can you do the dishes now? They've been sitting there for three days and it's making it really difficult for me to prepare any meals in this kitchen.",
                correct: false,
                explanation: "Direct but accusatory. It doesn't invite a productive conversation about the workload."
            },
            {
                text: "Since we agreed to swap chores weekly, I've noticed the dishes haven't been done since Tuesday; are you feeling overwhelmed or should we revisit our schedule?",
                correct: true,
                explanation: "Great balance. It references the agreement (context) and the specific delay (facts)."
            },
            {
                text: "Why is the kitchen so messy? I feel like I'm the only one trying to keep this place organized and it's becoming quite frustrating to deal with every day.",
                correct: false,
                explanation: "Rhetorical and passive-aggressive. Doesn't lead to a solution."
            }
        ]
    },
    {
        id: 4,
        title: "Medical Consultation",
        category: "Professional",
        image: 'doctor-consult-img',
        description: "You're at the doctor for a recurring headache that happens every morning.",
        options: [
            {
                text: "I have these really bad headaches. What should I take? I've tried a few over-the-counter things but nothing seems to be working as well as I'd hoped.",
                correct: false,
                explanation: "Lacks detail. The doctor needs more facts to make an informed decision."
            },
            {
                text: "I've been having sharp headaches at 7 AM daily for two weeks; given my history of migraines, could this be related to my new sleep schedule?",
                correct: true,
                explanation: "Perfect. It provides specific facts (time, duration, type) and context (migraine history/sleep)."
            },
            {
                text: "Are my headaches serious? I'm worried they might be a sign of something bigger and I want to make sure we're looking at all the possible causes today.",
                correct: false,
                explanation: "A valid concern, but doesn't provide the data needed for the doctor to answer accurately."
            }
        ]
    },
    {
        id: 5,
        title: "Social Cancellation",
        category: "Social",
        image: 'social-cancel-img',
        description: "A friend cancels your dinner plans for the third time in a row.",
        options: [
            {
                text: "That's fine, let's reschedule. I'm sure things are just busy on your end and we can find another night next week that works better for both of us.",
                correct: false,
                explanation: "Avoids the issue. This might lead to further frustration later."
            },
            {
                text: "Why do you keep canceling on me? It feels like you don't really want to hang out anymore and I'd appreciate some honesty about what's going on.",
                correct: false,
                explanation: "Direct but sounds like an attack. Might damage the friendship."
            },
            {
                text: "I value our friendship, but this is the third time we've rescheduled; is everything okay on your end, or is there a better way for us to plan time together?",
                correct: true,
                explanation: "Ideal. It affirms the relationship (context) and addresses the pattern (detail)."
            }
        ]
    },
    {
        id: 6,
        title: "Unexpected Bill",
        category: "Professional",
        image: 'finance-bill-img',
        description: "You receive a utility bill that is double the usual amount.",
        options: [
            {
                text: "I noticed my bill increased from $50 to $100 this month; can you help me understand if this is a rate hike or an error in my meter reading?",
                correct: true,
                explanation: "Great. It provides specific figures (facts) and asks for the reason (context)."
            },
            {
                text: "Why is my bill so high this month? I haven't changed my usage at all and I'm really confused about why I'm being charged so much more than usual.",
                correct: false,
                explanation: "Too vague for a customer service agent to help you quickly."
            },
            {
                text: "I'm not paying this bill until it's fixed. I need someone to look into this immediately because there's clearly a mistake and I won't be ignored.",
                correct: false,
                explanation: "Aggressive and non-constructive. Doesn't gather information."
            }
        ]
    },
    {
        id: 7,
        title: "Noisy Neighbor",
        category: "Personal",
        image: 'noisy-neighbor-img',
        description: "Your neighbor plays loud music late at night while you're trying to sleep.",
        options: [
            {
                text: "Turn the music down, I'm trying to sleep! It's way too late for this kind of noise and some of us actually have to get up early in the morning.",
                correct: false,
                explanation: "Demanding and likely to cause friction."
            },
            {
                text: "Is it possible to keep the volume lower after 11 PM? My bedroom wall is shared with your living room, and I have an early shift at 6 AM.",
                correct: true,
                explanation: "Excellent. It provides a specific time (detail) and the reason why it matters (context)."
            },
            {
                text: "Why is your music so loud every night? It's really hard to relax when the bass is shaking my walls and I'd really appreciate it if you could be more considerate.",
                correct: false,
                explanation: "Focuses on the problem rather than the solution or the impact on you."
            }
        ]
    },
    {
        id: 8,
        title: "The Performance Review",
        category: "Professional",
        image: 'career-raise-img',
        description: "You believe you've exceeded your targets and want to discuss a salary increase.",
        options: [
            {
                text: "I want a 10% raise because I've worked hard this year and I feel like my contribution to the team has been significant enough to warrant a better salary.",
                correct: false,
                explanation: "Lacks evidence. 'Working hard' is subjective."
            },
            {
                text: "I've exceeded my sales targets by 20% this quarter; based on this performance and the current market rate for my role, can we discuss a salary adjustment?",
                correct: true,
                explanation: "Perfect. It uses hard data (facts) and market context to justify the request."
            },
            {
                text: "When can we talk about my pay? I've been here for a while now and I'd like to sit down and review my compensation in light of my recent accomplishments.",
                correct: false,
                explanation: "Too open-ended. Doesn't set the stage for a successful negotiation."
            }
        ]
    },
    {
        id: 9,
        title: "Group Dining",
        category: "Social",
        image: 'restaurant-group-img',
        description: "A group of 8 friends is trying to pick a restaurant that satisfies everyone's dietary needs.",
        options: [
            {
                text: "Where does everyone want to eat? I'm open to anything as long as we can all find something we like on the menu and the atmosphere is decent.",
                correct: false,
                explanation: "Too many options. Leads to 'I don't know, where do you want to eat?'"
            },
            {
                text: "I'm hungry, let's just go to that pizza place downtown. They usually have plenty of space for a big group and the food is always served pretty quickly.",
                correct: false,
                explanation: "Ignores the group's needs (potential dietary restrictions)."
            },
            {
                text: "Since we have both vegans and gluten-free folks in the group, can we look at these three menus and see which one has the most options for everyone?",
                correct: true,
                explanation: "Strong. It identifies the constraints (context) and proposes a structured choice (detail)."
            }
        ]
    },
    {
        id: 10,
        title: "Constructive Peer Feedback",
        category: "Professional",
        image: 'peer-feedback-img',
        description: "A teammate's presentation style is very fast, making it hard to follow their great ideas.",
        options: [
            {
                text: "You talk too fast during meetings and it makes it really difficult for anyone to keep up with the points you're trying to make during the presentation.",
                correct: false,
                explanation: "Blunt criticism without the positive context."
            },
            {
                text: "Your ideas are fantastic, but I noticed you cover 40 slides in 10 minutes; could we slow down on the key points so the team can fully absorb the data?",
                correct: true,
                explanation: "Excellent. It balances the 'Big Picture' (great ideas) with the 'Detail' (40 slides in 10 mins)."
            },
            {
                text: "Can you make your slides simpler next time? It felt like there was just too much information on each page and it was overwhelming to look at.",
                correct: false,
                explanation: "Misidentifies the problem. The issue was the pace, not the slides themselves."
            }
        ]
    }
];
