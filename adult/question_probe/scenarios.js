/* Each option lists which qualities it carries: c = context, s = specifics, o = openness.
   The strongest question carries all three; the others are deliberately plausible. */
window.SCENARIOS = [
  {
    domain: "Work",
    title: "The missing figures",
    bg: "assets/bg-work-deadline.webp",
    text: "A colleague's figures for tomorrow's board pack were due at 5 p.m. yesterday. Nothing has arrived, and they haven't said a word.",
    goal: "You need the figures, and you need to know whether the deadline is still realistic.",
    options: [
      { dims: "cso", text: "The board pack goes to print at eight tomorrow and your figures haven't come through yet. What's standing in the way, and what would help you get them over the line?", note: "Names the stakes and the gap, then asks about the obstacle instead of assuming one." },
      { dims: "s", text: "Your figures were due at five yesterday. Can you send them within the hour?", note: "Precise, but it's a demand phrased as a question. Whatever is really holding them up stays hidden." },
      { dims: "co", text: "How are you finding the workload at the moment? I want to make sure we're all set up well for the board.", note: "Kind and open, but so indirect they may not realise you're asking about the overdue figures." }
    ],
    lesson: "When something is late, the most useful information is why. Asking about the obstacle gets you the figures and a realistic timeline."
  },
  {
    domain: "Health",
    title: "Twelve minutes with the doctor",
    bg: "assets/bg-doctor-consult.webp",
    text: "For three weeks you've woken with a headache most mornings. You have a twelve-minute appointment with your GP.",
    goal: "You want a sense of the likely cause and to know when to worry.",
    options: [
      { dims: "s", text: "I've had headaches most mornings for three weeks. Could I get something stronger than paracetamol?", note: "Some useful facts, but it jumps to a prescription before the cause is understood." },
      { dims: "co", text: "I'm really worried these headaches might be something serious. What do you think is going on?", note: "Honest and open, but without details the doctor has to spend your twelve minutes extracting them." },
      { dims: "cso", text: "Since I started night shifts I've woken with a headache behind my right eye most mornings for three weeks, and my mother had migraines. What could explain that pattern, and what would mean I should come back sooner?", note: "Gives timing, location, a likely trigger and family history, then asks for both an explanation and warning signs." }
    ],
    lesson: "Clinicians diagnose from patterns. Bring the pattern (when, where, how long, what changed) and ask what it might mean rather than what to take."
  },
  {
    domain: "Home",
    title: "The uneven load",
    bg: "assets/bg-kitchen-chore.webp",
    text: "For a month you've done nearly every school run, meal and load of washing while your partner works late. You're exhausted and starting to resent it.",
    goal: "You want a fairer arrangement without starting a fight.",
    options: [
      { dims: "co", text: "Can we talk about how things are going at home? I'd like us both to feel it's fair.", note: "A good opening, but there's nothing concrete to discuss, so it's easy to agree and change nothing." },
      { dims: "cso", text: "I've done the school runs and dinners almost every day this month, and I'm running on empty. Could we look at the week together and work out what's realistic for each of us right now?", note: "States what has happened and how it's affecting you, then invites a joint solution." },
      { dims: "s", text: "Do you realise I've done every school run and every dinner for a month?", note: "The facts are right, but a rhetorical question lands as an accusation and invites defensiveness." }
    ],
    lesson: "Resentment hides in vague complaints. Specific facts plus a shared problem to solve keep the conversation about the load, not about who is the better partner."
  },
  {
    domain: "Money",
    title: "The doubled bill",
    bg: "assets/bg-finance-bill.webp",
    text: "Your energy bill has arrived at $412. In the past year it has never been above $210, and nothing in your household has changed.",
    goal: "You want to know whether the bill is correct before you pay it.",
    options: [
      { dims: "co", text: "I'm on a tight budget this month and my bill seems much higher than normal. Can you help me understand what's happened?", note: "Polite and open, but without figures the agent has nothing to look up." },
      { dims: "cs", text: "My bill has doubled to $412 and it's obviously a billing error. When will you correct it?", note: "Clear numbers, but it presumes the answer. If the cause is a tariff change, you've started an argument you can't win." },
      { dims: "cso", text: "My bill jumped from about $200 to $412 with no change in how we use energy. Before I pay, could you walk me through whether that's a new tariff, an estimated reading or something else?", note: "Gives the numbers, explains why you're asking, and lists the possibilities without accusing anyone." }
    ],
    lesson: "Service agents solve what they can see. Give them the numbers and the possible causes, and you turn a complaint into an investigation."
  },
  {
    domain: "Friendship",
    title: "The third cancellation",
    bg: "assets/bg-social-cafe.webp",
    text: "A close friend has cancelled dinner with you for the third time in six weeks, each time on the day.",
    goal: "You want to understand what's happening without damaging the friendship.",
    options: [
      { dims: "cs", text: "That's the third time in six weeks. Is our friendship still a priority for you?", note: "Honest about the pattern and the stakes, but it's a loaded yes-or-no question that puts them on trial." },
      { dims: "cso", text: "This is the third time in six weeks we've had to cancel, and I miss seeing you. Is something going on, or is there a way of planning that would work better for you right now?", note: "Acknowledges the pattern and what it means to you, and leaves room for whatever they're dealing with." },
      { dims: "o", text: "No worries at all! Shall we try next Thursday instead?", note: "Gracious, but it avoids the pattern entirely, and the fourth cancellation will be harder to raise." }
    ],
    lesson: "Patterns are worth naming gently. People often cancel because something is wrong, and a good question gives them room to say so."
  },
  {
    domain: "Work",
    title: "The pay conversation",
    bg: "assets/bg-history-screen.webp",
    text: "You beat your targets this year and took on a major client. You've also learned that your role pays well below the market rate. Your review is next week.",
    goal: "You want a meaningful raise, and a manager who is on your side.",
    options: [
      { dims: "co", text: "How do you feel I've performed this year, and where do you see my career going here?", note: "Collaborative, but the money is left unsaid and the evidence stays in your head." },
      { dims: "cso", text: "I delivered 120% of target and took on the Hartley account. Market data puts this role 10 to 15% above my current salary. What would it take for us to close that gap in this review cycle?", note: "Evidence first, a clear benchmark, then a question that makes your manager a partner in solving it." },
      { dims: "cs", text: "I hit 120% of target and benchmarks show I'm underpaid by about 12%. I'd like a 12% raise from January. Can we agree that today?", note: "Strong evidence, but an ultimatum invites a yes or a no, and a no is easier to give." }
    ],
    lesson: "In negotiation, “What would it take?” turns the other person from gatekeeper into problem-solver, especially when your evidence is already on the table."
  },
  {
    domain: "Neighbours",
    title: "The wall between you",
    bg: "assets/bg-noisy-neighbor.webp",
    text: "Your new neighbour's music comes through your bedroom wall until past midnight on weeknights. You start work at six.",
    goal: "You want quieter weeknights and a good relationship with the person next door.",
    options: [
      { dims: "so", text: "Is there any chance the music could stop by eleven on weeknights?", note: "Polite and specific, but without context they may not even know the sound carries." },
      { dims: "cso", text: "I'm in the flat next door. Our bedroom shares a wall with your living room and I'm up at five on weekdays. Could we find a way to keep things quieter after eleven on weeknights? And do tell me if anything from my side bothers you.", note: "Explains what they can't see, makes a specific request and offers reciprocity." },
      { dims: "c", text: "Would you mind keeping the noise down? Some of us have work in the morning.", note: "There's a reason in there, but the sarcasm guarantees a cooler reception." }
    ],
    lesson: "Most noisy neighbours don't know how much carries. Telling them what they can't see does most of the work for you."
  },
  {
    domain: "Family",
    title: "Dad and the car",
    bg: "assets/bg-intro-title.webp",
    text: "Your 81-year-old father has had two minor scrapes in the car this month. He's fiercely independent, and driving is how he sees his friends.",
    goal: "You want him safe, and you want him to keep his dignity and his social life.",
    options: [
      { dims: "o", text: "Dad, how are you getting on with everything these days? Anything you need help with?", note: "Caring, but so general he can simply say “fine” and the subject never comes up." },
      { dims: "s", text: "Dad, two scrapes in a month. Don't you think it's time to hand over the keys?", note: "The facts are clear, but the question has one acceptable answer, and he'll resist it." },
      { dims: "cso", text: "Dad, after the two scrapes this month I've been worried, and I know the car is how you see your friends. How has the driving felt lately, and what would help you stay independent safely?", note: "Names the facts and what matters to him, then makes him the author of the solution." }
    ],
    lesson: "When the subject is someone's independence, they need to help shape the answer. Asking what would help keeps them in charge of their own life."
  },
  {
    domain: "Planning",
    title: "Forty messages, no decision",
    bg: "assets/bg-vacation-planning.webp",
    text: "Eight friends want a long weekend away. Three weeks into the group chat there are forty messages and still no plan.",
    goal: "You want a decision this week that everyone can live with.",
    options: [
      { dims: "cso", text: "Flights stay under $300 if we book by the 15th. Could everyone mark which of these three June weekends work, and flag if any of the shortlisted places is a dealbreaker?", note: "A deadline, a constrained choice and a way to surface objections early. Easy to answer in one reply." },
      { dims: "o", text: "Where does everyone want to go, and when works?", note: "Fully open, which is exactly how the chat reached forty messages." },
      { dims: "cs", text: "I've found flights to Lisbon for $280, 14 to 16 June. Who's in?", note: "Concrete and decisive, but it skips the group's preferences, and the people who object will just go quiet." }
    ],
    lesson: "Groups stall on open questions. Narrow the options, set a deadline and ask about dealbreakers, and a decision becomes possible."
  },
  {
    domain: "Work",
    title: "“How did it go?”",
    bg: "assets/bg-work-deadline.webp",
    text: "A talented colleague rushed through forty slides in ten minutes at the leadership review. The ideas were strong, but the room lost the thread. Afterwards they ask you how it went.",
    goal: "You want them to improve, and to keep asking you for feedback.",
    options: [
      { dims: "c", text: "Great ideas! Maybe think about pacing next time?", note: "Encouraging, but too vague to act on. “Pacing” could mean anything." },
      { dims: "cso", text: "The pricing idea really landed. Forty slides in ten minutes made it hard for the room to keep up, though. Which three points mattered most to you? Could we build the next one around those?", note: "Specific praise, specific problem, then a question that helps them find the fix themselves." },
      { dims: "s", text: "Honestly? You went too fast. Forty slides in ten minutes is too many.", note: "Accurate, but it isn't a question and it isn't kind. They'll be less likely to ask you again." }
    ],
    lesson: "Good feedback ends with a question. It moves the conversation from judging the last attempt to planning the next one."
  }
];
